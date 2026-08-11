const nodemailer = require('nodemailer');

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

  static async sendWelcomeEmail({ email, nombre, apellidos, password }) {
    try {
      const emailConfig = this.getTransporter();
      const userName = `${nombre} ${apellidos || ''}`.trim();
      const userEmail = email;

      if (!emailConfig) {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║  📧 CORREO DE BIENVENIDA (MODO DEV - NO SMTP)       ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log(`║  Para: ${userName} <${userEmail}>`);
        console.log(`║  Clave: ${password}`);
        console.log('╚══════════════════════════════════════════════════════╝\n');
        return true;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
          <h2 style="color: #F05454; text-align: center;">¡Bienvenido a Chazin Food! 🎉</h2>
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso al sistema:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Correo:</strong> ${userEmail}</p>
            <p style="margin: 5px 0;"><strong>Contraseña:</strong> ${password}</p>
          </div>
          <p style="color: #666; font-size: 13px;">Te recomendamos cambiar tu contraseña tras iniciar sesión por primera vez.</p>
        </div>
      `;

      await emailConfig.transporter.sendMail({
        from: emailConfig.from,
        to: userEmail,
        subject: '🎉 ¡Bienvenido a Chazin Food! Mis credenciales de acceso',
        html
      });
      console.log(`✅ Correo de bienvenida enviado a ${userEmail}`);
      return true;
    } catch (err) {
      console.error('Error al enviar correo de bienvenida via Nodemailer:', err.message);
      return false;
    }
  }

  static async sendPasswordChangedEmail({ email, nombre, apellidos }) {
    try {
      const emailConfig = this.getTransporter();
      const userName = `${nombre} ${apellidos || ''}`.trim();
      const userEmail = email;

      if (!emailConfig) {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║  🔐 NOTIFICACIÓN CAMBIO CONTRASEÑA (DEV - NO SMTP)   ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log(`║  Para: ${userName} <${userEmail}>`);
        console.log('╚══════════════════════════════════════════════════════╝\n');
        return true;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #7C3AED; text-align: center;">🔐 Seguridad de la Cuenta</h2>
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Te notificamos que tu contraseña ha sido modificada recientemente por seguridad.</p>
          <p style="color: #666; font-size: 13px; margin-top: 20px;">Si no realizaste este cambio, por favor contacta al administrador de Chazin Food inmediatamente.</p>
        </div>
      `;

      await emailConfig.transporter.sendMail({
        from: emailConfig.from,
        to: userEmail,
        subject: '🔐 Notificación de Seguridad: Contraseña modificada',
        html
      });
      console.log(`✅ Correo de notificación de contraseña enviado a ${userEmail}`);
      return true;
    } catch (err) {
      console.error('Error al enviar notificación de contraseña via Nodemailer:', err.message);
      return false;
    }
  }

  static async sendUserUpdatedEmail({ email, nombre, apellidos, modifiedFields }) {
    try {
      const emailConfig = this.getTransporter();
      const userName = `${nombre} ${apellidos || ''}`.trim();
      const userEmail = email;

      if (!emailConfig) {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║  ✏️ NOTIFICACIÓN CAMBIO DE DATOS (DEV - NO SMTP)    ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log(`║  Para: ${userName} <${userEmail}>`);
        console.log(`║  Cambios: ${modifiedFields || 'Perfil actualizado'}`);
        console.log('╚══════════════════════════════════════════════════════╝\n');
        return true;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #F05454; text-align: center;">✏️ Información de Cuenta Actualizada</h2>
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Tus datos de usuario en Chazin Food han sido actualizados:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Detalles modificados:</strong> ${modifiedFields || 'Información de perfil'}</p>
          </div>
          <p style="color: #666; font-size: 13px;">Si no solicitaste este cambio, comunícate con soporte.</p>
        </div>
      `;

      await emailConfig.transporter.sendMail({
        from: emailConfig.from,
        to: userEmail,
        subject: '✏️ Tus datos de usuario han sido actualizados - Chazin Food',
        html
      });
      console.log(`✅ Correo de actualización enviado a ${userEmail}`);
      return true;
    } catch (err) {
      console.error('Error al enviar notificación de actualización via Nodemailer:', err.message);
      return false;
    }
  }
}

module.exports = EmailService;
