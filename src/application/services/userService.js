const bcrypt = require('bcryptjs');
const { User, Role, Cliente } = require('../../persistence/models');
const { sanitizeTelefono, sanitizeDocumento, cleanNameAndLastName } = require('../../infrastructure/utils/validationUtils');
const EmailService = require('./emailService');

function getCleanDireccion(raw) {
  if (!raw) return '';
  if (typeof raw === 'string' && raw.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(raw);
      return obj.direccion !== undefined ? obj.direccion : raw;
    } catch (e) {
      return raw;
    }
  }
  return raw;
}

class UserService {
  static async getAllUsers() {
    const users = await User.findAll({
      include: [{ model: Role, as: 'rolInfo' }, { model: Cliente, as: 'clienteInfo' }],
      order: [['fechaRegistro', 'DESC']]
    });

    return users.map(user => {
      const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(user.nombre, user.apellidos);
      const cleanTel = sanitizeTelefono(user.telefono);
      return {
        _id: user.idUsuario,
        id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: cleanNom,
        apellidos: cleanApe,
        apellido: cleanApe,
        tipoDocumento: user.tipoDocumento || '',
        telefono: cleanTel,
        email: user.email,
        correo: user.email,
        idRol: user.idRol,
        rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
        estado: user.estado,
        direccion: getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : ''),
        fechaRegistro: user.fechaRegistro
      };
    });
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

    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(user.nombre, user.apellidos);
    const cleanTel = sanitizeTelefono(user.telefono);

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: cleanNom,
      apellidos: cleanApe,
      apellido: cleanApe,
      tipoDocumento: user.tipoDocumento || '',
      telefono: cleanTel,
      email: user.email,
      correo: user.email,
      idRol: user.idRol,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      estado: user.estado,
      direccion: getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : ''),
      fechaRegistro: user.fechaRegistro
    };
  }

  static async createUser(userData) {
    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, password, idRol, rol_id, tipoDocumento, documento, telefono, direccion, estado } = userData;
    const finalEmail = email || correo;
    const finalPassword = contrasena || contraseña || password || '123456';
    const rawApellido = apellidos || apellido || '';
    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(nombre, rawApellido);
    const cleanTel = sanitizeTelefono(telefono);
    const cleanDoc = sanitizeDocumento(documento || tipoDocumento, tipoDocumento);
    const finalRolId = idRol || rol_id || 1;

    if (!cleanNom || !finalEmail) {
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
      nombre: cleanNom,
      apellidos: cleanApe,
      tipoDocumento: tipoDocumento || 'C.C.',
      telefono: cleanTel,
      email: finalEmail,
      contrasena: hashedPassword,
      idRol: finalRolId,
      estado: estado || 'ACTIVO',
      fechaRegistro: new Date()
    });

    if (direccion) {
      const cleanDir = getCleanDireccion(direccion);
      const metaStr = JSON.stringify({ direccion: cleanDir, tipo: 'Nuevo', descuentoPorcentaje: 0, nombre: cleanNom, apellidos: cleanApe, telefono: cleanTel });
      await Cliente.create({
        idUsuario: user.idUsuario,
        direccion: metaStr
      });
    }

    // Send welcome email if requested
    if (userData.enviarCorreoBienvenida || userData.notificarEmail) {
      EmailService.sendWelcomeEmail({
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        password: finalPassword
      }).catch(err => console.error('Background welcome email error:', err.message));
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

    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, password, idRol, rol_id, tipoDocumento, documento, telefono, direccion, estado } = userData;
    const isPasswordOnly = Boolean((contrasena || contraseña || password) && !nombre && !email && !correo && !telefono && !idRol && !estado);
    
    if (nombre !== undefined || apellidos !== undefined || apellido !== undefined) {
      const rawNom = nombre !== undefined ? nombre : user.nombre;
      const rawApe = (apellidos !== undefined || apellido !== undefined) ? (apellidos || apellido || '') : user.apellidos;
      const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(rawNom, rawApe);
      user.nombre = cleanNom;
      user.apellidos = cleanApe;
    }

    if (email || correo) user.email = email || correo;
    if (tipoDocumento !== undefined) user.tipoDocumento = tipoDocumento;
    if (telefono !== undefined) user.telefono = sanitizeTelefono(telefono);
    if (idRol || rol_id) user.idRol = idRol || rol_id;
    if (estado) user.estado = estado;

    if (contrasena || contraseña || password) {
      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(contrasena || contraseña || password, salt);
    }

    await user.save();

    if (direccion !== undefined) {
      const cleanDir = getCleanDireccion(direccion);
      let cliente = await Cliente.findOne({ where: { idUsuario: id } });
      if (cliente) {
        let meta = {};
        if (cliente.direccion && cliente.direccion.trim().startsWith('{')) {
          try { meta = JSON.parse(cliente.direccion); } catch (e) { meta = {}; }
        }
        meta.direccion = cleanDir;
        cliente.direccion = JSON.stringify(meta);
        await cliente.save();
      } else {
        const metaStr = JSON.stringify({ direccion: cleanDir, tipo: 'Nuevo', descuentoPorcentaje: 0 });
        await Cliente.create({ idUsuario: id, direccion: metaStr });
      }
    }

    // Send notification email unless explicitly set to false
    if (userData.notificarEmail !== false && userData.notificarEmail !== 0) {
      if (isPasswordOnly || contrasena || contraseña || password) {
        EmailService.sendPasswordChangedEmail({
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos
        }).catch(err => console.error('Background password email error:', err.message));
      } else {
        EmailService.sendUserUpdatedEmail({
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          modifiedFields: 'Nombre, Teléfono, Rol o Estado'
        }).catch(err => console.error('Background user update email error:', err.message));
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

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('usuario', 'idUsuario');


    return { message: 'Usuario eliminado exitosamente' };
  }
}

module.exports = UserService;
