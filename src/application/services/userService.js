const bcrypt = require('bcryptjs');
const { User, Role, Cliente } = require('../../persistence/models');

class UserService {
  static async getAllUsers() {
    const users = await User.findAll({
      include: [{ model: Role, as: 'rolInfo' }, { model: Cliente, as: 'clienteInfo' }],
      order: [['fechaRegistro', 'DESC']]
    });

    return users.map(user => ({
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellidos: user.apellidos || '',
      apellido: user.apellidos || '',
      tipoDocumento: user.tipoDocumento || '',
      telefono: user.telefono || '',
      email: user.email,
      correo: user.email,
      idRol: user.idRol,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      estado: user.estado,
      direccion: user.clienteInfo ? user.clienteInfo.direccion : '',
      fechaRegistro: user.fechaRegistro
    }));
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [{ model: Role, as: 'rolInfo' }, { model: Cliente, as: 'clienteInfo' }]
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellidos: user.apellidos || '',
      apellido: user.apellidos || '',
      tipoDocumento: user.tipoDocumento || '',
      telefono: user.telefono || '',
      email: user.email,
      correo: user.email,
      idRol: user.idRol,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      estado: user.estado,
      direccion: user.clienteInfo ? user.clienteInfo.direccion : '',
      fechaRegistro: user.fechaRegistro
    };
  }

  static async createUser(userData) {
    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, idRol, rol_id, tipoDocumento, telefono, direccion, estado } = userData;
    const finalEmail = email || correo;
    const finalPassword = contrasena || contraseña || '123456';
    const finalApellido = apellidos || apellido || '';
    const finalRolId = idRol || rol_id || 1;

    if (!nombre || !finalEmail) {
      const error = new Error('Nombre y correo son requeridos');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ where: { email: finalEmail } });
    if (existing) {
      const error = new Error('El usuario ya existe con este correo');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

    const user = await User.create({
      nombre,
      apellidos: finalApellido,
      tipoDocumento: tipoDocumento || '',
      telefono: telefono || '',
      email: finalEmail,
      contrasena: hashedPassword,
      idRol: finalRolId,
      estado: estado || 'ACTIVO',
      fechaRegistro: new Date()
    });

    if (direccion) {
      await Cliente.create({
        idUsuario: user.idUsuario,
        direccion
      });
    }

    return this.getUserById(user.idUsuario);
  }

  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, idRol, rol_id, tipoDocumento, telefono, direccion, estado } = userData;
    
    if (nombre) user.nombre = nombre;
    if (apellidos !== undefined || apellido !== undefined) user.apellidos = apellidos || apellido || '';
    if (email || correo) user.email = email || correo;
    if (tipoDocumento !== undefined) user.tipoDocumento = tipoDocumento;
    if (telefono !== undefined) user.telefono = telefono;
    if (idRol || rol_id) user.idRol = idRol || rol_id;
    if (estado) user.estado = estado;

    if (contrasena || contraseña) {
      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(contrasena || contraseña, salt);
    }

    await user.save();

    if (direccion !== undefined) {
      let cliente = await Cliente.findOne({ where: { idUsuario: id } });
      if (cliente) {
        cliente.direccion = direccion;
        await cliente.save();
      } else {
        await Cliente.create({ idUsuario: id, direccion });
      }
    }

    return this.getUserById(id);
  }

  static async toggleStatus(id, estado) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    user.estado = estado || (user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO');
    await user.save();
    return this.getUserById(id);
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await Cliente.destroy({ where: { idUsuario: id } });
    await user.destroy();
    return { message: 'Usuario eliminado exitosamente' };
  }
}

module.exports = UserService;
