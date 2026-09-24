const { Compra, DetalleCompraInsumo, Proveedor, Insumo, LoteInsumo, User, sequelize } = require('../../persistence/models');
const TrazabilidadService = require('./trazabilidadService');

const ESTADO_RECIBIDA = 'RECIBIDA';
const ESTADO_PENDIENTE = 'PENDIENTE';
const ESTADO_CANCELADA = 'CANCELADA';

function normalizarEstado(estado) {
  const e = String(estado || '').trim().toUpperCase();
  if (e === ESTADO_RECIBIDA) return ESTADO_RECIBIDA;
  if (e === ESTADO_PENDIENTE) return ESTADO_PENDIENTE;
  if (e === ESTADO_CANCELADA) return ESTADO_CANCELADA;
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
        numeroFactura: `COMP-${String(c.idCompra).padStart(4, '0')}`,
        proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Proveedor Genérico',
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
      numeroFactura: `COMP-${String(c.idCompra).padStart(4, '0')}`,
      proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Proveedor Genérico',
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

    const compra = await Compra.create({
      idProveedor: data.idProveedor || null,   // null = compra genérica sin proveedor
      fechaCompra: data.fechaCompra || new Date(),
      total: data.total,
      estado: estadoNormalizado
    });

    if (data.detalles && data.detalles.length > 0) {
      const detallesParaGuardar = data.detalles.map(d => {
        const lotesArr = Array.isArray(d.lotes) && d.lotes.length > 0
          ? d.lotes
          : (d.numeroLote ? [{ numeroLote: d.numeroLote, fechaVencimiento: d.fechaVencimiento, cantidad: d.cantidad }] : []);

        return {
          idCompra: compra.idCompra,
          idInsumo: d.idInsumo,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal || (d.cantidad * d.precioUnitario),
          lotes: lotesArr.length > 0 ? JSON.stringify(lotesArr) : null,
          numeroLote: d.numeroLote || (lotesArr[0] ? lotesArr[0].numeroLote : null),
          fechaVencimiento: d.fechaVencimiento || (lotesArr[0] ? lotesArr[0].fechaVencimiento : null)
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
          if (l && l.numeroLote) {
            const cantLot = parseFloat(l.cantidad || d.cantidad) || 0;
            lotesToCreate.push({
              idInsumo: d.idInsumo,
              idCompra: compra.idCompra,
              numeroLote: String(l.numeroLote).trim(),
              cantidad: cantLot,
              cantidadDisponible: cantLot,
              fechaVencimiento: l.fechaVencimiento || null,
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
    const proveedorNombre = proveedor ? proveedor.nombre : (compraCompleta.idProveedor ? `Proveedor #${compraCompleta.idProveedor}` : 'Proveedor Genérico');
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
            tipo: 'compra',
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
    const { motivo, detallesCancelacion, cantidadesAjuste, usuarioId } = opts;
    const c = await Compra.findByPk(id);
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let detCancStr = null;
    if (detallesCancelacion) {
      detCancStr = typeof detallesCancelacion === 'string'
        ? detallesCancelacion
        : JSON.stringify(detallesCancelacion);
    } else {
      const det = await DetalleCompraInsumo.findAll({
        where: { idCompra: id },
        include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
      });
      detCancStr = JSON.stringify(det.map(d => ({
        idInsumo: d.idInsumo,
        nombre: d.insumo ? d.insumo.nombre : `Insumo #${d.idInsumo}`,
        unidadMedida: d.insumo ? d.insumo.unidadMedida : '',
        cantidadCancelada: parseFloat(d.cantidad) || 0,
        subtotal: parseFloat(d.subtotal) || 0
      })));
    }

    c.motivoCancelacion = motivo || 'Cancelada por el usuario';
    c.detallesCancelacion = detCancStr;
    c.usuarioCancelacionId = usuarioId || null;
    c.fechaCancelacion = new Date();
    await c.save();

    // Si el usuario envió cantidades editadas individualmente, hacer ajuste PARCIAL de stock
    // en lugar de usar _ajustarStockPorCompra que usa las cantidades originales de la BD.
    const estadoActual = normalizarEstado(c.estado);
    if (esEstadoRecibida(estadoActual) && Array.isArray(cantidadesAjuste) && cantidadesAjuste.length > 0) {
      console.log(`[COMPRA CANCELAR] #${id}: Ajuste PARCIAL de stock con cantidades editadas por el usuario.`);
      const idCompra = Number(id);
      const compraInfo = await Compra.findByPk(idCompra, {
        include: [{ model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre'] }]
      });
      const proveedorNombre = compraInfo && compraInfo.proveedor ? compraInfo.proveedor.nombre : 'Proveedor Genérico';
      const numeroFactura = `COMP-${String(idCompra).padStart(4, '0')}`;

      for (const ajuste of cantidadesAjuste) {
        const { idInsumo, cantidadCancelada } = ajuste;
        if (!idInsumo || !(parseFloat(cantidadCancelada) > 0)) continue;
        try {
          const insumo = await Insumo.findByPk(idInsumo);
          if (!insumo) continue;
          const stockActual = parseFloat(insumo.stock) || 0;
          const nuevoStock = Math.max(0, stockActual - parseFloat(cantidadCancelada));
          console.log(`[COMPRA CANCELAR PARCIAL] Insumo #${idInsumo}: stock=${stockActual} - ${cantidadCancelada} = ${nuevoStock}`);
          await Insumo.update({ stock: nuevoStock }, { where: { idInsumo } });
          try {
            await TrazabilidadService.create({
              tipo: 'compra',
              entidadNombre: insumo.nombre,
              detalle: `Cancelación parcial de compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Cantidad cancelada: ${cantidadCancelada} ${insumo.unidadMedida || ''} | Motivo: ${motivo || 'Sin motivo'}`,
              idInsumo,
              tipoMovimiento: 'Salida',
              cantidad: parseFloat(cantidadCancelada),
              motivo: `Reversa parcial por cancelación compra ${numeroFactura}`,
              usuarioId: usuarioId || null,
              skipStockUpdate: true
            });
          } catch (tzErr) {
            console.warn(`[COMPRA CANCELAR PARCIAL] Error trazabilidad insumo #${idInsumo}:`, tzErr.message);
          }
        } catch (err) {
          console.warn(`[COMPRA CANCELAR PARCIAL] Error ajustando insumo #${idInsumo}:`, err.message);
        }
      }

      // Cambiar estado a CANCELADA sin re-ajustar stock (ya lo hicimos arriba)
      c.estado = ESTADO_CANCELADA;
      await c.save();
      return this.getById(id);
    }

    // Si no hay cantidadesAjuste explícitas, usar el flujo estándar (ajuste completo)
    return this.updateEstado(id, ESTADO_CANCELADA, { usuarioId, motivo: c.motivoCancelacion });
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
    const t = await sequelize.transaction();
    try {
      const compra = await Compra.findByPk(id, {
        include: [{ model: DetalleCompraInsumo, as: 'detalles' }],
        transaction: t
      });
      if (!compra) {
        const error = new Error('Compra no encontrada');
        error.statusCode = 404;
        throw error;
      }

      const estadoAnteriorSinNormalizar = compra.estado;
      const estadoAnterior = normalizarEstado(estadoAnteriorSinNormalizar);
      const estadoSinNormalizarEntrada = (data.estado !== undefined && data.estado !== null)
        ? `[recibido del frontend: ${data.estado}]`
        : `[omitido, default=anterior]`;
      const estadoNuevoSinNormalizar = (data.estado !== undefined && data.estado !== null) ? data.estado : estadoAnterior;
      const estadoNuevo = normalizarEstado(estadoNuevoSinNormalizar);
      const anteriorRecibida = esEstadoRecibida(estadoAnterior);
      const nuevaRecibida = esEstadoRecibida(estadoNuevo);
      const TOCARA_STOCK = anteriorRecibida || nuevaRecibida;

      console.log(`==========================================================================`);
      console.log(`[COMPRA UPDATE] #${id} - INICIO`);
      console.log(`[COMPRA UPDATE]   - estadoAnterior (BD sin normalizar): "${estadoAnteriorSinNormalizar}" → normalizado: ${estadoAnterior}`);
      console.log(`[COMPRA UPDATE]   - estadoNuevo  ${estadoSinNormalizarEntrada} → normalizado: ${estadoNuevo}`);
      console.log(`[COMPRA UPDATE]   - anteriorRecibida=${anteriorRecibida} | nuevaRecibida=${nuevaRecibida} | TOCARA_STOCK=${TOCARA_STOCK}`);
      console.log(`==========================================================================`);

      const detallesViejos = (compra.detalles || []).map(d => d.toJSON());
      const mapaViejo = await this._agruparCantidadesPorInsumo(detallesViejos);

      compra.idProveedor = data.idProveedor !== undefined ? (data.idProveedor || null) : compra.idProveedor;
      compra.fechaCompra = data.fechaCompra !== undefined ? data.fechaCompra : compra.fechaCompra;
      compra.total = data.total !== undefined ? data.total : compra.total;
      compra.estado = estadoNuevo;
      await compra.save({ transaction: t });

      if (data.detalles !== undefined && Array.isArray(data.detalles)) {
        await DetalleCompraInsumo.destroy({ where: { idCompra: id }, transaction: t });
        if (data.detalles.length > 0) {
          const nuevosDetalles = data.detalles.map(d => ({
            idCompra: id,
            idInsumo: d.idInsumo,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal !== undefined ? d.subtotal : ((parseFloat(d.cantidad) || 0) * (parseFloat(d.precioUnitario) || 0))
          }));
          await DetalleCompraInsumo.bulkCreate(nuevosDetalles, { transaction: t });
        }
      }

      let mapaNuevo = new Map();
      if (TOCARA_STOCK) {
        const detallesFinales = await DetalleCompraInsumo.findAll({ where: { idCompra: id }, transaction: t });
        mapaNuevo = await this._agruparCantidadesPorInsumo(detallesFinales);
      }

      await t.commit();

      // Ajustar stock FUERA de la transacción (ya cerrada)
      if (anteriorRecibida && nuevaRecibida) {
        console.log(`[COMPRA UPDATE] #${id}: ✅ ajustando diferencia (sigue RECIBIDA)`);
        await this._aplicarDiferenciaStock(id, mapaViejo, mapaNuevo, { estadoFinalCompraNormalizado: estadoNuevo, estadoInicialCompraNormalizado: estadoAnterior });
      } else if (!anteriorRecibida && nuevaRecibida) {
        console.log(`[COMPRA UPDATE] #${id}: ✅ sumando TODO nuevo (pasó a RECIBIDA)`);
        await this._aplicarDiferenciaStock(id, new Map(), mapaNuevo, { estadoFinalCompraNormalizado: estadoNuevo, estadoInicialCompraNormalizado: estadoAnterior });
      } else if (anteriorRecibida && !nuevaRecibida) {
        console.log(`[COMPRA UPDATE] #${id}: ✅ restando TODO viejo (salió de RECIBIDA)`);
        await this._aplicarDiferenciaStock(id, mapaViejo, new Map(), { estadoFinalCompraNormalizado: estadoNuevo, estadoInicialCompraNormalizado: estadoAnterior });
      } else {
        console.log(`[COMPRA UPDATE] #${id}: ⛔ GUARDIA TOTAL ACTIVADA - SIN CAMBIO DE STOCK (estado anterior y nuevo NO SON RECIBIDA). Se omiten cálculos.`);
      }

      console.log(`[COMPRA UPDATE] #${id}: FIN`);
      return this.getById(id);
    } catch (err) {
      try { if (!t.finished) await t.rollback(); } catch (_) {}
      console.error(`[COMPRA UPDATE] #${id}: ERROR - rollback:`, err.message);
      throw err;
    }
  }
}

module.exports = CompraService;
