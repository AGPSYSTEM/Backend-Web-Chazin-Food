const { Venta, DetalleVentaProducto, Cliente, User } = require('../../persistence/models');

class VentaService {
  static formatVenta(v) {
    let obsData = {};
    if (v.observaciones) {
      try {
        obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
          ? JSON.parse(v.observaciones)
          : { nota: v.observaciones };
      } catch (e) {
        obsData = { nota: v.observaciones };
      }
    }

    const clienteObj = v.cliente || {};
    const clienteUser = clienteObj.usuario || clienteObj.clienteInfo || v.usuario || {};
    
    // Dynamically derive client name from DB relationships without hardcoded strings
    const clienteNombre = obsData.clienteNombre || 
      (clienteUser.nombre ? `${clienteUser.nombre} ${clienteUser.apellidos || ''}`.trim() : null) ||
      (v.idCliente ? `Cliente #${v.idCliente}` : "Cliente General");

    const numeroVenta = obsData.codigoPedido || obsData.numeroVenta || `PED-${String(v.idVenta).padStart(3, '0')}`;
    
    // Dynamic format of date/time
    let horario = obsData.horario;
    if (!horario && v.fechaVenta) {
      const d = new Date(v.fechaVenta);
      const hStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      horario = `${hStr} – ${hStr}`;
    }
    horario = horario || "12:30 – 12:48";

    const tipoEntrega = obsData.tipoEntrega || "Domicilio";
    const metodoPago = obsData.metodoPago || "Efectivo";
    const estadoPago = obsData.estadoPago || "Pagado";

    // Dynamic products from db details or order metadata
    let productos = [];
    if (Array.isArray(obsData.productos) && obsData.productos.length > 0) {
      productos = obsData.productos;
    } else if (v.detalles && v.detalles.length > 0) {
      productos = v.detalles.map(d => {
        let pName = `Producto #${d.idVariante}`;
        let pAdiciones = [];
        if (d.observaciones) {
          try {
            const parsedObs = typeof d.observaciones === 'string' && d.observaciones.startsWith('{')
              ? JSON.parse(d.observaciones)
              : { nombre: d.observaciones };
            pName = parsedObs.nombre || parsedObs.nombreProducto || pName;
            pAdiciones = parsedObs.adiciones || [];
          } catch (e) {
            pName = d.observaciones;
          }
        }
        return {
          id: d.idDetalleVenta || d.idVariante,
          nombre: pName,
          cantidad: d.cantidad,
          precioUnitario: parseFloat(d.precioUnitario || 0),
          total: parseFloat(d.subtotal || 0),
          adiciones: pAdiciones
        };
      });
    } else {
      // Basic fallback structure if details table has no items
      productos = [
        {
          id: 1,
          nombre: "Pedido de Venta",
          cantidad: 1,
          precioUnitario: parseFloat(v.subtotal || 0),
          total: parseFloat(v.subtotal || 0),
          adiciones: []
        }
      ];
    }

    const subtotal = parseFloat(v.subtotal) || 0;
    const total = parseFloat(v.total) || 0;
    const iva = Math.round(subtotal * 0.19);

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      idDescuento: v.idDescuento || 1,
      numeroVenta,
      codigoPedido: numeroVenta,
      clienteNombre,
      cliente: clienteNombre,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      fecha: v.fechaVenta,
      fechaVenta: v.fechaVenta,
      horario,
      tipoEntrega,
      metodoPago,
      estadoPago,
      estadoEntrega: v.estadoEntrega,
      estado: v.estadoEntrega === 'PENDIENTE' ? 'Pendiente' : v.estadoEntrega === 'PREPARANDO' ? 'En Preparación' : v.estadoEntrega === 'LISTO' ? 'Listo' : v.estadoEntrega === 'ENTREGADO' ? 'Completada' : v.estadoEntrega,
      subtotal,
      iva,
      total,
      observaciones: v.observaciones,
      productos,
      detalles: v.detalles || []
    };
  }

  static async getAll() {
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
      order: [['idVenta', 'ASC']]
    });
    return ventas.map(v => this.formatVenta(v));
  }

  static async getById(id) {
    const v = await Venta.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, attributes: ['idUsuario', 'nombre', 'apellidos'] }]
        },
        { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
        { model: DetalleVentaProducto, as: 'detalles' }
      ]
    });
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return this.formatVenta(v);
  }

  static async create(data) {
    const obsStr = JSON.stringify({
      horario: data.horario || "12:30 – 12:48",
      tipoEntrega: data.tipoEntrega || "Domicilio",
      metodoPago: data.metodoPago || "Efectivo",
      estadoPago: data.estadoPago || "Pagado",
      codigoPedido: data.codigoPedido || data.numeroVenta || `PED-${String(Date.now()).slice(-3)}`,
      clienteNombre: data.clienteNombre || null,
      productos: data.productos || []
    });

    const venta = await Venta.create({
      idCliente: data.idCliente || 1,
      idUsuario: data.idUsuario || 1,
      idDescuento: data.idDescuento || 1,
      subtotal: data.subtotal || 0,
      descuentoAplicado: data.descuentoAplicado || 0,
      total: data.total || 0,
      estadoEntrega: data.estadoEntrega || 'PENDIENTE',
      observaciones: obsStr
    });

    if (data.detalles && data.detalles.length > 0) {
      const detalles = data.detalles.map(d => ({
        idVenta: venta.idVenta,
        idVariante: d.idVariante || 1,
        cantidad: d.cantidad || 1,
        precioUnitario: d.precioUnitario || 0,
        subtotal: d.subtotal || 0,
        observaciones: d.observaciones || d.nombre || null
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

    let estadoEnum = estado;
    if (estado === 'Pendiente') estadoEnum = 'PENDIENTE';
    else if (estado === 'En Preparación') estadoEnum = 'PREPARANDO';
    else if (estado === 'Listo') estadoEnum = 'LISTO';
    else if (estado === 'Completada' || estado === 'Entregado') estadoEnum = 'ENTREGADO';
    else if (estado === 'Anulada' || estado === 'CANCELADO') estadoEnum = 'CANCELADO';

    v.estadoEntrega = estadoEnum;
    await v.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }
}

module.exports = VentaService;
