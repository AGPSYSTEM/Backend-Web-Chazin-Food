const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

class AuthService {
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '30d',
    });
  }

  static async register(userData) {
    const { idUsuario, documento, numeroDocumento, nombre, apellidos, apellido, email, correo, contrasena, contraseña, idRol, rol_id, tipoDocumento, telefono, direccion } = userData;
    const finalEmail = (email || correo || '').trim().toLowerCase();
    const finalPassword = contrasena || contraseña;
    const rawApellido = apellidos || apellido || '';
    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(nombre, rawApellido);
    const cleanTel = sanitizeTelefono(telefono);
    const cleanTipoDoc = tipoDocumento || 'C.C.';
    let finalRolId = idRol || rol_id;
    const finalDocumento = sanitizeDocumento(documento || numeroDocumento || idUsuario || '', cleanTipoDoc);

    if (!finalEmail || !finalPassword || !cleanNom) {
      const error = new Error('Por favor complete todos los campos requeridos');
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

    // 1. Email Uniqueness
    const existingUser = await User.findOne({ where: { email: finalEmail } });
    if (existingUser) {
      const error = new Error('El usuario ya existe con este correo');
      error.statusCode = 400;
      throw error;
    }

    // 2. Full Name Uniqueness
    const newFullName = formatNombreCompleto(cleanNom, cleanApe).toLowerCase();
    const allUsers = await User.findAll({ attributes: ['idUsuario', 'nombre', 'apellidos'] });
    const duplicateName = allUsers.some(u => formatNombreCompleto(u.nombre, u.apellidos).toLowerCase() === newFullName);
    if (duplicateName) {
      const error = new Error(`Ya existe un usuario registrado con el nombre "${formatNombreCompleto(cleanNom, cleanApe)}"`);
      error.statusCode = 400;
      throw error;
    }

    // 3. Document Number Uniqueness
    if (finalDocumento) {
      const existingDoc = await User.findOne({
        where: {
          [Op.or]: [
            { numeroDocumento: finalDocumento },
            ...(!isNaN(parseInt(finalDocumento)) ? [{ idUsuario: parseInt(finalDocumento) }] : [])
          ]
        }
      });
      if (existingDoc) {
        const error = new Error(`Ya existe un usuario registrado con el número de documento "${finalDocumento}"`);
        error.statusCode = 400;
        throw error;
      }
    }

    if (!finalRolId) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      finalRolId = clienteRol ? clienteRol.idRol : 4;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

    const userPayload = {
      nombre: cleanNom,
      apellidos: cleanApe,
      tipoDocumento: cleanTipoDoc,
      numeroDocumento: finalDocumento || null,
      telefono: cleanTel,
      email: finalEmail,
      contrasena: hashedPassword,
      idRol: finalRolId,
      estado: 'ACTIVO',
      fechaRegistro: new Date()
    };

    const user = await User.create(userPayload);

    let createdCliente = null;
    if (finalRolId === 4) {
      try {
        const cleanDir = getCleanDireccion(direccion || '');
        const metaStr = JSON.stringify({
          direccion: cleanDir,
          tipo: 'Nuevo',
          descuentoPorcentaje: 0,
          nombre: cleanNom,
          apellidos: cleanApe,
          telefono: cleanTel,
          ciclo: 0
        });
        createdCliente = await Cliente.create({
          idUsuario: user.idUsuario,
          direccion: metaStr,
          estado: 1
        });
      } catch (err) {
        console.warn('Advertencia al crear registro de cliente:', err.message);
      }
    }

    // Send welcome email upon registration
    EmailService.sendWelcomeEmail({
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      password: finalPassword
    }).catch(err => console.error('Background welcome email error in register:', err.message));

    const role = await Role.findByPk(user.idRol);

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      idCliente: createdCliente ? createdCliente.idCliente : null,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      correo: user.email,
      rol: role ? role.nombre : 'Cliente',
      idRol: user.idRol,
      direccion: getCleanDireccion(direccion || ''),
      tipo: 'Nuevo',
      descuentoPorcentaje: 0,
      fidelidad: {
        tipo: 'Nuevo',
        descuentoPorcentaje: 0,
        comprasCiclo: 0,
        comprasTotales: 0,
        comprasFaltantes: 3,
        comprasMeta: 3,
        progresoPorcentaje: 0,
        siguienteNivel: 'Regular',
        diasRestantes: null,
        enGracia: false,
        diasGraciaRestantes: 0,
        estadoCiclo: 'ACTIVO'
      },
      token: this.generateToken(user.idUsuario)
    };
  }

  static async login(email, password) {
    const finalEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!finalEmail || !password) {
      const error = new Error('Por favor proporcione correo y contraseña');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = finalEmail.replace(/@chanzinfood\.com$/i, '@chazinfood.com');

    const { Sequelize, Op } = require('sequelize');
    const user = await User.findOne({
      where: {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), finalEmail),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), normalizedEmail),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), `${finalEmail}.com`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), `${normalizedEmail}.com`)
        ]
      },
      include: [
        { model: Role, as: 'rolInfo', include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }] },
        { model: Cliente, as: 'clienteInfo' }
      ]
    });

    if (!user) {
      const error = new Error('La cuenta no existe');
      error.statusCode = 404;
      throw error;
    }

    if (user.estado === 'PENDIENTE') {
      const error = new Error('Tu cuenta está pendiente de activación. Revisa tu correo electrónico para activar tu acceso y definir tu contraseña.');
      error.statusCode = 403;
      throw error;
    }

    if (user.estado === 'INACTIVO' || user.estado === '0' || user.estado === 0) {
      const error = new Error('Tu usuario está inactivo. Comunícate con el administrador para activar tu cuenta.');
      error.statusCode = 403;
      throw error;
    }

    if (user.rolInfo && (user.rolInfo.estado === 0 || user.rolInfo.estado === '0')) {
      const error = new Error('El rol asignado a tu cuenta se encuentra inactivo. Comunícate con el administrador.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const rolNombre = user.rolInfo ? user.rolInfo.nombre : 'Usuario';
    const direccion = getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : '');
    // Extract permission names from the role's associated permissions
    const permisos = user.rolInfo && user.rolInfo.permisos
      ? user.rolInfo.permisos.map(p => p.nombrePermiso)
      : [];

    let fidelidadObj = null;
    let idCliente = null;
    let tipoCliente = 'Nuevo';
    let descuentoPorcentaje = 0;

    if (!user.clienteInfo && (user.idRol === 4 || user.rolInfo?.nombre?.toLowerCase() === 'cliente')) {
      try {
        const [clientRecord] = await Cliente.findOrCreate({
          where: { idUsuario: user.idUsuario },
          defaults: {
            idUsuario: user.idUsuario,
            direccion: JSON.stringify({
              direccion: '',
              tipo: 'Nuevo',
              ciclo: 0,
              nombre: user.nombre,
              apellidos: user.apellidos,
              telefono: user.telefono,
              estado: 'Activo'
            }),
            estado: 1
          }
        });
        user.clienteInfo = clientRecord;
      } catch (err) {
        console.warn('Error asegurando clienteInfo en login:', err.message);
      }
    }

    if (user.clienteInfo) {
      try {
        const ClienteService = require('./clienteService');
        user.clienteInfo.usuario = user;
        const formattedCliente = await ClienteService.formatCliente(user.clienteInfo);
        idCliente = formattedCliente.id;
        fidelidadObj = formattedCliente.fidelidad;
        tipoCliente = formattedCliente.tipo;
        descuentoPorcentaje = formattedCliente.descuentoPorcentaje;
      } catch (e) {
        idCliente = user.clienteInfo.idCliente;
      }
    }

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
      idCliente,
      nombre: user.nombre,
      apellidos: user.apellidos,
      apellido: user.apellidos,
      tipoDocumento: user.tipoDocumento || 'C.C.',
      numeroDocumento: user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : ''),
      documento: user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : ''),
      telefono: user.telefono,
      email: user.email,
      correo: user.email,
      rol: rolNombre,
      idRol: user.idRol,
      permisos,
      direccion,
      tipo: tipoCliente,
      descuentoPorcentaje,
      fidelidad: fidelidadObj,
      foto: finalFoto,
      avatar: finalFoto,
      token: this.generateToken(user.idUsuario)
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
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

    const permisos = user.rolInfo && user.rolInfo.permisos
      ? user.rolInfo.permisos.map(p => p.nombrePermiso)
      : [];

    let fidelidadObj = null;
    let idCliente = null;
    let tipoCliente = 'Nuevo';
    let descuentoPorcentaje = 0;

    if (!user.clienteInfo && (user.idRol === 4 || user.rolInfo?.nombre?.toLowerCase() === 'cliente')) {
      try {
        const [clientRecord] = await Cliente.findOrCreate({
          where: { idUsuario: user.idUsuario },
          defaults: {
            idUsuario: user.idUsuario,
            direccion: JSON.stringify({
              direccion: '',
              tipo: 'Nuevo',
              ciclo: 0,
              nombre: user.nombre,
              apellidos: user.apellidos,
              telefono: user.telefono,
              estado: 'Activo'
            }),
            estado: 1
          }
        });
        user.clienteInfo = clientRecord;
      } catch (err) {
        console.warn('Error asegurando clienteInfo en getUserProfile:', err.message);
      }
    }

    if (user.clienteInfo) {
      try {
        const ClienteService = require('./clienteService');
        user.clienteInfo.usuario = user;
        const formattedCliente = await ClienteService.formatCliente(user.clienteInfo);
        idCliente = formattedCliente.id;
        fidelidadObj = formattedCliente.fidelidad;
        tipoCliente = formattedCliente.tipo;
        descuentoPorcentaje = formattedCliente.descuentoPorcentaje;
      } catch (e) {
        idCliente = user.clienteInfo.idCliente;
      }
    }

    const docVal = user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : '');

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
      idCliente,
      nombre: user.nombre,
      apellidos: user.apellidos,
      apellido: user.apellidos,
      tipoDocumento: user.tipoDocumento || 'C.C.',
      numeroDocumento: docVal,
      documento: docVal,
      telefono: user.telefono,
      email: user.email,
      correo: user.email,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      rolEstado: user.rolInfo ? user.rolInfo.estado : 1,
      idRol: user.idRol,
      permisos,
      estado: user.estado,
      direccion: getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : ''),
      tipo: tipoCliente,
      descuentoPorcentaje,
      fidelidad: fidelidadObj,
      foto: finalFoto,
      avatar: finalFoto
    };
  }

  static async updateProfile(userId, profileData) {
    const { passwordActual, passwordNueva, ...otherData } = profileData;

    // If password change is requested
    if (passwordNueva) {
      if (!passwordActual) {
        const error = new Error('Debes ingresar tu contraseña actual para cambiarla');
        error.statusCode = 400;
        throw error;
      }
      if (passwordNueva.length < 6) {
        const error = new Error('La nueva contraseña debe tener al menos 6 caracteres');
        error.statusCode = 400;
        throw error;
      }
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }
      const isMatch = await bcrypt.compare(passwordActual, user.contrasena);
      if (!isMatch) {
        const error = new Error('La contraseña actual es incorrecta');
        error.statusCode = 400;
        throw error;
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(passwordNueva, salt);
      await user.update({ contrasena: hashed });
    }

    // If there's other profile data to update
    if (Object.keys(otherData).length > 0) {
      const UserService = require('./userService');
      await UserService.updateUser(userId, otherData);
    }

    const profile = await this.getUserProfile(userId);
    return {
      ...profile,
      token: this.generateToken(userId)
    };
  }


  static async forgotPassword(data) {
    const { email, correo } = data || {};
    const targetEmail = email || correo;

    if (!targetEmail) {
      const error = new Error('El correo electrónico es requerido');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email: targetEmail } });

    if (!user) {
      return { message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' };
    }

    const jwtSecret = process.env.JWT_SECRET || 'chazin_food_secret_key_2026';
    const resetToken = jwt.sign(
      { id: user.idUsuario, email: user.email },
      jwtSecret + user.contrasena,
      { expiresIn: '1h' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Envío del correo con diseño React Email a través de EmailService
    await EmailService.sendPasswordResetEmail({
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      resetLink
    });

    return { message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' };
  }

  static async resetPassword(data) {
    let { token, email, contrasena, contraseña, password } = data || {};
    const newPassword = contrasena || contraseña || password;

    if (!email && token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.email) {
          email = decoded.email;
        }
      } catch (err) {}
    }

    if (!token || !email || !newPassword) {
      const error = new Error('Token, email y nueva contraseña son requeridos');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const jwtSecret = process.env.JWT_SECRET || 'chazin_food_secret_key_2026';
    try {
      jwt.verify(token, jwtSecret + user.contrasena);
    } catch (err) {
      const error = new Error('El enlace de restablecimiento es inválido o ha expirado');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ contrasena: hashedPassword });

    // Notificar al usuario por correo con diseño React Email
    try {
      EmailService.sendPasswordChangedEmail({
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        nuevaContrasena: newPassword,
        password: newPassword
      });
    } catch (e) {
      console.warn('Error al enviar notificación de contraseña actualizada:', e.message);
    }

    return { message: 'Contraseña restablecida exitosamente' };
  }

  static async googleLogin(credential, options = {}) {
    if (!credential) {
      const error = new Error('Token de Google no proporcionado');
      error.statusCode = 400;
      throw error;
    }

    const mode = options?.mode || (typeof credential === 'object' && credential.mode ? credential.mode : 'login');
    const allowRegister = options?.allowRegister !== undefined
      ? Boolean(options.allowRegister)
      : (typeof credential === 'object' && credential.allowRegister !== undefined ? Boolean(credential.allowRegister) : (mode === 'register'));

    let payload = null;
    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

    // 1. Verificación oficial con Google OAuth2Client si clientId está configurado
    if (googleClientId && typeof credential === 'string' && !credential.startsWith('{')) {
      try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: googleClientId
        });
        payload = ticket.getPayload();
      } catch (verifyError) {
        console.warn('Verificación directa con OAuth2Client falló, intentando endpoints de respaldo:', verifyError.message);
      }
    }

    // 2. Respaldo: tokeninfo oficial de Google si es un ID Token JWT de Google
    if (!payload && typeof credential === 'string' && credential.includes('.') && credential.length > 50) {
      try {
        const https = require('https');
        const tokenInfo = await new Promise((resolve, reject) => {
          https.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error_description || parsed.error) {
                  reject(new Error(parsed.error_description || parsed.error));
                } else {
                  resolve(parsed);
                }
              } catch (e) {
                reject(e);
              }
            });
          }).on('error', reject);
        });
        payload = tokenInfo;
      } catch (fallbackError) {
        // Continuar al paso 3
      }
    }

    // 3. Respaldo: Decodificación de payload JWT o parseo de objeto directo
    if (!payload) {
      try {
        if (typeof credential === 'string') {
          if (credential.trim().startsWith('{')) {
            payload = JSON.parse(credential);
          } else if (credential.includes('.')) {
            const parts = credential.split('.');
            if (parts.length >= 2) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
              payload = JSON.parse(jsonPayload);
            }
          }
        } else if (typeof credential === 'object' && (credential.email || credential.correo)) {
          payload = credential;
        }
      } catch (e) {
        console.error('Error decodificando token de Google:', e.message);
      }
    }

    if (!payload || (!payload.email && !payload.correo)) {
      const error = new Error('No se pudo autenticar con Google. Token o credencial inválida.');
      error.statusCode = 400;
      throw error;
    }

    const email = (payload.email || payload.correo).trim().toLowerCase();
    const givenName = payload.given_name || payload.name || payload.nombre || 'Usuario';
    const familyName = payload.family_name || payload.apellidos || '';
    const picture = payload.picture || payload.foto || payload.avatar || null;

    const { Sequelize } = require('sequelize');
    let user = await User.findOne({
      where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), email),
      include: [
        { model: Role, as: 'rolInfo', include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }] },
        { model: Cliente, as: 'clienteInfo' }
      ]
    });

    if (user) {
      if (user.estado === 'INACTIVO' || user.estado === '0' || user.estado === 0) {
        const error = new Error('Tu usuario está inactivo. Comunícate con el administrador para activar tu cuenta.');
        error.statusCode = 403;
        throw error;
      }

      if (user.rolInfo && (user.rolInfo.estado === 0 || user.rolInfo.estado === '0')) {
        const error = new Error('El rol asignado a tu cuenta se encuentra inactivo. Comunícate con el administrador.');
        error.statusCode = 403;
        throw error;
      }

      // Si estaba PENDIENTE y se autentica con su cuenta verificada de Google, queda activado
      if (user.estado === 'PENDIENTE') {
        await user.update({ estado: 'ACTIVO' });
        user.estado = 'ACTIVO';
      }

      if (!user.foto && picture) {
        try {
          await user.update({ foto: picture });
        } catch (e) {
          console.warn('No se pudo actualizar foto de Google:', e.message);
        }
      }
    } else {
      if (!allowRegister && mode !== 'register') {
        const error = new Error('La cuenta no existe');
        error.statusCode = 404;
        throw error;
      }

      // Registrar automáticamente nuevo usuario con rol Cliente
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'A1!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(givenName, familyName);

      const clienteRol = await Role.findOne({
        where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('nombre')), 'cliente')
      });
      const finalRolId = clienteRol ? clienteRol.idRol : 4;

      user = await User.create({
        nombre: cleanNom,
        apellidos: cleanApe,
        tipoDocumento: 'C.C.',
        numeroDocumento: null,
        telefono: null,
        email,
        contrasena: hashedPassword,
        idRol: finalRolId,
        estado: 'ACTIVO',
        foto: picture,
        fechaRegistro: new Date()
      });

      // Crear registro de cliente asociado con fidelidad
      try {
        const metaStr = JSON.stringify({
          direccion: '',
          tipo: 'Nuevo',
          descuentoPorcentaje: 0,
          nombre: cleanNom,
          apellidos: cleanApe,
          telefono: '',
          ciclo: 0,
          foto: picture
        });
        await Cliente.create({
          idUsuario: user.idUsuario,
          direccion: metaStr,
          estado: 1
        });
      } catch (err) {
        console.warn('Advertencia al crear registro de cliente para Google:', err.message);
      }

      // Re-consultar usuario con relaciones
      user = await User.findByPk(user.idUsuario, {
        include: [
          { model: Role, as: 'rolInfo', include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }] },
          { model: Cliente, as: 'clienteInfo' }
        ]
      });

      // Enviar correo de bienvenida en segundo plano
      EmailService.sendWelcomeEmail({
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        password: '(Autenticado con Google)'
      }).catch(err => console.error('Background welcome email error in googleLogin:', err.message));
    }

    const rolNombre = user.rolInfo ? user.rolInfo.nombre : 'Cliente';
    const direccion = getCleanDireccion(user.clienteInfo ? user.clienteInfo.direccion : '');
    const permisos = user.rolInfo && user.rolInfo.permisos
      ? user.rolInfo.permisos.map(p => p.nombrePermiso)
      : [];

    let fidelidadObj = null;
    let idCliente = null;
    let tipoCliente = 'Nuevo';
    let descuentoPorcentaje = 0;

    if (!user.clienteInfo && (user.idRol === 4 || user.rolInfo?.nombre?.toLowerCase() === 'cliente')) {
      try {
        const [clientRecord] = await Cliente.findOrCreate({
          where: { idUsuario: user.idUsuario },
          defaults: {
            idUsuario: user.idUsuario,
            direccion: JSON.stringify({
              direccion: '',
              tipo: 'Nuevo',
              ciclo: 0,
              nombre: user.nombre,
              apellidos: user.apellidos,
              telefono: user.telefono || '',
              estado: 'Activo'
            }),
            estado: 1
          }
        });
        user.clienteInfo = clientRecord;
      } catch (err) {
        console.warn('Error asegurando clienteInfo en googleLogin:', err.message);
      }
    }

    if (user.clienteInfo) {
      try {
        const ClienteService = require('./clienteService');
        user.clienteInfo.usuario = user;
        const formattedCliente = await ClienteService.formatCliente(user.clienteInfo);
        idCliente = formattedCliente.id;
        fidelidadObj = formattedCliente.fidelidad;
        tipoCliente = formattedCliente.tipo;
        descuentoPorcentaje = formattedCliente.descuentoPorcentaje;
      } catch (e) {
        idCliente = user.clienteInfo.idCliente;
      }
    }

    let metaFoto = null;
    if (user.clienteInfo?.direccion && user.clienteInfo.direccion.trim().startsWith('{')) {
      try {
        const meta = JSON.parse(user.clienteInfo.direccion);
        metaFoto = meta.foto || meta.avatar || null;
      } catch (e) {}
    }
    const finalFoto = user.foto || metaFoto || picture || null;

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      idCliente,
      nombre: user.nombre,
      apellidos: user.apellidos,
      apellido: user.apellidos,
      tipoDocumento: user.tipoDocumento || 'C.C.',
      numeroDocumento: user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : ''),
      documento: user.numeroDocumento || (user.idUsuario ? String(user.idUsuario) : ''),
      telefono: user.telefono || '',
      email: user.email,
      correo: user.email,
      rol: rolNombre,
      idRol: user.idRol,
      estado: user.estado,
      permisos,
      direccion,
      tipo: tipoCliente,
      descuentoPorcentaje,
      fidelidad: fidelidadObj,
      foto: finalFoto,
      avatar: finalFoto,
      token: this.generateToken(user.idUsuario)
    };
  }

  static generateActivationToken(user) {
    const jwtSecret = process.env.JWT_SECRET || 'chazin_food_secret_key_2026';
    return jwt.sign(
      { id: user.idUsuario, email: user.email, purpose: 'activate_account' },
      jwtSecret + user.contrasena,
      { expiresIn: '72h' }
    );
  }

  static async verifyActivationToken(token) {
    if (!token) {
      const error = new Error('Token de activación no proporcionado');
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id || decoded.purpose !== 'activate_account') {
      const error = new Error('El enlace de activación es inválido');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const jwtSecret = process.env.JWT_SECRET || 'chazin_food_secret_key_2026';
    try {
      jwt.verify(token, jwtSecret + user.contrasena);
    } catch (err) {
      const error = new Error(
        user.estado === 'ACTIVO'
          ? 'Esta cuenta ya fue activada anteriormente. Ya puedes iniciar sesión.'
          : 'El enlace de activación es inválido o ha expirado.'
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      valid: true,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos || '',
      estado: user.estado
    };
  }

  static async activateAccount(data = {}) {
    const { token, contrasena, contraseña, password } = data;
    const newPassword = contrasena || contraseña || password;

    if (!token || !newPassword) {
      const error = new Error('El enlace de activación y la nueva contraseña son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    if (String(newPassword).length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id || decoded.purpose !== 'activate_account') {
      const error = new Error('El enlace de activación es inválido');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(decoded.id, {
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

    const jwtSecret = process.env.JWT_SECRET || 'chazin_food_secret_key_2026';
    try {
      jwt.verify(token, jwtSecret + user.contrasena);
    } catch (err) {
      const error = new Error(
        user.estado === 'ACTIVO'
          ? 'Esta cuenta ya fue activada. Inicia sesión con tu contraseña.'
          : 'El enlace de activación es inválido o ha expirado.'
      );
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(newPassword), salt);
    await user.update({ contrasena: hashedPassword, estado: 'ACTIVO' });

    if (user.clienteInfo) {
      try {
        let meta = {};
        if (user.clienteInfo.direccion && user.clienteInfo.direccion.trim().startsWith('{')) {
          meta = JSON.parse(user.clienteInfo.direccion);
        }
        meta.estado = 'Activo';
        await user.clienteInfo.update({ direccion: JSON.stringify(meta), estado: 1 });
      } catch (e) {}
    }

    const profile = await this.getUserProfile(user.idUsuario);
    return {
      message: 'Cuenta activada exitosamente',
      ...profile,
      token: this.generateToken(user.idUsuario)
    };
  }
}

module.exports = AuthService;
