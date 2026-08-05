const { Compra, DetalleCompraInsumo, Proveedor, Insumo, sequelize } = require('../../persistence/models');
const TrazabilidadService = require('./trazabilidadService');

class CompraService {
  static async getAll() {
    const compras = await Compra.findAll({
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre'] },
        {
          model: DetalleCompraInsumo, as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        }
      ],
      order: [['idCompra', 'DESC']]
    });
    return compras.map(c => ({
      id: c.idCompra,
      idCompra: c.idCompra,
      idProveedor: c.idProveedor,
      numeroFactura: `COMP-${String(c.idCompra).padStart(4, '0')}`,
      proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Sin proveedor',
      fechaCompra: c.fechaCompra,
      total: c.total,
      estado: c.estado,
      proveedor: c.proveedor || null,
      detalles: (c.detalles || []).map(d => ({
        idDetalleCompra: d.idDetalleCompra,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
        insumo: d.insumo || null
      }))
    }));
  }

  static async getById(id) {
    const c = await Compra.findByPk(id, {
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['idProveedor', 'nombre'] },
        {
          model: DetalleCompraInsumo, as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        }
      ]
    });
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: c.idCompra,
      idCompra: c.idCompra,
      idProveedor: c.idProveedor,
      numeroFactura: `COMP-${String(c.idCompra).padStart(4, '0')}`,
      proveedorNombre: c.proveedor ? c.proveedor.nombre : 'Sin proveedor',
      fechaCompra: c.fechaCompra,
      total: c.total,
      estado: c.estado,
      proveedor: c.proveedor || null,
      detalles: (c.detalles || []).map(d => ({
        idDetalleCompra: d.idDetalleCompra,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
        insumo: d.insumo || null
      }))
    };
  }

  static async create(data) {
    const compra = await Compra.create({
      idProveedor: data.idProveedor,
      fechaCompra: data.fechaCompra || new Date(),
      total: data.total,
      estado: data.estado || 'RECIBIDA'
    });

    if (data.detalles && data.detalles.length > 0) {
      const detalles = data.detalles.map(d => ({
        idCompra: compra.idCompra,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal || (d.cantidad * d.precioUnitario)
      }));
      await DetalleCompraInsumo.bulkCreate(detalles);

      const esRecibida = (data.estado || 'RECIBIDA') === 'RECIBIDA';

      if (esRecibida) {
        const mapaAgrupado = new Map();
        for (const d of data.detalles) {
          const idIns = Number(d.idInsumo);
          if (!mapaAgrupado.has(idIns)) {
            mapaAgrupado.set(idIns, {
              idInsumo: idIns,
              cantidadTotal: 0,
              precioUnitario: d.precioUnitario,
              subtotalTotal: 0
            });
          }
          const entry = mapaAgrupado.get(idIns);
          const cantNum = parseFloat(d.cantidad) || 0;
          const precNum = parseFloat(d.precioUnitario) || 0;
          entry.cantidadTotal += cantNum;
          entry.precioUnitario = precNum;
          entry.subtotalTotal += parseFloat(d.subtotal || (cantNum * precNum)) || 0;
        }

        const proveedor = await Proveedor.findByPk(data.idProveedor, { attributes: ['nombre'] });
        const proveedorNombre = proveedor ? proveedor.nombre : `Proveedor #${data.idProveedor}`;
        const numeroFactura = `COMP-${String(compra.idCompra).padStart(4, '0')}`;

        for (const [idIns, entry] of mapaAgrupado.entries()) {
          try {
            const t = await sequelize.transaction();
            try {
              await Insumo.update(
                { stock: sequelize.literal(`CAST(stock AS DECIMAL(10,2)) + ${entry.cantidadTotal}`) },
                { where: { idInsumo: idIns }, transaction: t }
              );
              const insumo = await Insumo.findByPk(idIns, { transaction: t });
              await t.commit();

              if (insumo) {
                await TrazabilidadService.create({
                  tipo: 'compra',
                  entidadNombre: insumo.nombre,
                  detalle: `Reabastecimiento por compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Precio unitario: $${parseFloat(entry.precioUnitario).toLocaleString('es-CO')} | Subtotal: $${parseFloat(entry.subtotalTotal).toLocaleString('es-CO')}`,
                  idInsumo: idIns,
                  tipoMovimiento: 'Entrada',
                  cantidad: entry.cantidadTotal,
                  motivo: `Compra ${numeroFactura} registrada — Proveedor: ${proveedorNombre}`
                });
              }
            } catch (txErr) {
              try { await t.rollback(); } catch (_) {}
              throw txErr;
            }
          } catch (err) {
            console.warn(`Advertencia al reabastecer insumo #${idIns}:`, err.message);
          }
        }
      }
    }

    return this.getById(compra.idCompra);
  }

  static async _ajustarStockPorCompra(compra, signo) {
    if (!compra || !compra.idCompra) return;

    const detalles = await DetalleCompraInsumo.findAll({
      where: { idCompra: compra.idCompra }
    });
    if (!detalles || detalles.length === 0) return;

    const mapaAgrupado = new Map();
    for (const d of detalles) {
      const idIns = Number(d.idInsumo);
      if (!mapaAgrupado.has(idIns)) {
        mapaAgrupado.set(idIns, { idInsumo: idIns, cantidadTotal: 0 });
      }
      mapaAgrupado.get(idIns).cantidadTotal += parseFloat(d.cantidad) || 0;
    }

    for (const [idIns, entry] of mapaAgrupado.entries()) {
      try {
        const cantidadAjuste = signo * entry.cantidadTotal;
        await Insumo.update(
          { stock: sequelize.literal(`CAST(stock AS DECIMAL(10,2)) + ${cantidadAjuste}`) },
          { where: { idInsumo: idIns } }
        );
      } catch (err) {
        console.warn(`Advertencia al ajustar stock insumo #${idIns}:`, err.message);
      }
    }
  }

  static async updateEstado(id, estado) {
    const c = await Compra.findByPk(id);
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const estadoAnterior = c.estado;
    const estadoNuevo = estado;

    if (estadoAnterior !== estadoNuevo) {
      if (estadoAnterior === 'RECIBIDA' && estadoNuevo === 'CANCELADA') {
        await this._ajustarStockPorCompra(c, -1);
      } else if (estadoAnterior === 'PENDIENTE' && estadoNuevo === 'RECIBIDA') {
        await this._ajustarStockPorCompra(c, +1);
      } else if (estadoAnterior === 'CANCELADA' && estadoNuevo === 'RECIBIDA') {
        await this._ajustarStockPorCompra(c, +1);
      }
    }

    c.estado = estadoNuevo;
    await c.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADA');
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

  static async _aplicarDiferenciaStock(idCompra, mapaViejo, mapaNuevo) {
    const idsInsumos = new Set([...mapaViejo.keys(), ...mapaNuevo.keys()]);
    for (const idIns of idsInsumos) {
      const viejo = mapaViejo.get(idIns) || 0;
      const nuevo = mapaNuevo.get(idIns) || 0;
      const diff = nuevo - viejo;
      if (Math.abs(diff) < 0.0001) continue;
      try {
        await Insumo.update(
          { stock: sequelize.literal(`CAST(stock AS DECIMAL(10,2)) + ${diff}`) },
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

      const estadoAnterior = compra.estado;
      const estadoNuevo = (data.estado !== undefined && data.estado !== null) ? data.estado : estadoAnterior;

      const detallesViejos = (compra.detalles || []).map(d => d.toJSON());
      const mapaViejo = await this._agruparCantidadesPorInsumo(detallesViejos);

      compra.idProveedor = data.idProveedor !== undefined ? data.idProveedor : compra.idProveedor;
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

      const detallesFinales = await DetalleCompraInsumo.findAll({ where: { idCompra: id }, transaction: t });
      const mapaNuevo = await this._agruparCantidadesPorInsumo(detallesFinales);

      const anteriorRecibida = estadoAnterior === 'RECIBIDA';
      const nuevaRecibida = estadoNuevo === 'RECIBIDA';

      if (anteriorRecibida && nuevaRecibida) {
        await this._aplicarDiferenciaStock(id, mapaViejo, mapaNuevo);
      } else if (!anteriorRecibida && nuevaRecibida) {
        await this._aplicarDiferenciaStock(id, new Map(), mapaNuevo);
      } else if (anteriorRecibida && !nuevaRecibida) {
        await this._aplicarDiferenciaStock(id, mapaViejo, new Map());
      }

      await t.commit();
      return this.getById(id);
    } catch (err) {
      try { await t.rollback(); } catch (_) {}
      throw err;
    }
  }
}

module.exports = CompraService;
