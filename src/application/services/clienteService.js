const { Cliente, User, Role } = require('../../persistence/models');
const { resetAutoIncrement, resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
const bcrypt = require('bcryptjs');

class ClienteService {
  static formatCliente(c) {
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

    return {
      id: c.idCliente,
      idCliente: c.idCliente,
      idUsuario: c.idUsuario,
      direccion: cleanDireccion,
      tipo,
      descuentoPorcentaje,
      nombre: c.usuario ? c.usuario.nombre : 'Cliente',
      apellidos: c.usuario ? c.usuario.apellidos : '',
      email: c.usuario ? c.usuario.email : '',
      telefono: c.usuario ? c.usuario.telefono : '',
      estado: c.estado === 0 ? 'Inactivo' : 'Activo',
      usuario: c.usuario ? {
        id: c.usuario.idUsuario,
        nombre: c.usuario.nombre,
        apellidos: c.usuario.apellidos,
        email: c.usuario.email,
        telefono: c.usuario.telefono
      } : null
    };
  }

  static async getAll() {
    const clientes = await Cliente.findAll({
      order: [['idCliente', 'ASC']],
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono'] }]
    });

    return clientes.map(c => this.formatCliente(c));
  }

  static async getById(id) {
    const c = await Cliente.findByPk(id, {
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono'] }]
    });

    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return this.formatCliente(c);
  }

  static async create(data) {
    let idUsuario = data.idUsuario;

    if (!idUsuario && data.nombre) {
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
        estado: 1
      });
      idUsuario = user.idUsuario;
    }

    const tipo = data.tipo || 'Nuevo';
    const defaultDesc = tipo === 'VIP' ? 15 : tipo === 'Frecuente' ? 10 : tipo === 'Regular' ? 5 : 0;
    const descPorcent = data.descuentoPorcentaje !== undefined ? data.descuentoPorcentaje : defaultDesc;

    const direccionMeta = JSON.stringify({
      direccion: data.direccion || '',
      tipo,
      descuentoPorcentaje: descPorcent
    });

    const cliente = await Cliente.create({
      idUsuario: idUsuario,
      direccion: direccionMeta,
      estado: data.estado === 'Inactivo' || data.estado === 0 ? 0 : 1
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

    c.direccion = JSON.stringify({
      direccion: newDireccionStr,
      tipo: newTipo,
      descuentoPorcentaje: newDesc
    });

    if (data.idUsuario !== undefined) c.idUsuario = data.idUsuario;
    if (data.estado !== undefined) c.estado = data.estado === 'Inactivo' || data.estado === 0 ? 0 : 1;
    await c.save();

    if (c.usuario) {
      if (data.nombre !== undefined) c.usuario.nombre = data.nombre.trim();
      if (data.apellidos !== undefined) c.usuario.apellidos = data.apellidos.trim();
      if (data.email !== undefined) c.usuario.email = data.email.trim();
      if (data.telefono !== undefined) c.usuario.telefono = data.telefono.trim();
      await c.usuario.save();
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
