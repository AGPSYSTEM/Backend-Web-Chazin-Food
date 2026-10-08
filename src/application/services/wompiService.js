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

    const total = Number(pedidoData.total || 0);
    if (total <= 0) {
      const err = new Error('El monto total de la venta debe ser mayor a 0.');
      err.statusCode = 400;
      throw err;
    }

    // Generar referencia única para Wompi
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referencia = `CHAZIN-${timestamp}-${randomSuffix}`;
    const montoEnCentavos = Math.round(total * 100);
    const moneda = 'COP';

    // Generar la firma SHA-256
    const firmaIntegridad = this.generarFirmaIntegridad(referencia, montoEnCentavos, moneda);

    // Preparar y registrar la orden en BD como PENDIENTE de pago
    const datosConWompi = {
      ...pedidoData,
      idUsuario: userId,
      metodoPago: 'Wompi',
      estadoPago: 'Pendiente',
      estadoAprobacion: 'PENDIENTE',
      estadoEntrega: 'PENDIENTE',
      observaciones: JSON.stringify({
        ...(typeof pedidoData.observaciones === 'string' ? (() => {
          try { return JSON.parse(pedidoData.observaciones); } catch (e) { return { nota: pedidoData.observaciones }; }
        })() : (pedidoData.observaciones || {})),
        wompiReference: referencia,
        montoEnCentavos,
        moneda,
        metodoPago: 'Wompi',
        estadoPago: 'Pendiente',
        fechaIntencion: new Date().toISOString()
      })
    };

    const ventaCreada = await VentaService.create(datosConWompi);

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

    // Buscar la venta en BD por la referencia almacenada en observaciones
    const ventas = await Venta.findAll({ order: [['idVenta', 'DESC']], limit: 50 });
    let ventaEncontrada = null;

    for (const v of ventas) {
      if (v.observaciones && v.observaciones.includes(referencia)) {
        ventaEncontrada = v;
        break;
      }
    }

    if (ventaEncontrada) {
      let obsObj = {};
      try {
        obsObj = JSON.parse(ventaEncontrada.observaciones || '{}');
      } catch (e) {
        obsObj = {};
      }

      obsObj.wompiTransactionId = tx.id;
      obsObj.wompiStatus = estadoWompi;
      obsObj.paymentMethodType = metodoPagoTipo;
      obsObj.wompiPaymentMethod = tx.payment_method;

      if (estadoWompi === 'APPROVED') {
        obsObj.estadoPago = 'Pagado';
        obsObj.metodoPago = `Wompi (${metodoPagoTipo})`;
        obsObj.estadoAprobacion = 'APROBADO';

        await ventaEncontrada.update({
          estadoEntrega: 'PREPARANDO',
          estadoAprobacion: 'APROBADO',
          observaciones: JSON.stringify(obsObj)
        });
      } else if (estadoWompi === 'DECLINED' || estadoWompi === 'ERROR' || estadoWompi === 'VOIDED') {
        obsObj.estadoPago = 'Rechazado';
        obsObj.estadoAprobacion = 'RECHAZADO';

        await ventaEncontrada.update({
          estadoEntrega: 'CANCELADO',
          estadoAprobacion: 'RECHAZADO',
          observaciones: JSON.stringify(obsObj)
        });
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
