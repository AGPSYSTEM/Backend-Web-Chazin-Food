const nodemailer = require('nodemailer');
const {
  renderActivationEmail,
  renderWelcomeEmail,
  renderPasswordResetEmail,
  renderPasswordChangedEmail,
  renderUserUpdatedEmail
} = require('./emails');

class EmailService {
  static getTransporter() {
    try { require('dotenv').config(); } catch (e) {}
    const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 465;
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

    if (!smtpUser || !smtpPass) {
      return null;
    }

    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      }),
      from: `"Chazin Food" <${smtpUser}>`
    };
  }

  /**
   * Envía correo de activación de cliente con diseño React Email
   */
  static async sendActivationEmail({ email, nombre, apellidos, password, activationLink }) {
    try {
      const emailConfig = this.getTransporter();
      const userName = `${nombre} ${apellidos || ''}`.trim();
      const userEmail = email;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const targetLink = activationLink || `${frontendUrl}/login`;

    if (!emailConfig) {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  ✉️ CORREO DE ACTIVACIÓN DE CLIENTE (DEV - NO SMTP)  ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Para: ${userName} <${userEmail}>`);
      console.log(`║  Enlace Activación: ${targetLink}`);
      console.log(`║  Clave Temporal: ${password}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
      return true;
    }

    const html = await renderActivationEmail({
      nombre,
      apellidos,
      email: userEmail,
      password,
      activationLink: targetLink
    });

    await emailConfig.transporter.sendMail({
      from: emailConfig.from,
      to: userEmail,
      subject: '🍔 ¡Activa tu cuenta de cliente en Chazin Food! Credenciales de acceso',
      text: `¡Bienvenido a Chazin Food, ${userName}!\n\nTu cuenta de cliente ha sido registrada. Para activarla ingresa con tus credenciales:\nUsuario: ${userEmail}\nClave temporal: ${password}\nEnlace: ${targetLink}`,
      html
    });
    console.log(`✅ Correo React Email de activación enviado a ${userEmail}`);
    return true;
  } catch (err) {
    console.error('Error al enviar correo de activación via React Email / Nodemailer:', err.message);
    return false;
  }
}

/**
 * Envía correo de bienvenida con diseño React Email
 */
static async sendWelcomeEmail({ email, nombre, apellidos, password, loginLink }) {
  try {
    const emailConfig = this.getTransporter();
    const userName = `${nombre} ${apellidos || ''}`.trim();
    const userEmail = email;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const targetLink = loginLink || `${frontendUrl}/login`;

    if (!emailConfig) {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  📧 CORREO DE BIENVENIDA (MODO DEV - NO SMTP)       ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Para: ${userName} <${userEmail}>`);
      console.log(`║  Clave: ${password}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
      return true;
    }

    const html = await renderWelcomeEmail({
      nombre,
      apellidos,
      email: userEmail,
      password,
      loginLink: targetLink
    });

    await emailConfig.transporter.sendMail({
      from: emailConfig.from,
      to: userEmail,
      subject: '🎉 ¡Bienvenido a Chazin Food! Credenciales de acceso',
      text: `¡Bienvenido a Chazin Food, ${userName}!\n\nTu cuenta ha sido creada exitosamente:\nUsuario: ${userEmail}${password ? `\nContraseña: ${password}` : ''}\nEnlace de acceso: ${targetLink}`,
      html
    });
    console.log(`✅ Correo React Email de bienvenida enviado a ${userEmail}`);
    return true;
  } catch (err) {
    console.error('Error al enviar correo de bienvenida via React Email / Nodemailer:', err.message);
    return false;
  }
}

/**
 * Envía correo de recuperación de contraseña con diseño React Email
 */
static async sendPasswordResetEmail({ email, nombre, apellidos, resetLink }) {
  try {
    const emailConfig = this.getTransporter();
    const userName = `${nombre} ${apellidos || ''}`.trim();
    const userEmail = email;

    if (!emailConfig) {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  🔐 RESTABLECER CONTRASEÑA (MODO DEV - NO SMTP)     ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Para: ${userName} <${userEmail}>`);
      console.log(`║  Enlace: ${resetLink}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
      return true;
    }

    const html = await renderPasswordResetEmail({
      nombre,
      apellidos,
      resetLink
    });

    await emailConfig.transporter.sendMail({
      from: emailConfig.from,
      to: userEmail,
      subject: '🔐 Restablecer Contraseña - Chazin Food',
      text: `Hola ${userName},\n\nPara restablecer tu contraseña de Chazin Food, ingresa al siguiente enlace:\n${resetLink}\n\nEste enlace expira en 1 hora.`,
      html
    });
    console.log(`✅ Correo React Email de restablecimiento enviado a ${userEmail}`);
    return true;
  } catch (err) {
    console.error('Error al enviar correo de restablecimiento via React Email:', err.message);
    return false;
  }
}

/**
 * Envía notificación de cambio de contraseña con diseño React Email
 */
static async sendPasswordChangedEmail({ email, nombre, apellidos, supportLink }) {
  try {
    const emailConfig = this.getTransporter();
    const userName = `${nombre} ${apellidos || ''}`.trim();
    const userEmail = email;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!emailConfig) {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  🔐 NOTIFICACIÓN CAMBIO CONTRASEÑA (DEV - NO SMTP)   ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Para: ${userName} <${userEmail}>`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
      return true;
    }

    const html = await renderPasswordChangedEmail({
      nombre,
      apellidos,
      supportLink: supportLink || frontendUrl
    });

    await emailConfig.transporter.sendMail({
      from: emailConfig.from,
      to: userEmail,
      subject: '🔐 Notificación de Seguridad: Contraseña modificada - Chazin Food',
      text: `Hola ${userName},\n\nTe notificamos que la contraseña de tu cuenta en Chazin Food ha sido modificada exitosamente.\n\nSi no realizaste este cambio, por favor comunícate con nosotros de inmediato para proteger tu cuenta.`,
      html
    });
    console.log(`✅ Correo React Email de cambio de contraseña enviado a ${userEmail}`);
    return true;
  } catch (err) {
    console.error('Error al enviar notificación de contraseña via React Email:', err.message);
    return false;
  }
}

/**
 * Envía notificación de datos de cuenta actualizados con diseño React Email
 */
static async sendUserUpdatedEmail({ email, nombre, apellidos, modifiedFields, portalLink }) {
  try {
    const emailConfig = this.getTransporter();
    const userName = `${nombre} ${apellidos || ''}`.trim();
    const userEmail = email;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!emailConfig) {
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  ✏️ NOTIFICACIÓN CAMBIO DE DATOS (DEV - NO SMTP)    ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Para: ${userName} <${userEmail}>`);
      console.log(`║  Cambios: ${modifiedFields || 'Perfil actualizado'}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
      return true;
    }

    const html = await renderUserUpdatedEmail({
      nombre,
      apellidos,
      modifiedFields,
      portalLink: portalLink || `${frontendUrl}/perfil`
    });

    await emailConfig.transporter.sendMail({
      from: emailConfig.from,
      to: userEmail,
      subject: '✏️ Tus datos de usuario han sido actualizados - Chazin Food',
      text: `Hola ${userName},\n\nTe informamos que los datos de tu cuenta en Chazin Food han sido actualizados.\nModificaciones: ${modifiedFields || 'Perfil actualizado'}`,
      html
    });
    console.log(`✅ Correo React Email de actualización de datos enviado a ${userEmail}`);
    return true;
  } catch (err) {
    console.error('Error al enviar notificación de actualización via React Email:', err.message);
    return false;
  }
}
}

module.exports = EmailService;
