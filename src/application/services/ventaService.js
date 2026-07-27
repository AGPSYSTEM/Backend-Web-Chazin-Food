const { Venta, DetalleVentaProducto, Cliente, User } = require('../../persistence/models');

class VentaService {
  static async getAll() {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
        { model: DetalleVentaProducto, as: 'detalles' }
      ],
      order: [['idVenta', 'DESC']]
    });
    return ventas.map(v => ({
      id: v.idVenta,
      idVenta: v.idVenta,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      fechaVenta: v.fechaVenta,
      subtotal: v.subtotal,
      descuentoAplicado: v.descuentoAplicado,
      total: v.total,
      estadoEntrega: v.estadoEntrega,
      observaciones: v.observaciones,
      cliente: v.cliente || null,
      usuario: v.usuario || null,
      detalles: v.detalles || []
    }));
  }

  static async getById(id) {
    const v = await Venta.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
        { model: DetalleVentaProducto, as: 'detalles' }
      ]
    });
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      fechaVenta: v.fechaVenta,
      subtotal: v.subtotal,
      descuentoAplicado: v.descuentoAplicado,
      total: v.total,
      estadoEntrega: v.estadoEntrega,
      observaciones: v.observaciones,
      cliente: v.cliente || null,
      usuario: v.usuario || null,
      detalles: v.detalles || []
    };
  }

  static async create(data) {
    const venta = await Venta.create({
      idCliente: data.idCliente,
      idUsuario: data.idUsuario,
      idDescuento: data.idDescuento || null,
      subtotal: data.subtotal,
      descuentoAplicado: data.descuentoAplicado || 0,
      total: data.total,
      estadoEntrega: data.estadoEntrega || 'PENDIENTE',
      observaciones: data.observaciones || null
    });

    if (data.detalles && data.detalles.length > 0) {
      const detalles = data.detalles.map(d => ({
        idVenta: venta.idVenta,
        idVariante: d.idVariante,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
        observaciones: d.observaciones || null
      }));
      await DetalleVentaProducto.bulkCreate(detalles);
    }

    return this.getById(venta.idVenta);
  }

  static async updateEstado(id, estado) {
    const v = await Venta.findByPk(id);
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    v.estadoEntrega = estado;
    await v.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }
}

module.exports = VentaService;
