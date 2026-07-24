const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Cliente, Permiso } = require('../../persistence/models');

class AuthService {
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '30d',
    });
  }

  static async register(userData) {
    const { idUsuario, documento, nombre, apellidos, apellido, email, correo, contrasena, contraseña, idRol, rol_id, tipoDocumento, telefono, direccion } = userData;
    const finalEmail = email || correo;
    const finalPassword = contrasena || contraseña;
    const finalApellido = apellidos || apellido || '';
    let finalRolId = idRol || rol_id;
    const finalDocumento = idUsuario || documento;

    if (!finalEmail || !finalPassword || !nombre) {
      const error = new Error('Por favor complete todos los campos requeridos');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email: finalEmail } });
    if (existingUser) {
      const error = new Error('El usuario ya existe con este correo');
      error.statusCode = 400;
      throw error;
    }

    if (finalDocumento && !isNaN(parseInt(finalDocumento))) {
      const existingDoc = await User.findOne({ where: { idUsuario: parseInt(finalDocumento) } });
      if (existingDoc) {
        const error = new Error('Ya existe un usuario registrado con este número de documento');
        error.statusCode = 400;
        throw error;
      }
    }

    if (!finalRolId) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      finalRolId = clienteRol ? clienteRol.idRol : 3;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

    const userPayload = {
      nombre,
      apellidos: finalApellido,
      tipoDocumento: tipoDocumento || '',
      telefono: telefono || '',
      email: finalEmail,
      contrasena: hashedPassword,
      idRol: finalRolId,
      estado: 'ACTIVO',
      fechaRegistro: new Date()
    };

    if (finalDocumento && !isNaN(parseInt(finalDocumento))) {
      userPayload.idUsuario = parseInt(finalDocumento);
    }

    const user = await User.create(userPayload);

    if (direccion) {
      try {
        await Cliente.create({
          idUsuario: user.idUsuario,
          direccion
        });
      } catch (err) {
        console.warn('Advertencia al crear registro de cliente:', err.message);
      }
    }

    const role = await Role.findByPk(user.idRol);

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      correo: user.email,
      rol: role ? role.nombre : 'Cliente',
      idRol: user.idRol,
      token: this.generateToken(user.idUsuario)
    };
  }

  static async login(email, password) {
    const finalEmail = email;
    if (!finalEmail || !password) {
      const error = new Error('Por favor proporcione correo y contraseña');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({
      where: { email: finalEmail },
      include: [
        { model: Role, as: 'rolInfo', include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }] },
        { model: Cliente, as: 'clienteInfo' }
      ]
    });

    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const rolNombre = user.rolInfo ? user.rolInfo.nombre : 'Usuario';
    const direccion = user.clienteInfo ? user.clienteInfo.direccion : '';
    // Extract permission names from the role's associated permissions
    const permisos = user.rolInfo && user.rolInfo.permisos
      ? user.rolInfo.permisos.map(p => p.nombrePermiso)
      : [];

    return {
      _id: user.idUsuario,
      id: user.idUsuario,
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellidos: user.apellidos,
      apellido: user.apellidos,
      email: user.email,
      correo: user.email,
      rol: rolNombre,
      idRol: user.idRol,
      permisos,
      direccion,
      token: this.generateToken(user.idUsuario)
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
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
      apellidos: user.apellidos,
      apellido: user.apellidos,
      tipoDocumento: user.tipoDocumento,
      telefono: user.telefono,
      email: user.email,
      correo: user.email,
      rol: user.rolInfo ? user.rolInfo.nombre : 'Usuario',
      idRol: user.idRol,
      estado: user.estado,
      direccion: user.clienteInfo ? user.clienteInfo.direccion : ''
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

    const fs = require('fs');
    const path = require('path');
    const logoPath = path.join(__dirname, '../../presentation/assets/chazin_logo_small.jpg');
    let logoSrc = 'cid:chazinLogo';
    try {
      if (fs.existsSync(logoPath)) {
        const logoBase64 = fs.readFileSync(logoPath).toString('base64');
        logoSrc = `data:image/jpeg;base64,${logoBase64}`;
      }
    } catch (e) {
      console.warn('Error leyendo logo pequeño:', e.message);
    }

    const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Restablecer Contraseña - Chazin Food</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F6F9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing:antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F4F6F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;">
          
          <!-- Top Accent Line -->
          <tr>
            <td style="background-color:#F05454; height:6px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header / Logo Area -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px 20px; background-color: #30475E;">
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center" valign="middle" style="width:105px; height:105px; border-radius:50%; background-color:#F05454; border:3px solid #FFFFFF; text-align:center; overflow:hidden;">
                    <img src="${logoSrc}" alt="🍳" width="105" height="105" style="display:block; width:105px; height:105px; border-radius:50%; border:0; outline:none; color:#FFFFFF; font-size:38px; line-height:105px; text-align:center;" />
                  </td>
                </tr>
              </table>
              <div style="color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-top: 12px; font-family:'Segoe UI', sans-serif;">
                CHAZIN FOOD
              </div>
              <div style="color: #CBD5E0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; margin-top: 4px; font-family:'Segoe UI', sans-serif;">
                SISTEMA DE GESTIÓN DE RESTAURANTE
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px; color: #222831;">
              <h1 style="color: #30475E; font-size: 22px; font-weight: 700; margin: 0 0 18px 0; text-align: center;">
                🔐 Restablecimiento de Contraseña
              </h1>
              
              <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                Hola <strong style="color: #222831;">${user.nombre} ${user.apellidos || ''}</strong>,
              </p>

              <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                Hemos recibido una solicitud para actualizar la contraseña de tu cuenta en <strong>Chazin Food</strong>. Haz clic en el botón de abajo para ingresar tu nueva contraseña:
              </p>

              <!-- Action Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #F05454; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 36px; border-radius: 12px; box-shadow: 0 4px 15px rgba(240, 84, 84, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                      Restablecer mi Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice Callout Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 10px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 16px 20px; color: #C53030; font-size: 13px; line-height: 1.6;">
                    📌 <strong>Información importante:</strong><br />
                    • Este enlace expira en <strong>1 hora</strong> por seguridad.<br />
                    • Si no solicitaste este cambio, ignora este correo y tu cuenta permanecerá protegida.
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct Link -->
              <p style="color: #718096; font-size: 12px; line-height: 1.5; margin: 0; word-break: break-all;">
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br />
                <a href="${resetLink}" style="color: #F05454; text-decoration: underline;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #F7FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; color: #718096; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600;">
                Chazin Food &copy; 2026 - Todos los derechos reservados.
              </p>
              <p style="margin: 0; color: #A0AEC0; font-size: 11px;">
                Este es un mensaje automático del sistema, por favor no respondas a este correo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const nodemailer = require('nodemailer');
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass }
        });

        await transporter.sendMail({
          from: `"Chazin Food" <${smtpUser}>`,
          to: user.email,
          subject: '🔐 Restablecer Contraseña - Chazin Food',
          text: `Hola ${user.nombre},\n\nPara restablecer tu contraseña de Chazin Food, ingresa al siguiente enlace:\n${resetLink}\n\nEste enlace expira en 1 hora.`,
          html: htmlContent,
          attachments: [
            {
              filename: 'chazin-logo.jpg',
              path: logoPath,
              cid: 'chazinLogo'
            }
          ]
        });
        console.log(`✅ Correo de recuperación enviado con logo embebido liviano a ${user.email}`);
      } catch (emailError) {
        console.error('Error al enviar correo via Nodemailer:', emailError.message);
      }
    } else {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  🔐 ENLACE DE RECUPERACIÓN DE CONTRASEÑA (DEV)      ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Usuario: ${user.email}`);
      console.log(`║  Link: ${resetLink}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
    }

    return { message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' };
  }

  static async resetPassword(data) {
    const { token, email, contrasena, contraseña, password } = data || {};
    const newPassword = contrasena || contraseña || password;

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

    return { message: 'Contraseña restablecida exitosamente' };
  }
}

module.exports = AuthService;
