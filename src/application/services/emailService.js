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

  static async sendActivationEmail({ email, nombre, apellidos, password, activationLink }) {
    try {
      const emailConfig = this.getTransporter();
      const userName = `${nombre} ${apellidos || ''}`.trim();
      const userEmail = email;
      const targetLink = activationLink || 'http://localhost:5173/login';

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

      const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #f1f5f9; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ef4444; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Chazin Food</h1>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Comidas Rápidas Artesanales</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
            <h2 style="color: #1e293b; font-size: 18px; margin-top: 0; margin-bottom: 12px;">¡Bienvenido a Chazin Food, ${userName}! 🎉</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              Tu cuenta de cliente ha sido registrada en nuestro sistema. Para configurar tu acceso y comenzar a disfrutar de nuestros productos artesanales y beneficios de fidelización, por favor activa tu cuenta ingresando con tus credenciales:
            </p>
            
            <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px dashed #cbd5e1; margin-bottom: 20px;">
              <p style="margin: 4px 0; color: #334155; font-size: 13px;"><strong>Usuario / Correo:</strong> <span style="color: #0284c7;">${userEmail}</span></p>
              <p style="margin: 4px 0; color: #334155; font-size: 13px;"><strong>Contraseña temporal:</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #ef4444;">${password}</code></p>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${targetLink}" style="background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);">
                Activar Mi Cuenta y Configurar Acceso
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
              Por seguridad, te recomendamos cambiar tu contraseña una vez hayas iniciado sesión por primera vez.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
            Este es un correo automático generado por Chazin Food Web. Si no esperabas este mensaje, puedes ignorarlo.
          </p>
        </div>
      `;

      await emailConfig.transporter.sendMail({
        from: emailConfig.from,
        to: userEmail,
        subject: '🍔 ¡Activa tu cuenta de cliente en Chazin Food! Credenciales de acceso',
        html
      });
      console.log(`✅ Correo de activación de cliente enviado a ${userEmail}`);
      return true;
    } catch (err) {
      console.error('Error al enviar correo de activación de cliente via Nodemailer:', err.message);
      return false;
    }
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
