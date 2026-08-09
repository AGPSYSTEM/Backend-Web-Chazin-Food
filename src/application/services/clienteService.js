const { Cliente, User, Role, Venta, DetalleVentaProducto } = require('../../persistence/models');
const { resetAutoIncrement, resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
const bcrypt = require('bcryptjs');
const EmailService = require('./emailService');

class ClienteService {
  static async formatCliente(c) {
    let meta = {};
    let cleanDireccion = c.direccion || '';

    if (c.direccion) {
      try {
        if (c.direccion.trim().startsWith('{')) {
          meta = JSON.parse(c.direccion);
          cleanDireccion = meta.direccion !== undefined ? meta.direccion : c.direccion;
        }
      } catch (e) {
        meta = {};
      }
    }

    const tipo = meta.tipo || (c.esVip ? 'VIP' : 'Regular');
    const defaultDesc = tipo === 'VIP' ? 15 : tipo === 'Frecuente' ? 10 : tipo === 'Regular' ? 5 : 0;
    const descuentoPorcentaje = meta.descuentoPorcentaje !== undefined ? meta.descuentoPorcentaje : defaultDesc;

    // Fetch real DB transactions for this client
    let transacciones = [];
    let comprasCount = 0;
    let totalGastadoSum = 0;
    let ticketPromedioVal = 0;

    try {
      const ventasDB = await Venta.findAll({
        where: { idCliente: c.idCliente },
        order: [['idVenta', 'DESC']],
        include: [{ model: DetalleVentaProducto, as: 'detalles' }]
      });

      comprasCount = ventasDB.length;
      totalGastadoSum = ventasDB.reduce((sum, v) => sum + Number(v.total || 0), 0);
      ticketPromedioVal = comprasCount > 0 ? Math.round(totalGastadoSum / comprasCount) : 0;

      transacciones = ventasDB.map(v => {
        let prodNombre = "Pedido de Comida";
        if (v.detalles && v.detalles.length > 0) {
          prodNombre = v.detalles[0].observaciones || `Producto #${v.detalles[0].idVariante}`;
          if (v.detalles.length > 1) {
            prodNombre += ` + ${v.detalles.length - 1} más`;
          }
        }
        return {
          idTrans: v.codigoPedido || `VEN-${String(v.idVenta).padStart(4, '0')}`,
          fecha: v.fechaVenta ? new Date(v.fechaVenta).toLocaleDateString('es-CO') : 'Reciente',
          producto: prodNombre,
          total: `$${Number(v.total || 0).toLocaleString('es-CO')}`
        };
      });
    } catch (err) {
      console.warn(`Error cargando ventas para cliente #${c.idCliente}:`, err.message);
    }

    // Determine state: if no user account linked, client state is Inactivo/Pendiente
    let estadoStr = 'Activo';
    if (!c.idUsuario || c.estado === 0 || meta.estado === 'Inactivo' || meta.estado === 0) {
      estadoStr = 'Inactivo';
    } else if (c.usuario && (c.usuario.estado === 'INACTIVO' || c.usuario.estado === '0' || c.usuario.estado === 0)) {
      estadoStr = 'Inactivo';
    }

    return {
      id: c.idCliente,
      idCliente: c.idCliente,
      idUsuario: c.idUsuario || null,
      tieneCuenta: !!c.idUsuario && !!c.usuario,
      direccion: cleanDireccion,
      tipo,
      descuentoPorcentaje,
      nombre: c.usuario ? c.usuario.nombre : (meta.nombre || 'Cliente sin cuenta'),
      apellidos: c.usuario ? c.usuario.apellidos : (meta.apellidos || ''),
      email: c.usuario ? c.usuario.email : (meta.email || ''),
      telefono: c.usuario ? c.usuario.telefono : (meta.telefono || ''),
      estado: estadoStr,
      compras: comprasCount,
      totalGastado: `$${totalGastadoSum.toLocaleString('es-CO')}`,
      ticketPromedio: comprasCount > 0 ? `$${Math.round(ticketPromedioVal / 1000)}K` : '$0',
      transacciones,
      usuario: c.usuario ? {
        id: c.usuario.idUsuario,
        nombre: c.usuario.nombre,
        apellidos: c.usuario.apellidos,
        email: c.usuario.email,
        telefono: c.usuario.telefono,
        estado: c.usuario.estado
      } : null
    };
  }

  static async getAll() {
    const clientes = await Cliente.findAll({
      order: [['idCliente', 'ASC']],
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'estado'] }]
    });

    const result = [];
    for (const c of clientes) {
      result.push(await this.formatCliente(c));
    }
    return result;
  }

  static async getById(id) {
    const c = await Cliente.findByPk(id, {
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'estado'] }]
    });

    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return this.formatCliente(c);
  }

  static async create(data) {
    let idUsuario = data.idUsuario || null;
    const sinCuenta = data.sinCuenta || data.crearSinCuenta || (!data.contrasena && !idUsuario);

    // Only create a user if sinCuenta is false and credentials/data provided
    if (!sinCuenta && !idUsuario && data.nombre && (data.email || data.contrasena)) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      const defaultPass = data.contrasena || '123456';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPass, salt);

      const user = await User.create({
        nombre: data.nombre.trim(),
        apellidos: data.apellidos ? data.apellidos.trim() : '',
        email: data.email ? data.email.trim() : `cliente_${Date.now()}@chazinfood.com`,
        telefono: data.telefono ? data.telefono.trim() : '',
        contrasena: hashedPassword,
        idRol: clienteRol ? clienteRol.idRol : 3,
        estado: 'ACTIVO'
      });
      idUsuario = user.idUsuario;
    }

    const tipo = data.tipo || 'Nuevo';
    const defaultDesc = tipo === 'VIP' ? 15 : tipo === 'Frecuente' ? 10 : tipo === 'Regular' ? 5 : 0;
    const descPorcent = data.descuentoPorcentaje !== undefined ? data.descuentoPorcentaje : defaultDesc;

    // If client created without user account, it MUST be INACTIVO (0)
    const estadoVal = (sinCuenta || !idUsuario || data.estado === 'Inactivo' || data.estado === 0) ? 0 : 1;

    const direccionMeta = JSON.stringify({
      direccion: data.direccion || '',
      tipo,
      descuentoPorcentaje: descPorcent,
      nombre: data.nombre || '',
      apellidos: data.apellidos || '',
      email: data.email || '',
      telefono: data.telefono || '',
      estado: estadoVal === 0 ? 'Inactivo' : 'Activo'
    });

    const cliente = await Cliente.create({
      idUsuario: idUsuario,
      direccion: direccionMeta,
      estado: estadoVal
    });

    await resetAutoIncrement('cliente', 'idCliente');
    return this.getById(cliente.idCliente);
  }

  static async update(id, data) {
    const c = await Cliente.findByPk(id, {
      include: [{ model: User, as: 'usuario' }]
    });

    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let existingMeta = {};
    if (c.direccion && c.direccion.trim().startsWith('{')) {
      try {
        existingMeta = JSON.parse(c.direccion);
      } catch (e) {
        existingMeta = {};
      }
    } else {
      existingMeta = { direccion: c.direccion || '' };
    }

    const newDireccionStr = data.direccion !== undefined ? data.direccion : existingMeta.direccion || '';
    const newTipo = data.tipo !== undefined ? data.tipo : existingMeta.tipo || 'Regular';
    const defaultDesc = newTipo === 'VIP' ? 15 : newTipo === 'Frecuente' ? 10 : newTipo === 'Regular' ? 5 : 0;
    const newDesc = data.descuentoPorcentaje !== undefined ? data.descuentoPorcentaje : (existingMeta.descuentoPorcentaje !== undefined ? existingMeta.descuentoPorcentaje : defaultDesc);

    // Handle account linkage / creation upon edit if requested
    if (data.crearCuenta && !c.idUsuario && data.email) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      const defaultPass = data.contrasena || '123456';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPass, salt);

      const user = await User.create({
        nombre: (data.nombre || existingMeta.nombre || 'Cliente').trim(),
        apellidos: (data.apellidos || existingMeta.apellidos || '').trim(),
        email: data.email.trim(),
        telefono: (data.telefono || existingMeta.telefono || '').trim(),
        contrasena: hashedPassword,
        idRol: clienteRol ? clienteRol.idRol : 3,
        estado: 'ACTIVO'
      });
      c.idUsuario = user.idUsuario;
    } else if (data.idUsuario !== undefined) {
      c.idUsuario = data.idUsuario;
    }

    const finalEstado = (!c.idUsuario || data.estado === 'Inactivo' || data.estado === 0) ? 0 : 1;
    c.direccion = JSON.stringify({
      direccion: newDireccionStr,
      tipo: newTipo,
      descuentoPorcentaje: newDesc,
      nombre: data.nombre !== undefined ? data.nombre : existingMeta.nombre,
      apellidos: data.apellidos !== undefined ? data.apellidos : existingMeta.apellidos,
      email: data.email !== undefined ? data.email : existingMeta.email,
      telefono: data.telefono !== undefined ? data.telefono : existingMeta.telefono,
      estado: finalEstado === 0 ? 'Inactivo' : 'Activo'
    });

    if (data.estado !== undefined) c.estado = finalEstado;
    await c.save();

    if (c.usuario) {
      const nameChanged = data.nombre !== undefined || data.apellidos !== undefined;
      if (data.nombre !== undefined) c.usuario.nombre = data.nombre.trim();
      if (data.apellidos !== undefined) c.usuario.apellidos = data.apellidos.trim();
      if (data.email !== undefined) c.usuario.email = data.email.trim();
      if (data.telefono !== undefined) c.usuario.telefono = data.telefono.trim();
      if (data.estado !== undefined) {
        c.usuario.estado = data.estado === 'Inactivo' || data.estado === 0 ? 'INACTIVO' : 'ACTIVO';
      }
      await c.usuario.save();

      // Send update notification email
      if (data.notificarEmail !== false) {
        EmailService.sendUserUpdatedEmail({
          email: c.usuario.email,
          nombre: c.usuario.nombre,
          apellidos: c.usuario.apellidos,
          modifiedFields: nameChanged ? 'Nombre / Apellidos' : 'Información de cuenta'
        }).catch(err => console.error('Background email notification error in cliente update:', err.message));
      }
    }

    return this.getById(id);
  }

  static async delete(id) {
    const c = await Cliente.findByPk(id);
    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await c.destroy();
    await resequenceTableIds('cliente', 'idCliente', [{ table: 'venta', column: 'idCliente' }]);

    return { message: 'Cliente eliminado exitosamente' };
  }
}

module.exports = ClienteService;
