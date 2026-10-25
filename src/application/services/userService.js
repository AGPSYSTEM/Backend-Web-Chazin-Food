const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Role, Cliente, Permiso } = require('../../persistence/models');
const { sanitizeTelefono, sanitizeDocumento, cleanNameAndLastName, formatNombreCompleto, isValidEmailStrict, isValidPersonName } = require('../../infrastructure/utils/validationUtils');
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
      const docVal = user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : '');
      return {
        _id: user.idUsuario,
        id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: cleanNom,
        apellidos: cleanApe,
        apellido: cleanApe,
        tipoDocumento: user.tipoDocumento || 'C.C.',
        numeroDocumento: docVal,
        documento: docVal,
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
      include: [
        { model: Role, as: 'rolInfo', include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }] },
        { model: Cliente, as: 'clienteInfo' }
      ]
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(user.nombre, user.apellidos);
    const cleanTel = sanitizeTelefono(user.telefono);
    const docVal = user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : '');
    const permisos = user.rolInfo && user.rolInfo.permisos
      ? user.rolInfo.permisos.map(p => p.nombrePermiso)
      : [];

    let metaFoto = null;
    if (user.clienteInfo?.direccion && user.clienteInfo.direccion.trim().startsWith('{')) {
      try {
        const meta = JSON.parse(user.clienteInfo.direccion);
        metaFoto = meta.foto || meta.avatar || null;
      } catch (e) {}
    }
    const finalFoto = user.foto || metaFoto || null;

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: cleanNom,
      apellidos: cleanApe,
      apellido: cleanApe,
      tipoDocumento: user.tipoDocumento || 'C.C.',
      numeroDocumento: docVal,
      documento: docVal,
      telefono: cleanTel,
      email: user.email,
      correo: user.email,
      idRol: user.idRol,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      rolEstado: user.rolInfo ? user.rolInfo.estado : 1,
      permisos,
      estado: user.estado,
      direccion: getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : ''),
      foto: finalFoto,
      avatar: finalFoto,
      fechaRegistro: user.fechaRegistro
    };
  }

  static async createUser(userData) {
    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, password, idRol, rol_id, tipoDocumento, documento, numeroDocumento, telefono, direccion, estado } = userData;
    const finalEmail = (email || correo || '').trim().toLowerCase();
    const finalPassword = contrasena || contraseña || password || '123456';
    const rawApellido = apellidos || apellido || '';
    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(nombre, rawApellido);
    const cleanTel = sanitizeTelefono(telefono);
    const targetTipoDoc = tipoDocumento || 'C.C.';
    const cleanDoc = sanitizeDocumento(documento || numeroDocumento || '', targetTipoDoc);
    const finalRolId = idRol || rol_id || 1;

    if (!cleanNom || !finalEmail) {
      const error = new Error('Nombre y correo son requeridos');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidPersonName(cleanNom) || (cleanApe && !isValidPersonName(cleanApe))) {
      const error = new Error('El nombre y los apellidos no pueden contener números ni el símbolo @');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidEmailStrict(finalEmail)) {
      const error = new Error('El correo electrónico debe incluir @ y un dominio válido (ej: usuario@dominio.com)');
      error.statusCode = 400;
      throw error;
    }

    // 1. Email Uniqueness Validation
    const existing = await User.findOne({ where: { email: finalEmail } });
    if (existing) {
      const error = new Error('El usuario ya existe con este correo');
      error.statusCode = 400;
      throw error;
    }

    // 2. Full Name Uniqueness Validation
    const newFullName = formatNombreCompleto(cleanNom, cleanApe).toLowerCase();
    const allUsers = await User.findAll({ attributes: ['idUsuario', 'nombre', 'apellidos'] });
    const duplicateName = allUsers.some(u => formatNombreCompleto(u.nombre, u.apellidos).toLowerCase() === newFullName);
    if (duplicateName) {
      const error = new Error(`Ya existe un usuario registrado con el nombre "${formatNombreCompleto(cleanNom, cleanApe)}"`);
      error.statusCode = 400;
      throw error;
    }

    // 3. Document Uniqueness Validation
    if (cleanDoc) {
      const existingDoc = await User.findOne({
        where: {
          [Op.or]: [
            { numeroDocumento: cleanDoc },
            ...(!isNaN(parseInt(cleanDoc)) ? [{ idUsuario: parseInt(cleanDoc) }] : [])
          ]
        }
      });
      if (existingDoc) {
        const error = new Error(`Ya existe un usuario registrado con el número de documento "${cleanDoc}"`);
        error.statusCode = 400;
        throw error;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

    const user = await User.create({
      nombre: cleanNom,
      apellidos: cleanApe,
      tipoDocumento: targetTipoDoc,
      numeroDocumento: cleanDoc || null,
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

    const { nombre, apellidos, apellido, email, correo, contrasena, contraseña, password, idRol, rol_id, tipoDocumento, documento, numeroDocumento, telefono, direccion, estado, foto, avatar } = userData;
    const isPasswordOnly = Boolean((contrasena || contraseña || password) && !nombre && !email && !correo && !telefono && !idRol && !estado);
    
    // 1. Name & Uniqueness Check (ignoring current user)
    if (nombre !== undefined || apellidos !== undefined || apellido !== undefined) {
      const rawNom = nombre !== undefined ? nombre : user.nombre;
      const rawApe = (apellidos !== undefined || apellido !== undefined) ? (apellidos || apellido || '') : user.apellidos;
      const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(rawNom, rawApe);
      if (!isValidPersonName(cleanNom) || (cleanApe && !isValidPersonName(cleanApe))) {
        const error = new Error('El nombre y los apellidos no pueden contener números ni el símbolo @');
        error.statusCode = 400;
        throw error;
      }
      const newFullName = formatNombreCompleto(cleanNom, cleanApe).toLowerCase();
      const currentFullName = formatNombreCompleto(user.nombre, user.apellidos).toLowerCase();

      if (newFullName && newFullName !== currentFullName) {
        const otherUsers = await User.findAll({
          where: { idUsuario: { [Op.ne]: id } },
          attributes: ['idUsuario', 'nombre', 'apellidos']
        });
        const duplicateName = otherUsers.some(u => formatNombreCompleto(u.nombre, u.apellidos).toLowerCase() === newFullName);
        if (duplicateName) {
          const error = new Error(`Ya existe un usuario registrado con el nombre "${formatNombreCompleto(cleanNom, cleanApe)}"`);
          error.statusCode = 400;
          throw error;
        }
      }
      user.nombre = cleanNom;
      user.apellidos = cleanApe;
    }

    // 2. Email & Uniqueness Check (ignoring current user)
    const finalEmail = (email || correo || '').trim().toLowerCase();
    if (finalEmail && finalEmail !== (user.email || '').toLowerCase()) {
      if (!isValidEmailStrict(finalEmail)) {
        const error = new Error('El correo electrónico debe incluir @ y un dominio válido (ej: usuario@dominio.com)');
        error.statusCode = 400;
        throw error;
      }
      const existingEmail = await User.findOne({
        where: {
          email: finalEmail,
          idUsuario: { [Op.ne]: id }
        }
      });
      if (existingEmail) {
        const error = new Error('Ya existe un usuario registrado con este correo electrónico');
        error.statusCode = 400;
        throw error;
      }
      user.email = finalEmail;
    }

    // 3. Document Type & Number Uniqueness Check (ignoring current user)
    if (tipoDocumento !== undefined) user.tipoDocumento = tipoDocumento;
    const rawDoc = documento !== undefined ? documento : (numeroDocumento !== undefined ? numeroDocumento : undefined);
    if (rawDoc !== undefined) {
      const targetTipoDoc = user.tipoDocumento || 'C.C.';
      const cleanDoc = sanitizeDocumento(rawDoc, targetTipoDoc);
      const currentDoc = String(user.numeroDocumento || user.idUsuario || '');
      if (cleanDoc && cleanDoc !== currentDoc) {
        const existingDoc = await User.findOne({
          where: {
            idUsuario: { [Op.ne]: id },
            [Op.or]: [
              { numeroDocumento: cleanDoc },
              ...(!isNaN(parseInt(cleanDoc)) ? [{ idUsuario: parseInt(cleanDoc) }] : [])
            ]
          }
        });
        if (existingDoc) {
          const error = new Error(`Ya existe un usuario registrado con el número de documento "${cleanDoc}"`);
          error.statusCode = 400;
          throw error;
        }
      }
      user.numeroDocumento = cleanDoc;
    }

    if (telefono !== undefined) user.telefono = sanitizeTelefono(telefono);
    if (idRol || rol_id) user.idRol = idRol || rol_id;
    if (estado) user.estado = estado;
    if (foto !== undefined || avatar !== undefined) {
      user.foto = foto !== undefined ? foto : (avatar !== undefined ? avatar : null);
    }

    if (contrasena || contraseña || password) {
      const salt = await bcrypt.genSalt(10);
      user.contrasena = await bcrypt.hash(contrasena || contraseña || password, salt);
    }

    await user.save();

    if (direccion !== undefined || foto !== undefined || avatar !== undefined) {
      const cleanDir = direccion !== undefined ? getCleanDireccion(direccion) : undefined;
      let cliente = await Cliente.findOne({ where: { idUsuario: id } });
      if (cliente) {
        let meta = {};
        if (cliente.direccion && cliente.direccion.trim().startsWith('{')) {
          try { meta = JSON.parse(cliente.direccion); } catch (e) { meta = {}; }
        }
        if (cleanDir !== undefined) meta.direccion = cleanDir;
        meta.nombre = user.nombre;
        meta.apellidos = user.apellidos;
        meta.email = user.email;
        meta.telefono = user.telefono;
        if (user.foto !== undefined) meta.foto = user.foto;
        cliente.direccion = JSON.stringify(meta);
        await cliente.save();
      } else {
        const metaStr = JSON.stringify({
          direccion: cleanDir || '',
          tipo: 'Nuevo',
          descuentoPorcentaje: 0,
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          foto: user.foto || null
        });
        await Cliente.create({ idUsuario: id, direccion: metaStr });
      }
    }

    // Send notification email unless explicitly set to false
    if (userData.notificarEmail !== false && userData.notificarEmail !== 0) {
      const finalNewPassword = contrasena || contraseña || password;
      const isPasswordChanged = Boolean(finalNewPassword);

      if (isPasswordChanged) {
        EmailService.sendPasswordChangedEmail({
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          nuevaContrasena: finalNewPassword,
          password: finalNewPassword
        }).catch(err => console.error('Background password email error:', err.message));
      }

      // Detect modified profile fields
      const modifiedList = [];
      if (userData.nombre !== undefined) modifiedList.push('Nombre');
      if (userData.apellidos !== undefined || userData.apellido !== undefined) modifiedList.push('Apellidos');
      if (userData.telefono !== undefined) modifiedList.push('Teléfono');
      if (userData.email !== undefined || userData.correo !== undefined) modifiedList.push('Correo Electrónico');
      if (userData.numeroDocumento !== undefined || userData.documento !== undefined) modifiedList.push('Número de Documento');
      if (userData.idRol !== undefined || userData.rol_id !== undefined) modifiedList.push('Rol de Usuario');
      if (userData.estado !== undefined) modifiedList.push('Estado de Cuenta');
      if (userData.direccion !== undefined) modifiedList.push('Dirección');
      if (userData.foto !== undefined || userData.avatar !== undefined) modifiedList.push('Foto de Perfil');

      if (modifiedList.length > 0 && !isPasswordOnly) {
        EmailService.sendUserUpdatedEmail({
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          modifiedFields: modifiedList.join(', ')
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

    const { Venta, Compra } = require('../../persistence/models');

    // 1. Proteger integridad si el usuario tiene un perfil de Cliente con ventas
    const cliente = await Cliente.findOne({ where: { idUsuario: id } });
    if (cliente) {
      const ventasCliente = await Venta.count({ where: { idCliente: cliente.idCliente } }).catch(() => 0);
      if (ventasCliente > 0) {
        const error = new Error(
          `No es posible eliminar al usuario "${user.nombre}" porque cuenta con ${ventasCliente} ${ventasCliente === 1 ? 'venta o pedido asociado' : 'ventas o pedidos asociados'} como cliente. Por integridad contable y legal, solo puedes cambiar su estado a Inactivo.`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // 2. Proteger integridad si el usuario ha registrado ventas como cajero/vendedor
    const ventasUsuario = await Venta.count({ where: { idUsuario: id } }).catch(() => 0);
    if (ventasUsuario > 0) {
      const error = new Error(
        `No es posible eliminar al usuario "${user.nombre}" porque tiene ${ventasUsuario} ${ventasUsuario === 1 ? 'venta registrada' : 'ventas registradas'} en el sistema. Para suspender su acceso, cambia su estado a Inactivo.`
      );
      error.statusCode = 400;
      throw error;
    }

    // 3. Proteger integridad si el usuario ha registrado compras de insumos
    if (Compra) {
      const comprasUsuario = await Compra.count({ where: { idUsuario: id } }).catch(() => 0);
      if (comprasUsuario > 0) {
        const error = new Error(
          `No es posible eliminar al usuario "${user.nombre}" porque cuenta con ${comprasUsuario} ${comprasUsuario === 1 ? 'orden de compra registrada' : 'órdenes de compra registradas'}. Solo puedes cambiar su estado a Inactivo.`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // 4. Intentar eliminación protegida
    try {
      if (cliente) {
        await cliente.destroy();
      }
      await user.destroy();
    } catch (err) {
      if (err.name === 'SequelizeForeignKeyConstraintError' || (err.message && err.message.toLowerCase().includes('foreign key constraint fails'))) {
        const error = new Error(
          `No es posible eliminar al usuario "${user.nombre}" porque tiene registros históricos vinculados en la base de datos (ventas, pedidos o compras). Por integridad de datos, cambia su estado a Inactivo para suspender su acceso.`
        );
        error.statusCode = 400;
        throw error;
      }
      throw err;
    }

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('usuario', 'idUsuario');

    return { message: 'Usuario eliminado exitosamente' };
  }
}

module.exports = UserService;
