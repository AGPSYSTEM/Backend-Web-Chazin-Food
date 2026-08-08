const VentaService = require('./ventaService');

class OrderService {
  static async createOrder(data) {
    return VentaService.create(data);
  }

  static async getOrders() {
    return VentaService.getAll();
  }

  static async getOrderById(id) {
    return VentaService.getById(id);
  }

  static async updateOrderStatus(id, estado) {
    return VentaService.updateEstado(id, estado);
  }
}

module.exports = OrderService;
