const { Cliente, User } = require('../../persistence/models');

class ClienteService {
  static async getAll() {
    const clientes = await Cliente.findAll({
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono'] }]
    });
    return clientes.map(c => ({
      id: c.idCliente,
      idCliente: c.idCliente,
      idUsuario: c.idUsuario,
      direccion: c.direccion || '',
      usuario: c.usuario ? {
        id: c.usuario.idUsuario,
        nombre: c.usuario.nombre,
        apellidos: c.usuario.apellidos,
        email: c.usuario.email,
        telefono: c.usuario.telefono
      } : null
    }));
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
    return {
      id: c.idCliente,
      idCliente: c.idCliente,
      idUsuario: c.idUsuario,
      direccion: c.direccion || '',
      usuario: c.usuario ? {
        id: c.usuario.idUsuario,
        nombre: c.usuario.nombre,
        apellidos: c.usuario.apellidos,
        email: c.usuario.email,
        telefono: c.usuario.telefono
      } : null
    };
  }

  static async create(data) {
    const cliente = await Cliente.create({
      idUsuario: data.idUsuario,
      direccion: data.direccion || ''
    });
    return this.getById(cliente.idCliente);
  }

  static async update(id, data) {
    const c = await Cliente.findByPk(id);
    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }
    if (data.direccion !== undefined) c.direccion = data.direccion;
    if (data.idUsuario !== undefined) c.idUsuario = data.idUsuario;
    await c.save();
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
    return { message: 'Cliente eliminado exitosamente' };
  }
}

module.exports = ClienteService;
