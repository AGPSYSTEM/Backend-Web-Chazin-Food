const { Venta, Insumo, Cliente, Product } = require('../../persistence/models');
const { Op } = require('sequelize');

class DashboardService {
  static async getStats() {
    try {
      // Total ventas
      const ventas = await Venta.findAll();
      const ventasTotal = ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);

      // Total pedidos (ventas count)
      const pedidosTotal = ventas.length;

      // Insumos con bajo stock
      const insumosBajoStock = await Insumo.count({
        where: {
          estado: 1,
          stock: { [Op.lte]: require('sequelize').col('stockMinimo') }
        }
      }).catch(() => 0);

      // Total clientes
      const clientesTotal = await Cliente.count().catch(() => 0);

      return {
        ventasTotal,
        pedidosTotal,
        insumosBajoStock,
        clientesTotal
      };
    } catch (error) {
      // Return fallback data if queries fail
      return {
        ventasTotal: 0,
        pedidosTotal: 0,
        insumosBajoStock: 0,
        clientesTotal: 0
      };
    }
  }

  static async getVentasChart() {
    try {
      const ventas = await Venta.findAll({
        order: [['fechaVenta', 'DESC']],
        limit: 30
      });
      return ventas.map(v => ({
        fecha: v.fechaVenta,
        total: v.total
      }));
    } catch {
      return [];
    }
  }

  static async getProductosPopulares() {
    try {
      const productos = await Product.findAll({
        where: { estado: 1 },
        order: [['stock', 'DESC']],
        limit: 5
      });
      return productos.map(p => ({
        id: p.idProducto,
        nombre: p.nombre,
        precio: p.precio,
        stock: p.stock
      }));
    } catch {
      return [];
    }
  }
}

module.exports = DashboardService;
