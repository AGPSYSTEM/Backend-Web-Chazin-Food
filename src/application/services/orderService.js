const { Order, User } = require('../../persistence/models');

class OrderService {
  static async createOrder(data) {
    const { items, total, metodoPago, clienteId } = data;
    if (!items || items.length === 0) {
      const error = new Error('No hay ítems en la orden');
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.create({
      clienteId: clienteId || null,
      items: JSON.stringify(items),
      total: total || 0,
      metodoPago: metodoPago || 'efectivo',
      estado: 'pendiente',
      fechaCreacion: new Date()
    });

    return this.getOrderById(order.id);
  }

  static async getOrders() {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'cliente' }],
      order: [['fechaCreacion', 'DESC']]
    });

    return orders.map(o => {
      let items = [];
      try {
        items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
      } catch (e) {
        items = [];
      }

      return {
        _id: o.id,
        id: o.id,
        cliente: o.cliente ? { _id: o.cliente.idUsuario, nombre: o.cliente.nombre, correo: o.cliente.email } : null,
        items,
        total: parseFloat(o.total),
        estado: o.estado,
        metodoPago: o.metodoPago,
        createdAt: o.fechaCreacion
      };
    });
  }

  static async getOrderById(id) {
    const o = await Order.findByPk(id, {
      include: [{ model: User, as: 'cliente' }]
    });

    if (!o) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let items = [];
    try {
      items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
    } catch (e) {
      items = [];
    }

    return {
      _id: o.id,
      id: o.id,
      cliente: o.cliente ? { _id: o.cliente.idUsuario, nombre: o.cliente.nombre, correo: o.cliente.email } : null,
      items,
      total: parseFloat(o.total),
      estado: o.estado,
      metodoPago: o.metodoPago,
      createdAt: o.fechaCreacion
    };
  }

  static async updateOrderStatus(id, estado) {
    const o = await Order.findByPk(id);
    if (!o) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (estado) {
      o.estado = estado;
      await o.save();
    }

    return this.getOrderById(id);
  }
}

module.exports = OrderService;
