const { Compra, DetalleCompraInsumo, Proveedor, Insumo, LoteInsumo, User, sequelize } = require('../../persistence/models');
const TrazabilidadService = require('./trazabilidadService');

const ESTADO_RECIBIDA = 'RECIBIDA';
const ESTADO_PENDIENTE = 'PENDIENTE';
const ESTADO_CANCELADA = 'CANCELADA';
const ESTADO_DEVUELTA_PARCIAL = 'DEVUELTA_PARCIAL';

function normalizarEstado(estado) {
  const e = String(estado || '').trim().toUpperCase();
  if (e === ESTADO_RECIBIDA) return ESTADO_RECIBIDA;
  if (e === ESTADO_PENDIENTE) return ESTADO_PENDIENTE;
  if (e === ESTADO_CANCELADA) return ESTADO_CANCELADA;
  if (e === ESTADO_DEVUELTA_PARCIAL || e === 'PARCIAL' || e === 'DEVUELTA') return ESTADO_DEVUELTA_PARCIAL;
  if (e === 'COMPLETADA') return ESTADO_RECIBIDA;
  if (e === 'ANULADA') return ESTADO_CANCELADA;
  if (e === 'PENDIENTE' || e === 'PENDIENTES' || e === 'PEND') return ESTADO_PENDIENTE;
  if (e === 'RECIBIDA' || e === 'RECIBIDO' || e === 'REC') return ESTADO_RECIBIDA;
  if (e === 'CANCELADA' || e === 'CANCELADO' || e === 'ANULADA' || e === 'ANULADO') return ESTADO_CANCELADA;
  return ESTADO_PENDIENTE;
}

function esEstadoRecibida(estado) {
  return normalizarEstado(estado) === ESTADO_RECIBIDA;
}

function esEstadoPendiente(estado) {
  return normalizarEstado(estado) === ESTADO_PENDIENTE;
}

function esEstadoCancelada(estado) {
  return normalizarEstado(estado) === ESTADO_CANCELADA;
}

class CompraService {
  static async getAll() {
    const compras = await Compra.findAll({
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre', 'nombreContacto', 'telefono', 'correo'] },
        { model: User, as: 'usuarioCancelacion', attributes: ['idUsuario', 'nombre', 'apellidos'], required: false },
        {
          model: DetalleCompraInsumo, as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: LoteInsumo, as: 'lotes', required: false }
      ],
      order: [['idCompra', 'DESC']]
    });
    return compras.map(c => {
      let detCanc = null;
      if (c.detallesCancelacion) {
        try {
          detCanc = typeof c.detallesCancelacion === 'string' && (c.detallesCancelacion.startsWith('[') || c.detallesCancelacion.startsWith('{'))
            ? JSON.parse(c.detallesCancelacion)
            : c.detallesCancelacion;
        } catch (_) {
          detCanc = c.detallesCancelacion;
        }
      }

      return {
        id: c.idCompra,
        idCompra: c.idCompra,
        idProveedor: c.idProveedor,
        numeroFactura: c.numeroFactura || `COMP-${String(c.idCompra).padStart(4, '0')}`,
        fechaFactura: c.fechaFactura || null,
        incluyeIva: c.incluyeIva ? 1 : 0,
        subtotal: parseFloat(c.subtotal || c.total || 0),
        iva: parseFloat(c.iva || 0),
        proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Sin proveedor',
        fechaCompra: c.fechaCompra,
        total: c.total,
        estado: c.estado,
        motivoCancelacion: c.motivoCancelacion || null,
        detallesCancelacion: detCanc,
        fechaCancelacion: c.fechaCancelacion || null,
        usuarioCancelacionId: c.usuarioCancelacionId || null,
        usuarioCancelacionNombre: c.usuarioCancelacion
          ? [c.usuarioCancelacion.nombre, c.usuarioCancelacion.apellidos].filter(Boolean).join(' ')
          : null,
        proveedor: c.proveedor || null,
        lotes: (c.lotes || []).map(l => ({
          idLote: l.idLote,
          idInsumo: l.idInsumo,
          numeroLote: l.numeroLote,
          cantidad: l.cantidad,
          cantidadDisponible: l.cantidadDisponible,
          fechaVencimiento: l.fechaVencimiento,
          estado: l.estado
        })),
        detalles: (c.detalles || []).map(d => {
          let lotesParsed = [];
          if (d.lotes) {
            try {
              lotesParsed = typeof d.lotes === 'string' && (d.lotes.startsWith('[') || d.lotes.startsWith('{'))
                ? JSON.parse(d.lotes)
                : d.lotes;
            } catch (_) {}
          }
          return {
            idDetalleCompra: d.idDetalleCompra,
            idInsumo: d.idInsumo,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal,
            numeroLote: d.numeroLote || null,
            fechaVencimiento: d.fechaVencimiento || null,
            lotes: Array.isArray(lotesParsed) ? lotesParsed : [],
            insumo: d.insumo || null
          };
        })
      };
    });
  }

  static async getById(id) {
    const c = await Compra.findByPk(id, {
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre', 'nombreContacto', 'telefono', 'correo'] },
        { model: User, as: 'usuarioCancelacion', attributes: ['idUsuario', 'nombre', 'apellidos'], required: false },
        {
          model: DetalleCompraInsumo, as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: LoteInsumo, as: 'lotes', required: false }
      ]
    });
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let detCanc = null;
    if (c.detallesCancelacion) {
      try {
        detCanc = typeof c.detallesCancelacion === 'string' && (c.detallesCancelacion.startsWith('[') || c.detallesCancelacion.startsWith('{'))
          ? JSON.parse(c.detallesCancelacion)
          : c.detallesCancelacion;
      } catch (_) {
        detCanc = c.detallesCancelacion;
      }
    }

    return {
      id: c.idCompra,
      idCompra: c.idCompra,
      idProveedor: c.idProveedor,
      numeroFactura: c.numeroFactura || `COMP-${String(c.idCompra).padStart(4, '0')}`,
      fechaFactura: c.fechaFactura || null,
      incluyeIva: c.incluyeIva ? 1 : 0,
      subtotal: parseFloat(c.subtotal || c.total || 0),
      iva: parseFloat(c.iva || 0),
      proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Sin proveedor',
      fechaCompra: c.fechaCompra,
      total: c.total,
      estado: c.estado,
      motivoCancelacion: c.motivoCancelacion || null,
      detallesCancelacion: detCanc,
      fechaCancelacion: c.fechaCancelacion || null,
      usuarioCancelacionId: c.usuarioCancelacionId || null,
      usuarioCancelacionNombre: c.usuarioCancelacion
        ? [c.usuarioCancelacion.nombre, c.usuarioCancelacion.apellidos].filter(Boolean).join(' ')
        : null,
      proveedor: c.proveedor || null,
      lotes: (c.lotes || []).map(l => ({
        idLote: l.idLote,
        idInsumo: l.idInsumo,
        numeroLote: l.numeroLote,
        cantidad: l.cantidad,
        cantidadDisponible: l.cantidadDisponible,
        fechaVencimiento: l.fechaVencimiento,
        estado: l.estado
      })),
      detalles: (c.detalles || []).map(d => {
        let lotesParsed = [];
        if (d.lotes) {
          try {
            lotesParsed = typeof d.lotes === 'string' && (d.lotes.startsWith('[') || d.lotes.startsWith('{'))
              ? JSON.parse(d.lotes)
              : d.lotes;
          } catch (_) {}
        }
        return {
          idDetalleCompra: d.idDetalleCompra,
          idInsumo: d.idInsumo,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal,
          numeroLote: d.numeroLote || null,
          fechaVencimiento: d.fechaVencimiento || null,
          lotes: Array.isArray(lotesParsed) ? lotesParsed : [],
          insumo: d.insumo || null
        };
      })
    };
  }

  static async create(data) {
    const estadoEntrada = data.estado !== undefined && data.estado !== null ? data.estado : 'RECIBIDA';

    // Si viene explícito PENDIENTE, se respeta PENDIENTE; si viene RECIBIDA o default, se crea en RECIBIDA
    // para reabastecer de inmediato el inventario tal como pide el usuario.
    const estadoNormalizado = (String(estadoEntrada).toUpperCase() === ESTADO_PENDIENTE)
      ? ESTADO_PENDIENTE
      : ESTADO_RECIBIDA;

    console.log(`==========================================================================`);
    console.log(`[COMPRA CREATE] NUEVA COMPRA solicitada`);
    console.log(`[COMPRA CREATE]   - estadoNormalizado: ${estadoNormalizado}`);
    console.log(`[COMPRA CREATE]   - Cantidad de detalles: ${(data.detalles || []).length}`);
    console.log(`[COMPRA CREATE]   - Usuario ID responsable: ${data.usuarioId || 'No especificado'}`);
    console.log(`==========================================================================`);

    const idProv = data.idProveedor ? parseInt(data.idProveedor) : null;
    if (!idProv) {
      const error = new Error('El proveedor es obligatorio para registrar la compra');
      error.statusCode = 400;
      throw error;
    }

    const numFactura = data.numeroFactura ? String(data.numeroFactura).trim() : '';
    if (!numFactura) {
      const error = new Error('El número de factura es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    // Ítem #75: Validar que el número de factura no esté duplicado para el mismo proveedor
    const facturaExistente = await Compra.findOne({
      where: {
        idProveedor: idProv,
        numeroFactura: numFactura
      }
    });
    if (facturaExistente) {
      const error = new Error(`El número de factura "${numFactura}" ya se encuentra registrado para este proveedor.`);
      error.statusCode = 400;
      throw error;
    }

    // Ítem #76: Fecha de factura obligatoria
    if (!data.fechaFactura) {
      const error = new Error('La fecha de la factura es obligatoria');
      error.statusCode = 400;
      throw error;
    }
    const fechaFacturaValida = new Date(data.fechaFactura);
    if (isNaN(fechaFacturaValida.getTime())) {
      const error = new Error('La fecha de la factura no es válida');
      error.statusCode = 400;
      throw error;
    }

    // Validar detalles mínimos
    if (!data.detalles || !Array.isArray(data.detalles) || data.detalles.length === 0) {
      const error = new Error('La compra debe incluir al menos un insumo');
      error.statusCode = 400;
      throw error;
    }

    const compra = await Compra.create({
      idProveedor: idProv,
      numeroFactura: numFactura,
      fechaFactura: data.fechaFactura,
      fechaCompra: data.fechaCompra || new Date(),
      subtotal: parseFloat(data.subtotal) || parseFloat(data.total) || 0,
      iva: parseFloat(data.iva) || 0,
      total: parseFloat(data.total) || 0,
      incluyeIva: data.incluyeIva ? 1 : 0,
      estado: ESTADO_RECIBIDA
    });

    if (data.detalles && data.detalles.length > 0) {
      const detallesParaGuardar = data.detalles.map((d, index) => {
        let lotesArr = Array.isArray(d.lotes) && d.lotes.length > 0
          ? d.lotes
          : (d.numeroLote ? [{ numeroLote: d.numeroLote, fechaVencimiento: d.fechaVencimiento, cantidad: d.cantidad }] : []);

        // Ítem #79: Generar número de lote automáticamente de forma sugerida si viene vacío
        if (lotesArr.length === 0) {
          const autoLote = `LOT-${compra.idCompra}-${d.idInsumo}-${Date.now().toString().slice(-4)}`;
          lotesArr = [{
            numeroLote: autoLote,
            fechaVencimiento: d.fechaVencimiento || null,
            cantidad: d.cantidad
          }];
        }

        const primerLote = lotesArr[0];
        const numLote = (d.numeroLote && String(d.numeroLote).trim()) 
          || (primerLote && primerLote.numeroLote && String(primerLote.numeroLote).trim()) 
          || `LOT-${compra.idCompra}-${d.idInsumo}`;
        const rawVenc = (d.fechaVencimiento && String(d.fechaVencimiento).trim()) 
          || (primerLote && primerLote.fechaVencimiento && String(primerLote.fechaVencimiento).trim()) 
          || null;
        const fVenc = (rawVenc && rawVenc !== '') ? rawVenc : null;

        const cant = parseFloat(d.cantidad) || 0;
        const pUnit = parseFloat(d.precioUnitario) || 0;
        const sub = d.subtotal !== undefined ? parseFloat(d.subtotal) : (cant * pUnit);

        return {
          idCompra: compra.idCompra,
          idInsumo: parseInt(d.idInsumo),
          cantidad: cant,
          precioUnitario: pUnit,
          subtotal: sub,
          lotes: JSON.stringify(lotesArr),
          numeroLote: numLote,
          fechaVencimiento: fVenc
        };
      });

      await DetalleCompraInsumo.bulkCreate(detallesParaGuardar);

      // Crear registros en LoteInsumo
      const lotesToCreate = [];
      for (const d of data.detalles) {
        const lotesArr = Array.isArray(d.lotes) && d.lotes.length > 0
          ? d.lotes
          : (d.numeroLote ? [{ numeroLote: d.numeroLote, fechaVencimiento: d.fechaVencimiento, cantidad: d.cantidad }] : []);

        for (const l of lotesArr) {
          if (l && l.numeroLote && String(l.numeroLote).trim()) {
            const cantLot = parseFloat(l.cantidad || d.cantidad) || 0;
            const lVenc = (l.fechaVencimiento && String(l.fechaVencimiento).trim()) || null;
            lotesToCreate.push({
              idInsumo: parseInt(d.idInsumo),
              idCompra: compra.idCompra,
              numeroLote: String(l.numeroLote).trim(),
              cantidad: cantLot,
              cantidadDisponible: cantLot,
              fechaVencimiento: (lVenc && lVenc !== '') ? lVenc : null,
              estado: 'ACTIVO'
            });
          }
        }
      }

      if (lotesToCreate.length > 0) {
        try {
          await LoteInsumo.bulkCreate(lotesToCreate);
          console.log(`[COMPRA CREATE] #${compra.idCompra}: ${lotesToCreate.length} registro(s) de lote guardados.`);
        } catch (loteErr) {
          console.warn('[COMPRA CREATE] Advertencia al guardar lotes:', loteErr.message);
        }
      }
    }

    // Reabastecimiento de stock si la compra está confirmada como RECIBIDA
    if (esEstadoRecibida(estadoNormalizado)) {
      console.log(`[COMPRA CREATE] #${compra.idCompra}: Reabasteciendo stock inmediatamente en módulo de insumos.`);
      await this._ajustarStockPorCompra(compra, +1, { usuarioId: data.usuarioId });
    }

    return this.getById(compra.idCompra);
  }

  /**
   * Ajusta el stock de los insumos asociados a una compra.
   * signo = +1 para sumar (compra recibida), -1 para restar (reversa/anulación).
   *
   * CORRECCIÓN: Lee el stock actual desde la BD y calcula el nuevo valor antes de guardarlo.
   * Esto evita el bug de duplicación que ocurría con sequelize.literal(CAST...) cuando
   * el valor era NULL o cuando había problemas de tipo en la BD.
   */
  static async _ajustarStockPorCompra(compra, signo, opts = {}) {
    if (!compra || !compra.idCompra) return;

    const estadoNormalizado = normalizarEstado(compra.estado);
    if (signo > 0 && !esEstadoRecibida(estadoNormalizado)) {
      console.warn(`[COMPRA STOCK] BLOQUEADO ajuste +(sumar) para compra #${compra.idCompra}: estado=${estadoNormalizado} se requiere RECIBIDA.`);
      return;
    }

    const idCompra = Number(compra.idCompra);
    const compraCompleta = await Compra.findByPk(idCompra, {
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre'] },
        { model: DetalleCompraInsumo, as: 'detalles' }
      ]
    });
    if (!compraCompleta) return;

    const detalles = compraCompleta.detalles || [];
    if (!detalles.length) return;

    const proveedor = compraCompleta.proveedor;
    const proveedorNombre = proveedor ? proveedor.nombre : (compraCompleta.idProveedor ? `Proveedor #${compraCompleta.idProveedor}` : 'Sin proveedor');
    const numeroFactura = `COMP-${String(idCompra).padStart(4, '0')}`;

    // Agrupar cantidades por insumo para manejar correctamente detalles duplicados
    const mapaAgrupado = new Map();
    for (const d of detalles) {
      const idIns = Number(d.idInsumo);
      if (!mapaAgrupado.has(idIns)) {
        mapaAgrupado.set(idIns, {
          idInsumo: idIns,
          cantidadTotal: 0,
          precioUnitario: parseFloat(d.precioUnitario) || 0,
          subtotalTotal: 0
        });
      }
      const e = mapaAgrupado.get(idIns);
      const cantNum = parseFloat(d.cantidad) || 0;
      e.cantidadTotal += cantNum;
      e.precioUnitario = parseFloat(d.precioUnitario) || e.precioUnitario;
      e.subtotalTotal += parseFloat(d.subtotal || (cantNum * e.precioUnitario)) || 0;
    }

    const operacion = signo > 0 ? "SUMAR" : "RESTAR";
    const tipoMovimiento = signo > 0 ? 'Entrada' : 'Salida';
    const motivoAjuste = opts.motivo || (signo > 0
      ? `Compra ${numeroFactura} marcada como Recibida — Proveedor: ${proveedorNombre}`
      : `Reversa por anulación/cambio de estado de compra ${numeroFactura} — Proveedor: ${proveedorNombre}`);

    for (const [idIns, entry] of mapaAgrupado.entries()) {
      try {
        const cantidadAjuste = entry.cantidadTotal; // siempre positivo

        const insumo = await Insumo.findByPk(idIns);
        if (!insumo) {
          console.warn(`[COMPRA STOCK] Insumo #${idIns} no encontrado, saltando...`);
          continue;
        }

        const stockActual = parseFloat(insumo.stock) || 0;
        const nuevoStock = signo > 0
          ? stockActual + cantidadAjuste
          : Math.max(0, stockActual - cantidadAjuste);

        console.log(`[COMPRA STOCK] ${operacion} insumo #${idIns} compra #${idCompra}: stock=${stockActual} ${signo > 0 ? "+" : "-"}${cantidadAjuste} = ${nuevoStock}`);

        await Insumo.update(
          { stock: nuevoStock },
          { where: { idInsumo: idIns } }
        );

        try {
          await TrazabilidadService.create({
            tipo: signo > 0 ? 'compra' : 'Cancelación de Compra',
            entidadNombre: insumo.nombre,
            detalle: `${signo > 0 ? "Reabastecimiento" : "Reversa"} por compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Precio unitario: $${parseFloat(entry.precioUnitario).toLocaleString('es-CO')} | Subtotal: $${parseFloat(entry.subtotalTotal).toLocaleString('es-CO')} | Estado: ${estadoNormalizado}${opts.motivo ? ` | Motivo: ${opts.motivo}` : ''}`,
            idInsumo: idIns,
            tipoMovimiento: tipoMovimiento,
            cantidad: cantidadAjuste,
            motivo: motivoAjuste,
            usuarioId: opts.usuarioId || null,
            skipStockUpdate: true
          });
        } catch (tzErr) {
          console.warn(`[COMPRA STOCK] Error registrando trazabilidad para insumo #${idIns}:`, tzErr.message);
        }
      } catch (err) {
        console.warn(`Advertencia al ajustar stock insumo #${idIns}:`, err.message);
      }
    }
  }

  static async updateEstado(id, estado, opts = {}) {
    const t = await sequelize.transaction();
    let estadoAnterior;
    let estadoNuevo;
    try {
      const c = await Compra.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!c) {
        await t.rollback();
        const error = new Error('Compra no encontrada');
        error.statusCode = 404;
        throw error;
      }

      estadoAnterior = normalizarEstado(c.estado);
      estadoNuevo = normalizarEstado(estado);
      console.log(`[COMPRA UPDATE_ESTADO] #${id}: ${estadoAnterior} → ${estadoNuevo}`);

      if (estadoAnterior === estadoNuevo) {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: estado no cambió (${estadoNuevo}) - sin acción`);
        await t.commit();
        return this.getById(id);
      }

      c.estado = estadoNuevo;
      await c.save({ transaction: t });
      await t.commit();
    } catch (err) {
      try { if (!t.finished) await t.rollback(); } catch (_) {}
      console.error(`[COMPRA UPDATE_ESTADO] #${id}: ERROR en transacción:`, err.message);
      throw err;
    }

    // Ajustar stock FUERA de la transacción (ya cerrada con commit)
    try {
      if (esEstadoRecibida(estadoAnterior) && esEstadoCancelada(estadoNuevo)) {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: transición RECIBIDA→CANCELADA (resta stock)`);
        await this._ajustarStockPorCompra({ idCompra: id, estado: estadoAnterior }, -1, opts);
      } else if (esEstadoPendiente(estadoAnterior) && esEstadoRecibida(estadoNuevo)) {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: transición PENDIENTE→RECIBIDA (suma stock)`);
        await this._ajustarStockPorCompra({ idCompra: id, estado: estadoNuevo }, +1, opts);
      } else if (esEstadoCancelada(estadoAnterior) && esEstadoRecibida(estadoNuevo)) {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: transición CANCELADA→RECIBIDA (suma stock)`);
        await this._ajustarStockPorCompra({ idCompra: id, estado: estadoNuevo }, +1, opts);
      } else if (esEstadoRecibida(estadoAnterior) && esEstadoPendiente(estadoNuevo)) {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: transición RECIBIDA→PENDIENTE (resta stock)`);
        await this._ajustarStockPorCompra({ idCompra: id, estado: estadoAnterior }, -1, opts);
      } else {
        console.log(`[COMPRA UPDATE_ESTADO] #${id}: transición ${estadoAnterior}→${estadoNuevo} sin impacto en stock`);
      }
    } catch (stockErr) {
      console.error(`[COMPRA UPDATE_ESTADO] #${id}: ERROR al ajustar stock (estado ya guardado):`, stockErr.message);
    }

    return this.getById(id);
  }

  static async cancelar(id, opts = {}) {
    const { motivo, detallesCancelacion, cantidadesAjuste, usuarioId, fechaCancelacion, tipoCompensacion } = opts;
    const c = await Compra.findByPk(id, {
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre'] },
        { model: DetalleCompraInsumo, as: 'detalles', include: [{ model: Insumo, as: 'insumo' }] },
        { model: LoteInsumo, as: 'lotes' }
      ]
    });
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let parsedDetalles = [];
    if (detallesCancelacion) {
      try {
        parsedDetalles = typeof detallesCancelacion === 'string'
          ? JSON.parse(detallesCancelacion)
          : detallesCancelacion;
      } catch (_) {
        parsedDetalles = [];
      }
    } else if (Array.isArray(cantidadesAjuste) && cantidadesAjuste.length > 0) {
      parsedDetalles = cantidadesAjuste;
    } else {
      parsedDetalles = (c.detalles || []).map(d => ({
        idInsumo: d.idInsumo,
        nombre: d.insumo ? d.insumo.nombre : `Insumo #${d.idInsumo}`,
        unidadMedida: d.insumo ? d.insumo.unidadMedida : '',
        cantidadCancelada: parseFloat(d.cantidad) || 0,
        subtotal: parseFloat(d.subtotal) || 0,
        motivo: motivo || 'Devolución completa de compra',
        tipoCompensacion: tipoCompensacion || 'DEVOLUCION_DINERO'
      }));
    }

    // Validar motivo individual en cada insumo devuelto (Ítem #89)
    parsedDetalles = (parsedDetalles || []).map(item => {
      const itemMotivo = String(item.motivo || motivo || 'Devolución de insumo').trim();
      return {
        ...item,
        motivo: itemMotivo,
        tipoCompensacion: item.tipoCompensacion || tipoCompensacion || 'DEVOLUCION_DINERO'
      };
    });

    const idCompra = Number(id);
    const proveedorNombre = c.proveedor ? c.proveedor.nombre : 'Proveedor Genérico';
    const numeroFactura = c.numeroFactura || `COMP-${String(idCompra).padStart(4, '0')}`;

    // Determinar si es devolución total o parcial (Ítem #91)
    let esTotal = true;
    for (const d of (c.detalles || [])) {
      const cantOriginal = parseFloat(d.cantidad) || 0;
      const cantDevuelta = parsedDetalles
        .filter(p => Number(p.idInsumo) === Number(d.idInsumo))
        .reduce((sum, p) => sum + (parseFloat(p.cantidadCancelada || p.cantidad || 0)), 0);
      if (cantDevuelta < cantOriginal - 0.001) {
        esTotal = false;
        break;
      }
    }

    const nuevoEstado = esTotal ? ESTADO_CANCELADA : ESTADO_DEVUELTA_PARCIAL;

    // Procesar cada insumo devuelto (reducir stock y LoteInsumo, registrar trazabilidad)
    for (const item of parsedDetalles) {
      const idInsumo = Number(item.idInsumo);
      const cantDev = parseFloat(item.cantidadCancelada || item.cantidad || 0);
      if (!idInsumo || cantDev <= 0) continue;

      try {
        const insumo = await Insumo.findByPk(idInsumo);
        if (insumo) {
          const stockActual = parseFloat(insumo.stock) || 0;
          const nuevoStock = Math.max(0, stockActual - cantDev);
          await Insumo.update({ stock: nuevoStock }, { where: { idInsumo } });

          // Descontar del LoteInsumo correspondiente (Ítem #81, #91)
          const lotesInsumo = await LoteInsumo.findAll({
            where: { idCompra, idInsumo }
          });
          let restantePorDescontar = cantDev;
          for (const lote of lotesInsumo) {
            if (restantePorDescontar <= 0) break;
            const disp = parseFloat(lote.cantidadDisponible) || 0;
            const aDescontar = Math.min(disp, restantePorDescontar);
            const nuevoDisp = Math.max(0, disp - aDescontar);
            await LoteInsumo.update(
              { cantidadDisponible: nuevoDisp, estado: nuevoDisp === 0 ? 'AGOTADO' : lote.estado },
              { where: { idLote: lote.idLote } }
            );
            restantePorDescontar -= aDescontar;
          }

          // Registrar trazabilidad de salida por devolución
          await TrazabilidadService.create({
            tipo: 'Devolución de Compra',
            entidadNombre: insumo.nombre,
            detalle: `Devolución de insumo en compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Cantidad devuelta: ${cantDev} ${insumo.unidadMedida || ''} | Motivo: ${item.motivo} | Compensación: ${item.tipoCompensacion}`,
            idInsumo,
            tipoMovimiento: 'Salida',
            cantidad: cantDev,
            motivo: `Devolución compra ${numeroFactura}: ${item.motivo}`,
            usuarioId: usuarioId || null,
            skipStockUpdate: true
          }).catch(e => console.warn('[COMPRA CANCELAR] Trazabilidad error:', e.message));
        }

        // Si tipoCompensacion es CAMBIO_PRODUCTO (Ítem #90)
        if (item.tipoCompensacion === 'CAMBIO_PRODUCTO' && (item.idInsumoReemplazo || item.insumoReemplazo)) {
          const idReemplazo = Number(item.idInsumoReemplazo || item.insumoReemplazo?.idInsumo || idInsumo);
          const cantReemplazo = parseFloat(item.cantidadReemplazo || item.insumoReemplazo?.cantidad || cantDev);
          const numLoteReemplazo = item.numeroLoteReemplazo || item.insumoReemplazo?.numeroLote || `LOT-REP-${idCompra}-${Date.now().toString().slice(-4)}`;
          const fVencReemplazo = item.fechaVencimientoReemplazo || item.insumoReemplazo?.fechaVencimiento || null;

          const insReemplazo = await Insumo.findByPk(idReemplazo);
          if (insReemplazo && cantReemplazo > 0) {
            const stockActualReemp = parseFloat(insReemplazo.stock) || 0;
            await Insumo.update({ stock: stockActualReemp + cantReemplazo }, { where: { idInsumo: idReemplazo } });

            await LoteInsumo.create({
              idInsumo: idReemplazo,
              idCompra,
              numeroLote: numLoteReemplazo,
              cantidad: cantReemplazo,
              cantidadDisponible: cantReemplazo,
              fechaVencimiento: fVencReemplazo,
              estado: 'ACTIVO'
            }).catch(e => console.warn('[COMPRA CANCELAR] Error creando lote reemplazo:', e.message));

            await TrazabilidadService.create({
              tipo: 'Reemplazo por Devolución',
              entidadNombre: insReemplazo.nombre,
              detalle: `Entrada por cambio de producto en compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Cantidad: ${cantReemplazo} ${insReemplazo.unidadMedida || ''} | Lote: ${numLoteReemplazo}`,
              idInsumo: idReemplazo,
              tipoMovimiento: 'Entrada',
              cantidad: cantReemplazo,
              motivo: `Reposición por devolución en compra ${numeroFactura}`,
              usuarioId: usuarioId || null,
              skipStockUpdate: true
            }).catch(e => console.warn('[COMPRA CANCELAR] Trazabilidad reemplazo error:', e.message));
          }
        }
      } catch (err) {
        console.warn(`[COMPRA CANCELAR] Error procesando insumo #${idInsumo}:`, err.message);
      }
    }

    c.motivoCancelacion = motivo || 'Devolución de insumos';
    c.detallesCancelacion = JSON.stringify(parsedDetalles);
    if (usuarioId) c.usuarioCancelacionId = usuarioId;
    c.fechaCancelacion = fechaCancelacion ? new Date(fechaCancelacion) : new Date();
    c.estado = nuevoEstado;
    await c.save();

    return this.getById(id);
  }

  static async _agruparCantidadesPorInsumo(detalles) {
    const mapa = new Map();
    for (const d of (detalles || [])) {
      const idIns = Number(d.idInsumo);
      if (!mapa.has(idIns)) {
        mapa.set(idIns, 0);
      }
      mapa.set(idIns, mapa.get(idIns) + (parseFloat(d.cantidad) || 0));
    }
    return mapa;
  }

  static async _aplicarDiferenciaStock(idCompra, mapaViejo, mapaNuevo, opts = {}) {
    const { estadoFinalCompraNormalizado, estadoInicialCompraNormalizado } = opts;
    const idsInsumos = new Set([...mapaViejo.keys(), ...mapaNuevo.keys()]);
    for (const idIns of idsInsumos) {
      const viejo = mapaViejo.get(idIns) || 0;
      const nuevo = mapaNuevo.get(idIns) || 0;
      const diff = nuevo - viejo;
      if (Math.abs(diff) < 0.0001) continue;

      const finalEsRecibida = estadoFinalCompraNormalizado !== undefined ? esEstadoRecibida(estadoFinalCompraNormalizado) : undefined;
      const inicialEsRecibida = estadoInicialCompraNormalizado !== undefined ? esEstadoRecibida(estadoInicialCompraNormalizado) : undefined;

      if (diff > 0 && finalEsRecibida === false) {
        console.warn(`[COMPRA STOCK] BLOQUEADO diff +(sumar) insumo #${idIns} compra #${idCompra}: diff=${diff} estadoFinal=${estadoFinalCompraNormalizado} necesita RECIBIDA.`);
        continue;
      }
      if (diff < 0 && inicialEsRecibida === false) {
        console.warn(`[COMPRA STOCK] BLOQUEADO diff -(restar) insumo #${idIns} compra #${idCompra}: diff=${diff} estadoInicial=${estadoInicialCompraNormalizado} debe haber sido RECIBIDA para permitir reversa.`);
        continue;
      }

      try {
        const operacion = diff > 0 ? "SUMAR" : "RESTAR";
        // CORRECCIÓN: Leer stock actual y calcular nuevo valor de forma segura
        const insumo = await Insumo.findByPk(idIns);
        if (!insumo) {
          console.warn(`[COMPRA STOCK] Insumo #${idIns} no encontrado en _aplicarDiferenciaStock`);
          continue;
        }
        const stockActual = parseFloat(insumo.stock) || 0;
        const nuevoStock = diff > 0
          ? stockActual + diff
          : Math.max(0, stockActual + diff); // diff ya es negativo

        console.log(`[COMPRA STOCK] DIF ${operacion} insumo #${idIns} compra #${idCompra}: stock=${stockActual} + diff=${diff} = ${nuevoStock}`);
        await Insumo.update(
          { stock: nuevoStock },
          { where: { idInsumo: idIns } }
        );
      } catch (err) {
        console.warn(`Advertencia al ajustar diferencia stock insumo #${idIns} diff=${diff}:`, err.message);
      }
    }
  }

  static async update(id, data) {
    const error = new Error('Las compras no se pueden editar una vez registradas. Si requieres corregir una compra, debes anularla.');
    error.statusCode = 400;
    throw error;
  }
}

module.exports = CompraService;
