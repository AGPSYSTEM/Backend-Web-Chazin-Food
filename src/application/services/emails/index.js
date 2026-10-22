/**
 * Chazin Food - Servicio Unificado de Renderizado de Correos Transaccionales
 * Utiliza @react-email/render con los componentes React Email del sistema de diseño gastronómico artesanal.
 * Incluye respaldo con generación HTML directa con los mismos tokens para máxima resiliencia.
 */

const React = require('react');
const { render } = require('@react-email/render');

const ActivationEmail = require('./ActivationEmail');
const WelcomeEmail = require('./WelcomeEmail');
const PasswordResetEmail = require('./PasswordResetEmail');
const PasswordChangedEmail = require('./PasswordChangedEmail');
const UserUpdatedEmail = require('./UserUpdatedEmail');
const { colors, typography, LOGO_OFFICIAL_URL } = require('./EmailStyles');

const e = React.createElement;

// Generador de cabecera HTML estática con diseño artesanal refinado
function getEmailHeader(subtitle = 'Comidas Rápidas Artesanales') {
  return `
    <div style="height:4px;background:linear-gradient(90deg, #DC2626 0%, #EA580C 50%, #D97706 100%);border-top-left-radius:16px;border-top-right-radius:16px;"></div>
    <div style="background-color:${colors.castIron};padding:30px 24px 26px;text-align:center;border-bottom:1px solid ${colors.castIronBorder};">
      <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;text-align:center;">
        <tbody>
          <tr>
            <td align="center">
              <img src="${LOGO_OFFICIAL_URL}" alt="Chazin Food" width="76" height="76" style="border-radius:50%;border:2px solid rgba(255,255,255,0.22);box-shadow:0 4px 16px rgba(0,0,0,0.45), 0 0 0 4px rgba(220,38,38,0.18);display:block;margin:0 auto;background-color:#FFFFFF;object-fit:cover;" />
            </td>
          </tr>
        </tbody>
      </table>
      <h1 style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:1.5px;margin:12px 0 2px 0;text-transform:uppercase;">Chazin Food</h1>
      <div style="margin-top:4px;">
        <span style="display:inline-block;background-color:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);border-radius:9999px;padding:3px 12px;color:#FCA5A5;font-size:10.5px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">
          Hamburguesería & Sabor Artesanal
        </span>
      </div>
      ${subtitle ? `<p style="color:#A8A29E;font-size:12.5px;font-weight:500;letter-spacing:0.2px;margin:8px 0 0 0;">${subtitle}</p>` : ''}
    </div>
  `;
}

// Generador de pie de página HTML estático
function getEmailFooter() {
  const currentYear = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
    <div style="background-color:#FAFAF9;padding:28px 24px 30px;text-align:center;border-bottom-left-radius:16px;border-bottom-right-radius:16px;border-top:1px solid ${colors.borderLight};">
      <div style="margin-bottom:18px;">
        <a href="${frontendUrl}" style="background-color:#FFFFFF;border:1px solid ${colors.borderLight};border-radius:8px;color:${colors.textTitle};font-size:12px;font-weight:600;text-decoration:none;padding:7px 14px;margin:0 4px;display:inline-block;">Explorar Menú</a>
        <a href="${frontendUrl}/login" style="background-color:#FFFFFF;border:1px solid ${colors.borderLight};border-radius:8px;color:${colors.textTitle};font-size:12px;font-weight:600;text-decoration:none;padding:7px 14px;margin:0 4px;display:inline-block;">Mi Cuenta</a>
        <a href="https://wa.me/573000000000" style="background-color:#FFFFFF;border:1px solid ${colors.borderLight};border-radius:8px;color:${colors.emeraldText};font-size:12px;font-weight:600;text-decoration:none;padding:7px 14px;margin:0 4px;display:inline-block;">WhatsApp Soporte</a>
      </div>
      <p style="color:${colors.textBody};font-size:12px;font-weight:700;margin:0 0 4px 0;">Chazin Food · Hamburguesería & Sabor Artesanal</p>
      <p style="color:${colors.textMuted};font-size:11.5px;line-height:1.5;margin:0 0 14px 0;">
        Calle 21 #80-21, Belén, Medellín, Colombia • Pedidos Online y Presencial
      </p>
      <hr style="border:0;border-top:1px solid ${colors.borderLight};margin:14px 0;" />
      <p style="color:${colors.textSubtle};font-size:11px;line-height:1.6;margin:0;">
        © ${currentYear} Chazin Food. Todos los derechos reservados.<br />
        Este es un mensaje transaccional automatizado y seguro emitido por Chazin Food. No respondas directamente a este remitente.
      </p>
    </div>
  `;
}

function wrapEmailContainer(content, subtitle = '') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chazin Food</title>
</head>
<body style="background-color:${colors.canvasBg};font-family:${typography.fontFamily};margin:0;padding:32px 14px;-webkit-font-smoothing:antialiased;">
  <div style="background-color:${colors.cardBg};border-radius:16px;max-width:580px;margin:0 auto;border:1px solid ${colors.borderLight};box-shadow:0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.03);overflow:hidden;">
    ${getEmailHeader(subtitle)}
    <div style="padding:36px 32px 28px;">
      ${content}
    </div>
    ${getEmailFooter()}
  </div>
</body>
</html>`;
}

/**
 * 1. Correo de Activación de Cliente
 */
async function renderActivationEmail(props) {
  try {
    return await render(e(ActivationEmail, props));
  } catch (err) {
    console.warn('Fallback a plantilla estática para ActivationEmail:', err.message);
    const { nombre = 'Cliente', apellidos = '', email = '', password = '', activationLink = 'http://localhost:5173/login' } = props;
    const fullName = `${nombre} ${apellidos}`.trim() || 'Estimado(a) Cliente';
    return wrapEmailContainer(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="display:inline-block;background-color:${colors.emeraldLight};border:1px solid ${colors.emeraldBorder};color:${colors.emeraldText};padding:5px 14px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;">Registro Exitoso</span>
        <h2 style="color:${colors.textTitle};font-size:22px;font-weight:800;margin:14px 0 8px;">¡Bienvenido a Chazin Food, ${fullName}!</h2>
        <p style="color:${colors.textBody};font-size:14.5px;line-height:1.6;margin:0;">Tu cuenta ha sido creada exitosamente. Ya puedes ingresar y disfrutar de nuestras preparaciones artesanales.</p>
      </div>
      <div style="background-color:${colors.cardSubtle};border:1px solid ${colors.borderLight};border-radius:12px;padding:18px 20px;margin-bottom:24px;">
        <div style="color:${colors.textTitle};font-size:11.5px;font-weight:700;text-transform:uppercase;margin-bottom:10px;">Credenciales de Ingreso</div>
        <div style="margin-bottom:6px;"><span style="color:${colors.textMuted};font-size:13px;">Usuario / Correo:</span> <strong style="color:${colors.textTitle};font-size:13.5px;margin-left:4px;">${email}</strong></div>
        ${password ? `<div><span style="color:${colors.textMuted};font-size:13px;">Clave de acceso:</span> <code style="background:${colors.crimsonLight};color:${colors.crimson};border:1px solid ${colors.crimsonBorder};padding:4px 10px;border-radius:6px;font-size:13.5px;font-weight:700;margin-left:4px;">${password}</code></div>` : ''}
      </div>
      <div style="text-align:center;margin:24px 0 28px;">
        <a href="${activationLink}" style="background:${colors.flameGradient};color:#FFFFFF;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 6px 18px -2px rgba(220, 38, 38, 0.35);">Activar Cuenta e Iniciar Sesión</a>
      </div>
    `, 'Activación de Cuenta de Cliente');
  }
}

/**
 * 2. Correo de Bienvenida a Usuarios
 */
async function renderWelcomeEmail(props) {
  try {
    return await render(e(WelcomeEmail, props));
  } catch (err) {
    console.warn('Fallback a plantilla estática para WelcomeEmail:', err.message);
    const { nombre = 'Usuario', apellidos = '', email = '', password = '', loginLink = 'http://localhost:5173/login' } = props;
    const fullName = `${nombre} ${apellidos}`.trim() || 'Estimado(a) Colaborador(a)';
    return wrapEmailContainer(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="display:inline-block;background-color:${colors.emeraldLight};border:1px solid ${colors.emeraldBorder};color:${colors.emeraldText};padding:5px 14px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;">Acceso Habilitado</span>
        <h2 style="color:${colors.textTitle};font-size:22px;font-weight:800;margin:14px 0 8px;">¡Te damos la bienvenida, ${fullName}!</h2>
        <p style="color:${colors.textBody};font-size:14.5px;line-height:1.6;margin:0;">Tu cuenta en la plataforma de Chazin Food ha sido configurada exitosamente.</p>
      </div>
      <div style="background-color:${colors.cardSubtle};border:1px solid ${colors.borderLight};border-radius:12px;padding:18px 20px;margin-bottom:24px;">
        <div style="color:${colors.textTitle};font-size:11.5px;font-weight:700;text-transform:uppercase;margin-bottom:10px;">Datos de Acceso</div>
        <div style="margin-bottom:6px;"><span style="color:${colors.textMuted};font-size:13px;">Correo Registrado:</span> <strong style="color:${colors.textTitle};font-size:13.5px;margin-left:4px;">${email}</strong></div>
        ${password ? `<div><span style="color:${colors.textMuted};font-size:13px;">Contraseña:</span> <code style="background:${colors.crimsonLight};color:${colors.crimson};border:1px solid ${colors.crimsonBorder};padding:4px 10px;border-radius:6px;font-size:13.5px;font-weight:700;margin-left:4px;">${password}</code></div>` : ''}
      </div>
      <div style="text-align:center;margin:24px 0 28px;">
        <a href="${loginLink}" style="background:${colors.flameGradient};color:#FFFFFF;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 6px 18px -2px rgba(220, 38, 38, 0.35);">Ingresar al Portal Chazin Food</a>
      </div>
    `, 'Bienvenida y Acceso al Sistema');
  }
}

/**
 * 3. Correo de Restablecimiento de Contraseña
 */
async function renderPasswordResetEmail(props) {
  try {
    return await render(e(PasswordResetEmail, props));
  } catch (err) {
    console.warn('Fallback a plantilla estática para PasswordResetEmail:', err.message);
    const { nombre = 'Usuario', apellidos = '', resetLink = 'http://localhost:5173/reset-password' } = props;
    const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
    return wrapEmailContainer(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="display:inline-block;background-color:${colors.crimsonLight};border:1px solid ${colors.crimsonBorder};color:${colors.crimson};padding:5px 14px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;">Seguridad de la Cuenta</span>
        <h2 style="color:${colors.textTitle};font-size:22px;font-weight:800;margin:14px 0 8px;">Restablece tu contraseña, ${fullName}</h2>
        <p style="color:${colors.textBody};font-size:14.5px;line-height:1.6;margin:0 0 16px;">Recibimos una solicitud para cambiar tu contraseña. Haz clic en el siguiente botón:</p>
      </div>
      <div style="text-align:center;margin:22px 0 28px;">
        <a href="${resetLink}" style="background:${colors.flameGradient};color:#FFFFFF;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 6px 18px -2px rgba(220, 38, 38, 0.35);">Restablecer Mi Contraseña</a>
      </div>
      <div style="background-color:${colors.briocheAmberLight};border:1px solid ${colors.briocheAmberBorder};border-radius:10px;padding:12px 14px;text-align:center;">
        <p style="color:${colors.amberText};font-size:12px;line-height:1.5;margin:0;">Este enlace es válido durante 60 minutos por motivos de seguridad.</p>
      </div>
    `, 'Seguridad y Protección de Cuenta');
  }
}

/**
 * 4. Correo de Contraseña Modificada
 */
async function renderPasswordChangedEmail(props) {
  try {
    return await render(e(PasswordChangedEmail, props));
  } catch (err) {
    console.warn('Fallback a plantilla estática para PasswordChangedEmail:', err.message);
    const { nombre = 'Usuario', apellidos = '', supportLink = 'http://localhost:5173' } = props;
    const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
    return wrapEmailContainer(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="display:inline-block;background-color:${colors.emeraldLight};border:1px solid ${colors.emeraldBorder};color:${colors.emeraldText};padding:5px 14px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;">Cambio Confirmado</span>
        <h2 style="color:${colors.textTitle};font-size:22px;font-weight:800;margin:14px 0 8px;">Hola, ${fullName}</h2>
        <p style="color:${colors.textBody};font-size:14.5px;line-height:1.6;margin:0;">Te confirmamos que la contraseña asociada a tu cuenta ha sido modificada con éxito.</p>
      </div>
      <div style="text-align:center;margin:22px 0 26px;">
        <a href="${supportLink}/login" style="background:${colors.flameGradient};color:#FFFFFF;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 6px 18px -2px rgba(220, 38, 38, 0.35);">Ir al Portal Chazin Food</a>
      </div>
    `, 'Seguridad y Notificaciones');
  }
}

/**
 * 5. Correo de Actualización de Usuario
 */
async function renderUserUpdatedEmail(props) {
  try {
    return await render(e(UserUpdatedEmail, props));
  } catch (err) {
    console.warn('Fallback a plantilla estática para UserUpdatedEmail:', err.message);
    const { nombre = 'Usuario', apellidos = '', modifiedFields = 'Perfil actualizado', portalLink = 'http://localhost:5173/perfil' } = props;
    const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
    return wrapEmailContainer(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="display:inline-block;background-color:${colors.emeraldLight};border:1px solid ${colors.emeraldBorder};color:${colors.emeraldText};padding:5px 14px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;">Perfil Actualizado</span>
        <h2 style="color:${colors.textTitle};font-size:22px;font-weight:800;margin:14px 0 8px;">Datos actualizados, ${fullName}</h2>
        <p style="color:${colors.textBody};font-size:14.5px;line-height:1.6;margin:0;">Se ha actualizado correctamente la información de tu perfil en Chazin Food: <strong>${modifiedFields}</strong>.</p>
      </div>
      <div style="text-align:center;margin:22px 0 26px;">
        <a href="${portalLink}" style="background:${colors.flameGradient};color:#FFFFFF;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 6px 18px -2px rgba(220, 38, 38, 0.35);">Ver Mi Perfil</a>
      </div>
    `, 'Actualización de Perfil');
  }
}

module.exports = {
  renderActivationEmail,
  renderWelcomeEmail,
  renderPasswordResetEmail,
  renderPasswordChangedEmail,
  renderUserUpdatedEmail
};
