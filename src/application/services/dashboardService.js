const { Venta, Insumo, Cliente, Product, Compra, sequelize } = require('../../persistence/models');
const { Op } = require('sequelize');

function parseDateRange(filtro = {}) {
  const now = new Date();
  const periodo = String(filtro.periodo || '').toLowerCase().trim();
  const rawYear = filtro.year ? parseInt(filtro.year) : null;
  const targetYear = (rawYear && !isNaN(rawYear)) ? rawYear : now.getFullYear();

  let startDate = null;
  let endDate = null;

  if (periodo === 'hoy') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  } else if (periodo === '7_dias' || periodo === '7dias') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  } else if (periodo === 'este_mes' || periodo === 'mes') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  } else if (periodo === 'este_ano' || periodo === 'año' || periodo === 'ano') {
    startDate = new Date(targetYear, 0, 1, 0, 0, 0);
    endDate = new Date(targetYear, 11, 31, 23, 59, 59);
  } else if (periodo === 'todos' || periodo === 'historico' || periodo === 'all') {
    startDate = null;
    endDate = null;
  } else if (rawYear && !isNaN(rawYear)) {
    startDate = new Date(rawYear, 0, 1, 0, 0, 0);
    endDate = new Date(rawYear, 11, 31, 23, 59, 59);
  }

  return { startDate, endDate, year: targetYear, periodo };
}

class DashboardService {
  static async getStats(filtro = {}) {
    try {
      const now = new Date();
      const { startDate, endDate, year, periodo } = parseDateRange(filtro);

      const todasVentas = await Venta.findAll({ raw: true }).catch(() => []);
      
      // Total Global acumulado de todas las ventas no anuladas de la empresa
      const totalVentasGlobal = todasVentas
        .filter(v => v.estadoEntrega !== 'CANCELADO')
        .reduce((sum, v) => sum + parseFloat(v.total || 0), 0);

      // Ventas filtradas estrictamente por el periodo seleccionado
      let ventasPeriodo = todasVentas;
      if (startDate) {
        ventasPeriodo = todasVentas.filter(v => {
          if (!v.fechaVenta) return false;
          const d = new Date(v.fechaVenta);
          return d >= startDate && (!endDate || d <= endDate);
        });
      }

      const totalVentasPeriodo = ventasPeriodo
        .filter(v => v.estadoEntrega !== 'CANCELADO')
        .reduce((sum, v) => sum + parseFloat(v.total || 0), 0);

      const pedidosPeriodo = ventasPeriodo.filter(v => v.estadoEntrega !== 'CANCELADO');
      const pedidosTotal = pedidosPeriodo.length;

      // Cálculo de variación porcentual según el período seleccionado
      let ventasVariacion = 0;
      let pedidosVariacion = 0;
      let labelVariacion = "vs período anterior";

      if (periodo === 'hoy') {
        const startYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
        const endYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        const pedidosAyerList = todasVentas
          .filter(v => v.fechaVenta && new Date(v.fechaVenta) >= startYesterday && new Date(v.fechaVenta) <= endYesterday && v.estadoEntrega !== 'CANCELADO');
        const ventasAyer = pedidosAyerList.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const pedidosAyer = pedidosAyerList.length;

        if (ventasAyer > 0) {
          ventasVariacion = parseFloat((((totalVentasPeriodo - ventasAyer) / ventasAyer) * 100).toFixed(1));
        } else if (totalVentasPeriodo > 0) {
          ventasVariacion = 100;
        }

        if (pedidosAyer > 0) {
          pedidosVariacion = parseFloat((((pedidosTotal - pedidosAyer) / pedidosAyer) * 100).toFixed(1));
        } else if (pedidosTotal > 0) {
          pedidosVariacion = 100;
        }
        labelVariacion = "vs ayer";
      } else if (periodo === '7_dias' || periodo === '7dias') {
        const startPrev7 = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
        const endPrev7 = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const pedidosPrev7List = todasVentas
          .filter(v => v.fechaVenta && new Date(v.fechaVenta) >= startPrev7 && new Date(v.fechaVenta) <= endPrev7 && v.estadoEntrega !== 'CANCELADO');
        const ventasPrev7 = pedidosPrev7List.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const pedidosPrev7 = pedidosPrev7List.length;

        if (ventasPrev7 > 0) {
          ventasVariacion = parseFloat((((totalVentasPeriodo - ventasPrev7) / ventasPrev7) * 100).toFixed(1));
        } else if (totalVentasPeriodo > 0) {
          ventasVariacion = 100;
        }

        if (pedidosPrev7 > 0) {
          pedidosVariacion = parseFloat((((pedidosTotal - pedidosPrev7) / pedidosPrev7) * 100).toFixed(1));
        } else if (pedidosTotal > 0) {
          pedidosVariacion = 100;
        }
        labelVariacion = "vs 7 días ant.";
      } else if (periodo === 'este_ano' || (filtro.year && parseInt(filtro.year) !== now.getFullYear())) {
        const prevYear = year - 1;
        const startPrevYear = new Date(prevYear, 0, 1, 0, 0, 0);
        const endPrevYear = new Date(prevYear, 11, 31, 23, 59, 59);
        const pedidosPrevYearList = todasVentas
          .filter(v => v.fechaVenta && new Date(v.fechaVenta) >= startPrevYear && new Date(v.fechaVenta) <= endPrevYear && v.estadoEntrega !== 'CANCELADO');
        const ventasPrevYear = pedidosPrevYearList.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const pedidosPrevYear = pedidosPrevYearList.length;

        if (ventasPrevYear > 0) {
          ventasVariacion = parseFloat((((totalVentasPeriodo - ventasPrevYear) / ventasPrevYear) * 100).toFixed(1));
        } else if (totalVentasPeriodo > 0) {
          ventasVariacion = 100;
        }

        if (pedidosPrevYear > 0) {
          pedidosVariacion = parseFloat((((pedidosTotal - pedidosPrevYear) / pedidosPrevYear) * 100).toFixed(1));
        } else if (pedidosTotal > 0) {
          pedidosVariacion = 100;
        }
        labelVariacion = "vs año anterior";
      } else {
        // 'este_mes' o 'todos'
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const ventasMesActual = todasVentas.filter(v => v.fechaVenta && new Date(v.fechaVenta) >= firstDayCurrentMonth && v.estadoEntrega !== 'CANCELADO');
        const ventasMesAnterior = todasVentas.filter(v => v.fechaVenta && new Date(v.fechaVenta) >= firstDayLastMonth && new Date(v.fechaVenta) <= lastDayLastMonth && v.estadoEntrega !== 'CANCELADO');

        const totalMesActual = ventasMesActual.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const totalMesAnterior = ventasMesAnterior.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
        const pedidosMesAnterior = ventasMesAnterior.length;

        if (totalMesAnterior > 0) {
          ventasVariacion = parseFloat((((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100).toFixed(1));
        } else if (totalMesActual > 0) {
          ventasVariacion = 100;
        }

        if (pedidosMesAnterior > 0) {
          pedidosVariacion = parseFloat((((ventasMesActual.length - pedidosMesAnterior) / pedidosMesAnterior) * 100).toFixed(1));
        } else if (ventasMesActual.length > 0) {
          pedidosVariacion = 100;
        }
        labelVariacion = "vs mes anterior";
      }

      // Frecuencia de ventas
      let frecuenciaVentas = 0;
      if (periodo === 'hoy') {
        frecuenciaVentas = pedidosTotal;
      } else if (periodo === '7_dias' || periodo === '7dias') {
        frecuenciaVentas = parseFloat((pedidosTotal / 7).toFixed(1));
      } else if (periodo === 'este_mes' || periodo === 'mes') {
        const currentDay = Math.max(1, now.getDate());
        frecuenciaVentas = parseFloat((pedidosTotal / currentDay).toFixed(1));
      } else {
        const dayOfYear = Math.max(1, Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)));
        frecuenciaVentas = parseFloat((pedidosTotal / dayOfYear).toFixed(1));
      }

      // Clientes activos
      const clientesTotal = await Cliente.count().catch(() => 0);
      const clientesActivos = await Cliente.count({ where: { estado: 1 } }).catch(() => clientesTotal);

      // Insumos críticos
      const insumosBajoStockList = await Insumo.findAll({
        where: {
          estado: 1,
          eliminado: 0,
          stock: { [Op.lte]: sequelize.col('stockMinimo') }
        },
        raw: true
      }).catch(() => []);

      return {
        totalVentasGlobal: Math.round(totalVentasGlobal),
        ventasTotal: Math.round(totalVentasPeriodo),
        ventasMesActual: Math.round(totalVentasPeriodo),
        ventasVariacion,
        labelVariacion,
        pedidosTotal,
        pedidosVariacion,
        frecuenciaVentas,
        clientesTotal,
        clientesActivos,
        clientesVariacion: 0,
        productosTotal: await Product.count({ where: { estado: 1 } }).catch(() => 0),
        insumosBajoStock: insumosBajoStockList.length,
        divisa: "COP"
      };
    } catch (error) {
      console.error('Error in DashboardService.getStats:', error);
      return {
        totalVentasGlobal: 0,
        ventasTotal: 0,
        ventasMesActual: 0,
        ventasVariacion: 0,
        labelVariacion: "vs período anterior",
        pedidosTotal: 0,
        pedidosVariacion: 0,
        frecuenciaVentas: 0,
        clientesTotal: 0,
        clientesActivos: 0,
        clientesVariacion: 0,
        productosTotal: 0,
        insumosBajoStock: 0,
        divisa: "COP"
      };
    }
  }

  static async getVentasChart(filtro = {}) {
    try {
      const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const now = new Date();
      const { year, periodo } = parseDateRange(filtro);
      const result = [];

      if (periodo === 'hoy') {
        // Franjas horarias de hoy
        const horas = [
          { label: "08:00", start: 0, end: 8 },
          { label: "12:00", start: 8, end: 12 },
          { label: "15:00", start: 12, end: 15 },
          { label: "18:00", start: 15, end: 18 },
          { label: "21:00", start: 18, end: 21 },
          { label: "23:59", start: 21, end: 24 }
        ];

        for (const h of horas) {
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h.start, 0, 0);
          const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h.end === 24 ? 23 : h.end, h.end === 24 ? 59 : 0, 0);

          const ventasH = await Venta.findAll({
            where: {
              fechaVenta: { [Op.between]: [start, end] },
              estadoEntrega: { [Op.ne]: 'CANCELADO' }
            },
            raw: true
          }).catch(() => []);

          const comprasH = await Compra.findAll({
            where: {
              fechaCompra: { [Op.between]: [start, end] },
              estado: { [Op.ne]: 'CANCELADA' }
            },
            raw: true
          }).catch(() => []);

          result.push({
            mes: h.label,
            ventas: Math.round(ventasH.reduce((sum, v) => sum + parseFloat(v.total || 0), 0)),
            compras: Math.round(comprasH.reduce((sum, c) => sum + parseFloat(c.total || c.montoTotal || 0), 0))
          });
        }
      } else if (periodo === '7_dias' || periodo === '7dias') {
        const diasNombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
          const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
          const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

          const ventasDia = await Venta.findAll({
            where: {
              fechaVenta: { [Op.between]: [startOfDay, endOfDay] },
              estadoEntrega: { [Op.ne]: 'CANCELADO' }
            },
            raw: true
          }).catch(() => []);

          const comprasDia = await Compra.findAll({
            where: {
              fechaCompra: { [Op.between]: [startOfDay, endOfDay] },
              estado: { [Op.ne]: 'CANCELADA' }
            },
            raw: true
          }).catch(() => []);

          const dayLabel = `${diasNombres[d.getDay()]} ${d.getDate()}`;
          result.push({
            mes: dayLabel,
            ventas: Math.round(ventasDia.reduce((s, v) => s + parseFloat(v.total || 0), 0)),
            compras: Math.round(comprasDia.reduce((s, c) => s + parseFloat(c.total || c.montoTotal || 0), 0))
          });
        }
      } else if (periodo === 'este_mes' || periodo === 'mes') {
        // Semanas del mes actual
        const yr = now.getFullYear();
        const mo = now.getMonth();
        const lastDay = new Date(yr, mo + 1, 0).getDate();
        const semanas = [
          { label: "1 - 7", startDay: 1, endDay: 7 },
          { label: "8 - 14", startDay: 8, endDay: 14 },
          { label: "15 - 21", startDay: 15, endDay: 21 },
          { label: `22 - ${lastDay}`, startDay: 22, endDay: lastDay }
        ];

        for (const s of semanas) {
          const start = new Date(yr, mo, s.startDay, 0, 0, 0);
          const end = new Date(yr, mo, s.endDay, 23, 59, 59);

          const ventasSem = await Venta.findAll({
            where: {
              fechaVenta: { [Op.between]: [start, end] },
              estadoEntrega: { [Op.ne]: 'CANCELADO' }
            },
            raw: true
          }).catch(() => []);

          const comprasSem = await Compra.findAll({
            where: {
              fechaCompra: { [Op.between]: [start, end] },
              estado: { [Op.ne]: 'CANCELADA' }
            },
            raw: true
          }).catch(() => []);

          result.push({
            mes: `Sem ${s.label}`,
            ventas: Math.round(ventasSem.reduce((sum, v) => sum + parseFloat(v.total || 0), 0)),
            compras: Math.round(comprasSem.reduce((sum, c) => sum + parseFloat(c.total || c.montoTotal || 0), 0))
          });
        }
      } else if (periodo === 'todos' || periodo === 'historico' || periodo === 'all') {
        // Ítem #30: Histórico multi-anual real agrupado por año
        const ventasAll = await Venta.findAll({
          where: { estadoEntrega: { [Op.ne]: 'CANCELADO' } },
          attributes: ['fechaVenta', 'total'],
          raw: true
        }).catch(() => []);

        const comprasAll = await Compra.findAll({
          where: { estado: { [Op.ne]: 'CANCELADA' } },
          attributes: ['fechaCompra', 'total', 'subtotal'],
          raw: true
        }).catch(() => []);

        const yearMap = new Map();
        const currentY = now.getFullYear();
        for (let y = currentY - 2; y <= currentY; y++) {
          yearMap.set(y, { mes: String(y), ventas: 0, compras: 0 });
        }

        ventasAll.forEach(v => {
          if (!v.fechaVenta) return;
          const y = new Date(v.fechaVenta).getFullYear();
          if (!yearMap.has(y)) yearMap.set(y, { mes: String(y), ventas: 0, compras: 0 });
          yearMap.get(y).ventas += Math.round(parseFloat(v.total || 0));
        });

        comprasAll.forEach(c => {
          if (!c.fechaCompra) return;
          const y = new Date(c.fechaCompra).getFullYear();
          if (!yearMap.has(y)) yearMap.set(y, { mes: String(y), ventas: 0, compras: 0 });
          yearMap.get(y).compras += Math.round(parseFloat(c.total || c.subtotal || 0));
        });

        return Array.from(yearMap.entries())
          .sort(([a], [b]) => a - b)
          .map(([_, val]) => val);
      } else {
        // 'este_ano' o año específico (12 meses)
        const targetYear = year;
        for (let m = 0; m < 12; m++) {
          const startOfMonth = new Date(targetYear, m, 1, 0, 0, 0);
          const endOfMonth = new Date(targetYear, m + 1, 0, 23, 59, 59);

          const ventasMes = await Venta.findAll({
            where: {
              fechaVenta: { [Op.between]: [startOfMonth, endOfMonth] },
              estadoEntrega: { [Op.ne]: 'CANCELADO' }
            },
            raw: true
          }).catch(() => []);

          const comprasMes = await Compra.findAll({
            where: {
              fechaCompra: { [Op.between]: [startOfMonth, endOfMonth] },
              estado: { [Op.ne]: 'CANCELADA' }
            },
            raw: true
          }).catch(() => []);

          result.push({
            mes: mesesNombres[m],
            ventas: Math.round(ventasMes.reduce((sum, v) => sum + parseFloat(v.total || 0), 0)),
            compras: Math.round(comprasMes.reduce((sum, c) => sum + parseFloat(c.total || c.montoTotal || 0), 0))
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error in getVentasChart:', error);
      return [];
    }
  }

  static async getProductosPopulares(filtro = {}) {
    try {
      const { startDate, endDate } = parseDateRange(filtro);
      
      let dateFilter = "";
      const replacements = {};
      if (startDate) {
        dateFilter = "AND v.fechaVenta >= :startDate AND v.fechaVenta <= :endDate";
        replacements.startDate = startDate;
        replacements.endDate = endDate || new Date();
      }

      // Consultar los detalles de venta reales uniendo con venta, producto y variante
      const [rows] = await sequelize.query(`
        SELECT dv.idVariante, dv.observaciones, dv.cantidad, p.nombre as productoNombre, var.nombre as varNombre, v.fechaVenta
        FROM detalleventaproducto dv
        INNER JOIN venta v ON dv.idVenta = v.idVenta
        LEFT JOIN variante var ON dv.idVariante = var.idVariante
        LEFT JOIN producto p ON var.idProducto = p.idProducto
        WHERE v.estadoEntrega != 'CANCELADO'
        ${dateFilter}
      `, { replacements }).catch(() => [[]]);

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
          eliminado: 0,
          stock: { [Op.lte]: sequelize.col('stockMinimo') }
        },
        limit: 5,
        raw: true
      }).catch(() => []);

      return insumosBajoStock.map(i => ({
        id: i.idInsumo,
        idInsumo: i.idInsumo,
        nombre: i.nombre,
        stock: parseFloat(i.stock || 0),
        minimo: parseFloat(i.stockMinimo || 0),
        stockMinimo: parseFloat(i.stockMinimo || 0),
        unidadMedida: i.unidadMedida || 'unidades',
        precioUnitario: parseFloat(i.precioUnitario || 0),
        idProveedor: i.idProveedor || null
      }));
    } catch (error) {
      console.error('Error in getAlertasStock:', error);
      return [];
    }
  }

  static async getVentasRecientes(filtro = {}) {
    try {
      const VentaService = require('./ventaService');
      const { Venta, Cliente, User, DetalleVentaProducto } = require('../../persistence/models');
      const { startDate, endDate } = parseDateRange(filtro);
      const where = {};
      if (startDate) {
        where.fechaVenta = {
          [Op.between]: [startDate, endDate || new Date()]
        };
      }

      const ventas = await Venta.findAll({
        where,
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
        limit: 10
      });

      return ventas.map(v => VentaService.formatVenta(v));
    } catch (error) {
      console.error('Error in getVentasRecientes:', error);
      return [];
    }
  }
}

module.exports = DashboardService;
