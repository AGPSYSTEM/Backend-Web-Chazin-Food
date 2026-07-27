const { Compra, DetalleCompraInsumo, Proveedor, Insumo } = require('../../persistence/models');

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
