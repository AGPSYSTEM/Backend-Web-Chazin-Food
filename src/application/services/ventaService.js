const { Venta, DetalleVentaProducto, Cliente, User } = require('../../persistence/models');

class VentaService {
  static async getAll() {
    const ventas = await Venta.findAll({
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, attributes: ['idUsuario', 'nombre', 'apellidos'] }]
        },
        { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
        { model: DetalleVentaProducto, as: 'detalles' }
      ],
      order: [['idVenta', 'DESC']]
    });

    return ventas.map(v => {
      let nameStr = 'Cliente General';
      if (v.cliente && v.cliente.User) {
        nameStr = `${v.cliente.User.nombre} ${v.cliente.User.apellidos || ''}`.trim();
      } else if (v.usuario) {
        nameStr = `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim();
      }

      let estadoStr = 'Pendiente';
      if (v.estadoEntrega === 'PREPARANDO') estadoStr = 'En Preparación';
      else if (v.estadoEntrega === 'LISTO' || v.estadoEntrega === 'ENTREGADO') estadoStr = 'Completada';
      else if (v.estadoEntrega === 'CANCELADO') estadoStr = 'Anulada';
      else if (v.estadoEntrega) estadoStr = v.estadoEntrega;

      return {
        id: v.idVenta,
        idVenta: v.idVenta,
        numeroVenta: `VEN-${String(v.idVenta).padStart(4, '0')}`,
        idCliente: v.idCliente,
        idUsuario: v.idUsuario,
        fechaVenta: v.fechaVenta,
        fecha: v.fechaVenta,
        subtotal: Number(v.subtotal || 0),
        descuentoAplicado: Number(v.descuentoAplicado || 0),
        total: Number(v.total || 0),
        estadoEntrega: v.estadoEntrega,
        estado: estadoStr,
        observaciones: v.observaciones,
        clienteNombre: nameStr,
        cliente: nameStr,
        usuario: v.usuario ? `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim() : null,
        detalles: v.detalles || []
      };
    });
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

    let nameStr = 'Cliente General';
    if (v.cliente && v.cliente.User) {
      nameStr = `${v.cliente.User.nombre} ${v.cliente.User.apellidos || ''}`.trim();
    } else if (v.usuario) {
      nameStr = `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim();
    }

    let estadoStr = 'Pendiente';
    if (v.estadoEntrega === 'PREPARANDO') estadoStr = 'En Preparación';
    else if (v.estadoEntrega === 'LISTO' || v.estadoEntrega === 'ENTREGADO') estadoStr = 'Completada';
    else if (v.estadoEntrega === 'CANCELADO') estadoStr = 'Anulada';
    else if (v.estadoEntrega) estadoStr = v.estadoEntrega;

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      numeroVenta: `VEN-${String(v.idVenta).padStart(4, '0')}`,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      fechaVenta: v.fechaVenta,
      fecha: v.fechaVenta,
      subtotal: Number(v.subtotal || 0),
      descuentoAplicado: Number(v.descuentoAplicado || 0),
      total: Number(v.total || 0),
      estadoEntrega: v.estadoEntrega,
      estado: estadoStr,
      observaciones: v.observaciones,
      clienteNombre: nameStr,
      cliente: nameStr,
      usuario: v.usuario ? `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim() : null,
      detalles: v.detalles || []
    };
  }

  static async create(data) {
    let finalUsuarioId = data.idUsuario || data.userId;
    let finalClienteId = data.idCliente;

    if (finalUsuarioId && !finalClienteId) {
      let clienteObj = await Cliente.findOne({ where: { idUsuario: finalUsuarioId } });
      if (!clienteObj) {
        clienteObj = await Cliente.create({ idUsuario: finalUsuarioId, direccion: data.direccion || '' });
      }
      finalClienteId = clienteObj.idCliente;
    }

    if (!finalClienteId) {
      const firstCliente = await Cliente.findOne();
      finalClienteId = firstCliente ? firstCliente.idCliente : 1;
    }

    if (!finalUsuarioId) {
      const firstUser = await User.findOne();
      finalUsuarioId = firstUser ? firstUser.idUsuario : 1;
    }

    const venta = await Venta.create({
      idCliente: finalClienteId,
      idUsuario: finalUsuarioId,
      idDescuento: data.idDescuento || null,
      subtotal: data.subtotal || data.total || 0,
      descuentoAplicado: data.descuentoAplicado || 0,
      total: data.total || 0,
      estadoEntrega: data.estadoEntrega || 'PENDIENTE',
      observaciones: data.observaciones || null
    });

    if (data.detalles && data.detalles.length > 0) {
      let fallbackVarianteId = 1;
      try {
        const { sequelize } = require('../../persistence/models');
        const [rows] = await sequelize.query('SELECT idVariante FROM variante LIMIT 1');
        if (rows && rows[0] && rows[0].idVariante) {
          fallbackVarianteId = rows[0].idVariante;
        }
      } catch (e) {
        console.warn('Fallback variante lookup:', e.message);
      }

      const detalles = data.detalles.map(d => ({
        idVenta: venta.idVenta,
        idVariante: d.idVariante || fallbackVarianteId,
        cantidad: d.cantidad || 1,
        precioUnitario: d.precioUnitario || d.precio || 0,
        subtotal: d.subtotal || ((d.precioUnitario || d.precio || 0) * (d.cantidad || 1)),
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
    let mappedEstado = estado;
    if (estado === 'Pendiente') mappedEstado = 'PENDIENTE';
    else if (estado === 'En Preparación') mappedEstado = 'PREPARANDO';
    else if (estado === 'Completada') mappedEstado = 'ENTREGADO';
    else if (estado === 'Anulada') mappedEstado = 'CANCELADO';

    v.estadoEntrega = mappedEstado;
    await v.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }
}

module.exports = VentaService;
