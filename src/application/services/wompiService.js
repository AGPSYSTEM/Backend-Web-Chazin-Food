const crypto = require('crypto');
const VentaService = require('./ventaService');
const { Venta, sequelize } = require('../../persistence/models');

class WompiService {
  /**
   * Obtiene la URL base de Wompi según el ambiente configurado
   */
  static getBaseUrl() {
    const isProd = process.env.WOMPI_ENV === 'production';
    return isProd ? 'https://production.wompi.co/v1' : 'https://sandbox.wompi.co/v1';
  }

  /**
   * Genera la firma criptográfica de integridad SHA-256 exigida por Wompi
   * Fórmula: SHA256(referencia + montoEnCentavos + moneda + secretoIntegridad)
   */
  static generarFirmaIntegridad(referencia, montoEnCentavos, moneda = 'COP') {
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    if (!integritySecret) {
      throw new Error('WOMPI_INTEGRITY_SECRET no está configurado en las variables de entorno.');
    }
    const cadena = `${referencia}${montoEnCentavos}${moneda}${integritySecret}`;
    return crypto.createHash('sha256').update(cadena, 'utf8').digest('hex');
  }

  /**
   * Valida la firma de un evento webhook de Wompi
   */
  static validarFirmaWebhook(body) {
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    if (!eventsSecret || !body || !body.signature) return false;

    const { properties, checksum } = body.signature;
    const timestamp = body.timestamp;
    if (!properties || !checksum) return false;

    // Obtener valores encadenados de las propiedades indicadas
    let cadena = '';
    for (const prop of properties) {
      const parts = prop.split('.');
      let val = body.data;
      for (const p of parts) {
        if (val) val = val[p];
      }
      cadena += (val !== undefined && val !== null) ? val : '';
    }
    cadena += `${timestamp}${eventsSecret}`;

    const calculatedChecksum = crypto.createHash('sha256').update(cadena, 'utf8').digest('hex');
    return calculatedChecksum === checksum;
  }

  /**
   * Recalcula el subtotal del pedido con precios reales de la base de datos
   * (producto/variante, eventos activos y adiciones) para no confiar en montos enviados por el cliente.
   * Retorna null si algún ítem no puede resolverse con certeza.
   */
  static async calcularSubtotalServidor(pedidoData) {
    const { Variante, Product, Insumo, Evento } = require('../../persistence/models');
    const items = pedidoData.detalles || pedidoData.items || pedidoData.productos || [];
    if (!Array.isArray(items) || items.length === 0) return null;

    const hoy = new Date().toISOString().slice(0, 10);
    const eventosActivos = await Evento.findAll({ where: { estado: 1 } }).catch(() => []);
    const eventosVigentes = eventosActivos.filter(e =>
      (!e.fechaInicio || String(e.fechaInicio) <= hoy) && (!e.fechaFin || String(e.fechaFin) >= hoy)
    );

    let subtotal = 0;
    for (const it of items) {
      const cantidad = Math.max(1, Number(it.cantidad || 1));
      let precioBase = null;
      let idProducto = it.idProducto || null;

      if (it.idVariante || it.varianteId) {
        const variante = await Variante.findByPk(it.idVariante || it.varianteId).catch(() => null);
        if (variante) {
          idProducto = idProducto || variante.idProducto;
        }
      }
      if (idProducto) {
        const producto = await Product.findByPk(idProducto).catch(() => null);
        if (producto) precioBase = Number(producto.precio || 0);
      }
      if (precioBase === null || !(precioBase > 0)) return null;

      // Precio mínimo legítimo considerando eventos vigentes asociados al producto
      let precioUnitario = precioBase;
      for (const ev of eventosVigentes) {
        let aplica = Number(ev.idProducto) === Number(idProducto);
        if (!aplica && ev.productosAsociados) {
          try {
            const asociados = JSON.parse(ev.productosAsociados);
            if (Array.isArray(asociados)) {
              const match = asociados.find(p => Number(p.idProducto || p.id) === Number(idProducto));
              if (match) {
                aplica = true;
                const precioAsoc = Number(match.precioPromocional || match.nuevoPrecio || match.precio || 0);
                if (precioAsoc > 0) precioUnitario = Math.min(precioUnitario, precioAsoc);
              }
            }
          } catch (e) { /* ignorar */ }
        }
        if (!aplica) continue;
        if (Number(ev.nuevoPrecio) > 0) {
          precioUnitario = Math.min(precioUnitario, Number(ev.nuevoPrecio));
        } else if (Number(ev.descuento) > 0) {
          precioUnitario = Math.min(precioUnitario, Math.round(precioBase * (1 - Number(ev.descuento) / 100)));
        }
      }

      let adicionesTotal = 0;
      if (Array.isArray(it.adiciones)) {
        for (const ad of it.adiciones) {
          const adId = typeof ad === 'object' ? (ad.idAdicion || ad.idInsumo || ad.id) : ad;
          const adCant = typeof ad === 'object' ? Math.max(1, Number(ad.cantidad || 1)) : 1;
          if (!adId) continue;
          const insumoAd = await Insumo.findByPk(adId).catch(() => null);
          if (insumoAd) adicionesTotal += Number(insumoAd.precioAdicion || 0) * adCant;
        }
      }

      subtotal += (precioUnitario + adicionesTotal) * cantidad;
    }
    return Math.round(subtotal);
  }

  /**
   * Crea una intención de pago: genera la referencia única, registra la orden en estado PENDIENTE
   * y calcula la firma de integridad para el widget de Wompi.
   */
  static async crearIntencionPago(pedidoData, user) {
    const userId = user?.idUsuario || user?.id || user?._id || pedidoData.idUsuario;
    if (!userId) {
      const err = new Error('Usuario no especificado para iniciar el pago.');
      err.statusCode = 400;
      throw err;
    }

    const totalCliente = Number(pedidoData.total || 0);
    if (totalCliente <= 0) {
      const err = new Error('El monto total de la venta debe ser mayor a 0.');
      err.statusCode = 400;
      throw err;
    }

    // Validación del monto en servidor: el total cobrado nunca puede ser inferior al precio real
    // menos el máximo descuento de fidelidad permitido (15%).
    const subtotalServidor = await this.calcularSubtotalServidor(pedidoData);
    if (subtotalServidor !== null) {
      const minimoPermitido = Math.round(subtotalServidor * 0.85) - 100;
      if (totalCliente < minimoPermitido) {
        const err = new Error('El total del pedido no coincide con los precios vigentes. Actualiza tu carrito e inténtalo de nuevo.');
        err.statusCode = 400;
        throw err;
      }
    }

    // Generar referencia única para Wompi
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referencia = `CHAZIN-${timestamp}-${randomSuffix}`;
    const moneda = 'COP';

    // Preparar y registrar la orden en BD como PENDIENTE de pago
    const datosConWompi = {
      ...pedidoData,
      idUsuario: userId,
      origen: 'ONLINE',
      metodoPago: 'Wompi',
      estadoPago: 'Pendiente',
      estadoAprobacion: 'PENDIENTE',
      estadoEntrega: 'PENDIENTE',
      observaciones: JSON.stringify({
        ...(typeof pedidoData.observaciones === 'string' ? (() => {
          try { return JSON.parse(pedidoData.observaciones); } catch (e) { return { nota: pedidoData.observaciones }; }
        })() : (pedidoData.observaciones || {})),
        wompiReference: referencia,
        moneda,
        metodoPago: 'Wompi',
        estadoPago: 'Pendiente',
        fechaIntencion: new Date().toISOString()
      })
    };

    const ventaCreada = await VentaService.create(datosConWompi);

    // El monto a cobrar es el total calculado y persistido por el servidor
    const totalServidor = Number(ventaCreada.total || totalCliente);
    const montoEnCentavos = Math.round(totalServidor * 100);
    const firmaIntegridad = this.generarFirmaIntegridad(referencia, montoEnCentavos, moneda);

    try {
      const ventaRow = await Venta.findByPk(ventaCreada.idVenta || ventaCreada.id);
      if (ventaRow) {
        let obs = {};
        try { obs = JSON.parse(ventaRow.observaciones || '{}'); } catch (e) { obs = {}; }
        obs.montoEnCentavos = montoEnCentavos;
        ventaRow.observaciones = JSON.stringify(obs);
        await ventaRow.save();
      }
    } catch (e) {
      console.warn('No se pudo guardar el monto Wompi en la venta:', e.message);
    }

    return {
      success: true,
      referencia,
      montoEnCentavos,
      moneda,
      firma: firmaIntegridad,
      publicKey: process.env.WOMPI_PUBLIC_KEY,
      ventaId: ventaCreada.idVenta || ventaCreada.id,
      numeroVenta: ventaCreada.numeroVenta || ventaCreada.codigoPedido
    };
  }

  /**
   * Consulta el estado de una transacción directamente en la API de Wompi
   * y actualiza el pedido correspondiente en la base de datos.
   */
  static async verificarTransaccion(idTransaccion) {
    if (!idTransaccion) {
      const err = new Error('ID de transacción requerido');
      err.statusCode = 400;
      throw err;
    }

    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('WOMPI_PRIVATE_KEY no está configurada.');
    }

    const url = `${this.getBaseUrl()}/transactions/${idTransaccion}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error consultando transacción ${idTransaccion} a Wompi:`, errorText);
      const err = new Error(`Error al consultar Wompi: ${response.statusText}`);
      err.statusCode = response.status;
      throw err;
    }

    const wompiResult = await response.json();
    const tx = wompiResult.data;
    if (!tx) {
      throw new Error('Respuesta inválida de Wompi');
    }

    const referencia = tx.reference;
    const estadoWompi = tx.status; // 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'
    const metodoPagoTipo = tx.payment_method_type || 'Wompi';

    // Buscar la venta en BD por la referencia almacenada en observaciones (sin límite de registros)
    const { Op } = require('sequelize');
    const ventaEncontrada = referencia
      ? await Venta.findOne({
          where: { observaciones: { [Op.like]: `%${referencia}%` } },
          order: [['idVenta', 'DESC']]
        })
      : null;

    if (ventaEncontrada) {
      let obsObj = {};
      try {
        obsObj = JSON.parse(ventaEncontrada.observaciones || '{}');
      } catch (e) {
        obsObj = {};
      }

      // Verificar que el monto pagado corresponda al registrado en la venta
      const montoEsperado = Number(obsObj.montoEnCentavos || Math.round(Number(ventaEncontrada.total || 0) * 100));
      const montoPagado = Number(tx.amount_in_cents || 0);
      const montoCoincide = !montoPagado || !montoEsperado || Math.abs(montoPagado - montoEsperado) <= 100;

      obsObj.wompiTransactionId = tx.id;
      obsObj.wompiStatus = estadoWompi;
      obsObj.paymentMethodType = metodoPagoTipo;
      obsObj.wompiPaymentMethod = tx.payment_method;

      if (estadoWompi === 'APPROVED' && montoCoincide) {
        const yaAprobada = ventaEncontrada.estadoAprobacion === 'APROBADO';
        obsObj.estadoPago = 'Pagado';
        obsObj.metodoPago = `Wompi (${metodoPagoTipo})`;
        obsObj.estadoAprobacion = 'APROBADO';
        if (!yaAprobada) {
          obsObj.horaEstado = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' });
          obsObj.fechaAprobacionPago = new Date().toISOString();
        }

        await ventaEncontrada.update({
          estadoEntrega: yaAprobada ? ventaEncontrada.estadoEntrega : 'PENDIENTE',
          estadoAprobacion: 'APROBADO',
          observaciones: JSON.stringify(obsObj)
        });

        // Registrar compra de fidelidad tras confirmación de pago en Wompi (idempotente)
        await VentaService.registrarFidelidadUnaVez(ventaEncontrada.idVenta);
      } else if (estadoWompi === 'APPROVED' && !montoCoincide) {
        obsObj.estadoPago = 'En revisión';
        obsObj.alertaMonto = `Monto pagado (${montoPagado}) distinto al esperado (${montoEsperado})`;
        await ventaEncontrada.update({ observaciones: JSON.stringify(obsObj) });
      } else if (estadoWompi === 'DECLINED' || estadoWompi === 'ERROR' || estadoWompi === 'VOIDED') {
        obsObj.estadoPago = 'Rechazado';
        obsObj.estadoAprobacion = 'RECHAZADO';
        const yaCancelada = ventaEncontrada.estadoEntrega === 'CANCELADO';

        await ventaEncontrada.update({ observaciones: JSON.stringify(obsObj) });

        // Cancelar la venta y reintegrar el inventario descontado (solo una vez)
        if (!yaCancelada) {
          await VentaService.updateEstado(ventaEncontrada.idVenta, 'CANCELADO').catch(err =>
            console.warn('Error reintegrando inventario por pago rechazado:', err.message)
          );
        }
      }

      return {
        success: true,
        estado: estadoWompi,
        aprobado: estadoWompi === 'APPROVED',
        referencia,
        transaccionId: tx.id,
        metodoPago: metodoPagoTipo,
        ventaId: ventaEncontrada.idVenta,
        numeroVenta: obsObj.codigoPedido || `VEN-${String(ventaEncontrada.idVenta).padStart(4, '0')}`
      };
    }

    return {
      success: true,
      estado: estadoWompi,
      aprobado: estadoWompi === 'APPROVED',
      referencia,
      transaccionId: tx.id,
      metodoPago: metodoPagoTipo
    };
  }

  /**
   * Procesa la notificación automática de Wompi (Webhook)
   */
  static async procesarWebhook(eventData) {
    if (!eventData || eventData.event !== 'transaction.updated') {
      return { received: true, ignored: true };
    }

    const tx = eventData.data?.transaction;
    if (!tx || !tx.id) {
      return { received: true, error: 'No transaction data in webhook' };
    }

    return this.verificarTransaccion(tx.id);
  }
}

module.exports = WompiService;
