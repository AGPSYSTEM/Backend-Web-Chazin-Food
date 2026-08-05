const { Compra, DetalleCompraInsumo, Proveedor, Insumo } = require('../../persistence/models');
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

      // Reabastecer stock de cada insumo y registrar trazabilidad
      for (const d of data.detalles) {
        try {
          const insumo = await Insumo.findByPk(d.idInsumo);
          if (insumo) {
            const cantNum = parseFloat(d.cantidad);
            insumo.stock = parseFloat(insumo.stock || 0) + cantNum;
            await insumo.save();

            // Obtener nombre del proveedor para el detalle
            const proveedor = await Proveedor.findByPk(data.idProveedor, { attributes: ['nombre'] });
            const proveedorNombre = proveedor ? proveedor.nombre : `Proveedor #${data.idProveedor}`;
            const numeroFactura = `COMP-${String(compra.idCompra).padStart(4, '0')}`;

            await TrazabilidadService.create({
              tipo: 'compra',
              entidadNombre: insumo.nombre,
              detalle: `Reabastecimiento por compra ${numeroFactura} — Proveedor: ${proveedorNombre} | Precio unitario: $${parseFloat(d.precioUnitario).toLocaleString('es-CO')} | Subtotal: $${parseFloat(d.subtotal || d.cantidad * d.precioUnitario).toLocaleString('es-CO')}`,
              idInsumo: d.idInsumo,
              tipoMovimiento: 'Entrada',
              cantidad: cantNum,
              motivo: `Compra ${numeroFactura} registrada — Proveedor: ${proveedorNombre}`
            });
          }
        } catch (err) {
          console.warn(`Advertencia al reabastecer insumo #${d.idInsumo}:`, err.message);
        }
      }
    }

    return this.getById(compra.idCompra);
  }

  static async updateEstado(id, estado) {
    const c = await Compra.findByPk(id);
    if (!c) {
      const error = new Error('Compra no encontrada');
      error.statusCode = 404;
      throw error;
    }
    c.estado = estado;
    await c.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADA');
  }
}

module.exports = CompraService;
