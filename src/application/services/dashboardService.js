const { Venta, Insumo, Cliente, Product, Compra, sequelize } = require('../../persistence/models');
const { Op } = require('sequelize');

class DashboardService {
  static async getStats() {
    try {
      const now = new Date();
      const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const todasVentas = await Venta.findAll({ raw: true }).catch(() => []);
      
      // Sales current month vs last month
      const ventasMesActual = todasVentas.filter(v => v.fechaVenta && new Date(v.fechaVenta) >= firstDayCurrentMonth);
      const ventasMesAnterior = todasVentas.filter(v => v.fechaVenta && new Date(v.fechaVenta) >= firstDayLastMonth && new Date(v.fechaVenta) <= lastDayLastMonth);

      const totalVentasActual = ventasMesActual.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
      const totalVentasAnterior = ventasMesAnterior.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);

      // If current month has 0 sales yet (e.g. fresh DB), fallback to total of all sales to show real numbers
      const totalVentasSum = todasVentas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
      const ventasTotal = totalVentasActual > 0 ? totalVentasActual : totalVentasSum;

      let ventasVariacion = 0;
      if (totalVentasAnterior > 0) {
        ventasVariacion = parseFloat((((totalVentasActual - totalVentasAnterior) / totalVentasAnterior) * 100).toFixed(1));
      } else if (totalVentasActual > 0) {
        ventasVariacion = 100;
      }

      // Orders count
      const pedidosTotalActual = ventasMesActual.length;
      const pedidosTotalAnterior = ventasMesAnterior.length;
      const pedidosTotal = todasVentas.length;

      let pedidosVariacion = 0;
      if (pedidosTotalAnterior > 0) {
        pedidosVariacion = parseFloat((((pedidosTotalActual - pedidosTotalAnterior) / pedidosTotalAnterior) * 100).toFixed(1));
      } else if (pedidosTotalActual > 0) {
        pedidosVariacion = 100;
      }

      // Frecuencia de ventas (pedidos por dia en el mes actual)
      const currentDay = now.getDate();
      let frecuenciaVentas = 0;
      if (currentDay > 0) {
        frecuenciaVentas = parseFloat((pedidosTotalActual / currentDay).toFixed(1));
      }

      // Active clients count
      const clientesTotal = await Cliente.count().catch(() => 0);
      const clientesActivos = await Cliente.count({ where: { estado: 1 } }).catch(() => clientesTotal);

      // Clientes variation
      let clientesVariacion = 0;
      try {
        const allUsers = await sequelize.query("SELECT idUsuario, createdAt, fechaCreacion FROM usuario", { type: sequelize.QueryTypes.SELECT }).catch(() => []);
        const usersThisMonth = allUsers.filter(u => {
          const date = u.createdAt || u.fechaCreacion;
          return date && new Date(date) >= firstDayCurrentMonth;
        }).length;
        const usersLastMonth = allUsers.filter(u => {
          const date = u.createdAt || u.fechaCreacion;
          return date && new Date(date) >= firstDayLastMonth && new Date(date) <= lastDayLastMonth;
        }).length;

        if (usersLastMonth > 0) {
          clientesVariacion = parseFloat((((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1));
        } else if (usersThisMonth > 0) {
          clientesVariacion = 100;
        }
      } catch (err) {
        clientesVariacion = 0;
      }

      // Products count & Low Stock
      const productosTotal = await Product.count({ where: { estado: 1 } }).catch(() => 0);
      
      const insumosBajoStockList = await Insumo.findAll({
        where: {
          estado: 1,
          stock: { [Op.lte]: sequelize.col('stockMinimo') }
        },
        raw: true
      }).catch(() => []);

      const insumosBajoStock = insumosBajoStockList.length;

      return {
        ventasTotal,
        ventasVariacion,
        pedidosTotal,
        pedidosVariacion,
        frecuenciaVentas,
        clientesTotal,
        clientesActivos,
        clientesVariacion,
        productosTotal,
        insumosBajoStock
      };
    } catch (error) {
      console.error('Error in DashboardService.getStats:', error);
      return {
        ventasTotal: 0,
        ventasVariacion: 0,
        pedidosTotal: 0,
        pedidosVariacion: 0,
        frecuenciaVentas: 0,
        clientesTotal: 0,
        clientesActivos: 0,
        clientesVariacion: 0,
        productosTotal: 0,
        insumosBajoStock: 0
      };
    }
  }

  static async getVentasChart() {
    try {
      const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const now = new Date();
      const result = [];

      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        const mesName = mesesNombres[monthIndex];

        const startOfMonth = new Date(year, monthIndex, 1);
        const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

        const ventasMes = await Venta.findAll({
          where: {
            fechaVenta: {
              [Op.between]: [startOfMonth, endOfMonth]
            }
          },
          raw: true
        }).catch(() => []);

        const comprasMes = await Compra.findAll({
          where: {
            fechaCompra: {
              [Op.between]: [startOfMonth, endOfMonth]
            }
          },
          raw: true
        }).catch(() => []);

        const totalVentas = ventasMes.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const totalCompras = comprasMes.reduce((sum, c) => sum + parseFloat(c.total || c.montoTotal || 0), 0);

        result.push({
          mes: mesName,
          ventas: totalVentas,
          compras: totalCompras
        });
      }

      // If all months 0 (new DB), populate with DB total distributed or realistic monthly distribution
      const hasAnyData = result.some(r => r.ventas > 0 || r.compras > 0);
      if (!hasAnyData) {
        const todasVentas = await Venta.findAll({ raw: true }).catch(() => []);
        const totalVentasAll = todasVentas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        if (totalVentasAll > 0) {
          result[result.length - 1].ventas = totalVentasAll;
        }
      }

      return result;
    } catch (error) {
      console.error('Error in getVentasChart:', error);
      return [];
    }
  }

  static async getProductosPopulares() {
    try {
      // Consultar los detalles de venta reales uniendo con producto y variante
      const [rows] = await sequelize.query(`
        SELECT dv.idVariante, dv.observaciones, dv.cantidad, p.nombre as productoNombre, var.nombre as varNombre
        FROM detalleventaproducto dv
        LEFT JOIN variante var ON dv.idVariante = var.idVariante
        LEFT JOIN producto p ON var.idProducto = p.idProducto
      `).catch(() => [[]]);

      if (!rows || rows.length === 0) {
        return [];
      }

      const productCounts = {};
      rows.forEach(r => {
        // Priorizar el nombre real del producto en base de datos
        let pName = r.productoNombre || r.varNombre || null;

        // Si no tiene nombre por join, verificar si observaciones es un JSON estructurado con nombre
        if (!pName && r.observaciones) {
          try {
            if (typeof r.observaciones === 'string' && r.observaciones.startsWith('{')) {
              const parsed = JSON.parse(r.observaciones);
              pName = parsed.nombre || parsed.nombreProducto || null;
            }
          } catch (e) {
            pName = null;
          }
        }

        // Descartar si es un placeholder genérico o inválido
        if (
          !pName ||
          pName === "Producto" ||
          pName === "Pedido de Venta" ||
          pName === "Producto General" ||
          pName.startsWith("Producto #")
        ) return;

        // Limpiar adiciones entre paréntesis (ej: "Hamburguesa chazin monster - base" o "(+Salsa...)")
        let nombreLimpio = pName.replace(/\s*\(.*?\)/g, "").replace(/\s*-\s*base/i, "").trim();
        if (!nombreLimpio || nombreLimpio === "Producto" || nombreLimpio === "Pedido de Venta" || nombreLimpio === "Producto General") return;

        const key = nombreLimpio.toLowerCase();
        if (!productCounts[key]) {
          productCounts[key] = { nombre: nombreLimpio, ventas: 0 };
        }
        productCounts[key].ventas += (parseInt(r.cantidad) || 1);
      });

      const sorted = Object.values(productCounts)
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 5);

      return sorted.map((p, i) => ({
        id: i + 1,
        nombre: p.nombre,
        ventas: p.ventas,
        ingresos: 0
      }));
    } catch (error) {
      console.error('Error in getProductosPopulares:', error);
      return [];
    }
  }

  static async getAlertasStock() {
    try {
      const insumosBajoStock = await Insumo.findAll({
        where: {
          estado: 1,
          stock: { [Op.lte]: sequelize.col('stockMinimo') }
        },
        limit: 5,
        raw: true
      }).catch(() => []);

      return insumosBajoStock.map(i => ({
        id: i.idInsumo,
        nombre: i.nombre,
        stock: i.stock,
        minimo: i.stockMinimo
      }));
    } catch (error) {
      console.error('Error in getAlertasStock:', error);
      return [];
    }
  }

  static async getVentasRecientes() {
    try {
      const VentaService = require('./ventaService');
      const { Venta, Cliente, User, DetalleVentaProducto } = require('../../persistence/models');
      const ventas = await Venta.findAll({
        include: [
          { 
            model: Cliente, 
            as: 'cliente',
            include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] }]
          },
          { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
          { model: DetalleVentaProducto, as: 'detalles' }
        ],
        order: [['idVenta', 'DESC']],
        limit: 5
      });

      return ventas.map(v => VentaService.formatVenta(v));
    } catch (error) {
      console.error('Error in getVentasRecientes:', error);
      return [];
    }
  }
}

module.exports = DashboardService;
