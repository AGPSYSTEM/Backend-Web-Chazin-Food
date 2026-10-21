/**
 * Chazin Food - Servicio de Renderizado de Correos Transaccionales
 * Genera plantillas HTML modernas, responsive y seguras para clientes y usuarios.
 * Diseñado para operar de forma autónoma sin depender de frameworks de UI en el backend.
 */

const { colors, typography, LOGO_OFFICIAL_URL } = require('./EmailStyles');

function getEmailHeader(subtitle = 'Comidas Rápidas Artesanales') {
  return `
    <div style="height:6px;background:linear-gradient(90deg, #FF4B2B 0%, #E11D48 35%, #F59E0B 75%, #FF5A1F 100%);border-top-left-radius:20px;border-top-right-radius:20px;"></div>
    <div style="background-color:${colors.obsidian};padding:36px 24px 30px;text-align:center;border-bottom:1px solid ${colors.navy800};">
      <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;text-align:center;">
        <tbody>
          <tr>
            <td align="center">
              <img src="${LOGO_OFFICIAL_URL}" alt="Chazin Food" width="88" height="88" style="border-radius:50%;border:3px solid #FFFFFF;box-shadow:0 8px 24px rgba(225, 29, 72, 0.45);display:block;margin:0 auto;background-color:#FFFFFF;object-fit:cover;" />
            </td>
          </tr>
        </tbody>
      </table>
      <h1 style="color:${colors.white};font-size:24px;font-weight:900;letter-spacing:2px;margin:14px 0 4px 0;text-transform:uppercase;">Chazin Food</h1>
      <div style="margin-top:6px;">
        <span style="display:inline-block;background-color:rgba(255, 255, 255, 0.08);border:1px solid rgba(255, 255, 255, 0.18);border-radius:9999px;padding:4px 14px;color:#FDA4AF;font-size:10.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
          🔥 Sabor Artesanal Gourmet 🔥
        </span>
      </div>
      ${subtitle ? `<p style="color:${colors.textLight};font-size:12.5px;font-weight:500;letter-spacing:0.4px;margin:10px 0 0 0;">${subtitle}</p>` : ''}
    </div>
  `;
}

function getEmailFooter() {
  const currentYear = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
    <div style="background-color:#F8FAFC;padding:28px 24px 30px;text-align:center;border-bottom-left-radius:20px;border-bottom-right-radius:20px;border-top:1px solid ${colors.borderLight};">
      <div style="font-size:18px;letter-spacing:6px;margin-bottom:8px;">🍔 🍟 🌭 🥤</div>
      <p style="color:${colors.navy900};font-size:13.5px;font-weight:800;letter-spacing:0.3px;margin:0 0 4px 0;">Chazin Food | Comidas Rápidas Artesanales</p>
      <p style="color:${colors.textMuted};font-size:12px;line-height:1.6;margin:0 0 16px 0;max-width:440px;margin-left:auto;margin-right:auto;">
        El auténtico sabor artesanal con ingredientes seleccionados, pan brioche recién horneado y carnes 100% de calidad.
      </p>
      <div style="margin:14px 0;">
        <a href="${frontendUrl}" style="background-color:#FFFFFF;border:1px solid ${colors.borderLight};border-radius:8px;color:${colors.primary};font-size:11.5px;font-weight:700;text-decoration:none;padding:7px 14px;margin:0 4px;display:inline-block;box-shadow:0 1px 3px rgba(0,0,0,0.04);">🌐 Menú Digital</a>
        <a href="${frontendUrl}/login" style="background-color:#FFFFFF;border:1px solid ${colors.borderLight};border-radius:8px;color:${colors.primary};font-size:11.5px;font-weight:700;text-decoration:none;padding:7px 14px;margin:0 4px;display:inline-block;box-shadow:0 1px 3px rgba(0,0,0,0.04);">🔑 Iniciar Sesión</a>
      </div>
      <hr style="border:0;border-top:1px solid ${colors.borderLight};margin:18px 0 14px 0;" />
      <p style="color:${colors.textLight};font-size:11px;line-height:1.6;margin:0;">
        📍 Cl. 21 #80-21, Belén, Medellín, Colombia • Pedidos Online y Presencial<br />
        © ${currentYear} Chazin Food. Todos los derechos reservados.<br />
        Este es un mensaje seguro generado automáticamente por el sistema de Chazin Food. Por favor no respondas a este correo.
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
<body style="background-color:#F1F5F9;font-family:${typography.fontFamily};margin:0;padding:28px 12px;-webkit-font-smoothing:antialiased;">
  <div style="background-color:${colors.cardBg};border-radius:20px;max-width:600px;margin:0 auto;border:1px solid ${colors.borderLight};box-shadow:0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.04);overflow:hidden;">
    ${getEmailHeader(subtitle)}
    <div style="padding:36px 32px 30px;">
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
async function renderActivationEmail({
  nombre = 'Cliente',
  apellidos = '',
  email = '',
  password = '',
  activationLink = 'http://localhost:5173/login'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Estimado(a) Cliente';

  const bodyContent = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background-color:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">
        🎉 ¡Bienvenido a la Experiencia Chazin Food!
      </span>
      <h2 style="color:${colors.navy900};font-size:22px;font-weight:800;margin:16px 0 8px;">
        Hola, ${fullName}
      </h2>
      <p style="color:${colors.textBody};font-size:14px;line-height:1.6;margin:0;">
        Tu cuenta de cliente ha sido registrada exitosamente. Para disfrutar de promociones exclusivas, descuentos por fidelidad y seguimiento de tus pedidos en tiempo real, activa tu acceso ahora.
      </p>
    </div>

    <div style="background-color:#F8FAFC;border:1px solid ${colors.borderLight};border-radius:14px;padding:20px;margin-bottom:28px;">
      <p style="color:${colors.navy800};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
        Tus Credenciales de Acceso
      </p>
      <div style="margin-bottom:8px;">
        <span style="color:${colors.textMuted};font-size:13px;">Usuario / Correo:</span>
        <strong style="color:${colors.navy900};font-size:13px;display:block;margin-top:2px;">${email}</strong>
      </div>
      ${password ? `
      <div>
        <span style="color:${colors.textMuted};font-size:13px;">Contraseña Temporal:</span>
        <div style="background-color:#FFFFFF;border:1px dashed ${colors.borderLight};border-radius:8px;padding:8px 12px;margin-top:4px;display:inline-block;">
          <code style="color:${colors.primary};font-size:15px;font-weight:bold;letter-spacing:1px;">${password}</code>
        </div>
      </div>
      ` : ''}
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${activationLink}" style="background:${colors.primaryGradient};color:#FFFFFF;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:bold;text-decoration:none;display:inline-block;box-shadow:0 8px 18px rgba(225, 29, 72, 0.35);">
        🚀 Activar Cuenta e Iniciar Sesión
      </a>
    </div>

    <p style="color:${colors.textMuted};font-size:12px;line-height:1.5;text-align:center;margin:0;">
      Te recomendamos cambiar tu contraseña temporal después de ingresar a tu cuenta desde tu perfil.
    </p>
  `;

  return wrapEmailContainer(bodyContent, 'Activación de Cuenta de Cliente');
}

/**
 * 2. Correo de Bienvenida a Usuarios
 */
async function renderWelcomeEmail({
  nombre = 'Usuario',
  apellidos = '',
  email = '',
  password = '',
  loginLink = 'http://localhost:5173/login'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';

  const bodyContent = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background-color:#ECFDF5;border:1px solid #A7F3D0;color:#047857;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">
        ✨ Bienvenido al Equipo Chazin Food
      </span>
      <h2 style="color:${colors.navy900};font-size:22px;font-weight:800;margin:16px 0 8px;">
        Hola, ${fullName}
      </h2>
      <p style="color:${colors.textBody};font-size:14px;line-height:1.6;margin:0;">
        Tu cuenta en la plataforma administrativa de Chazin Food ha sido configurada. Ya puedes ingresar y acceder a los módulos correspondientes a tu rol.
      </p>
    </div>

    <div style="background-color:#F8FAFC;border:1px solid ${colors.borderLight};border-radius:14px;padding:20px;margin-bottom:28px;">
      <p style="color:${colors.navy800};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
        Datos de Tu Cuenta
      </p>
      <div style="margin-bottom:8px;">
        <span style="color:${colors.textMuted};font-size:13px;">Correo Registrado:</span>
        <strong style="color:${colors.navy900};font-size:13px;display:block;margin-top:2px;">${email}</strong>
      </div>
      ${password ? `
      <div>
        <span style="color:${colors.textMuted};font-size:13px;">Contraseña de Acceso:</span>
        <div style="background-color:#FFFFFF;border:1px dashed ${colors.borderLight};border-radius:8px;padding:8px 12px;margin-top:4px;display:inline-block;">
          <code style="color:${colors.primary};font-size:15px;font-weight:bold;letter-spacing:1px;">${password}</code>
        </div>
      </div>
      ` : ''}
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${loginLink}" style="background:${colors.primaryGradient};color:#FFFFFF;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:bold;text-decoration:none;display:inline-block;box-shadow:0 8px 18px rgba(225, 29, 72, 0.35);">
        Ingresar al Sistema
      </a>
    </div>
  `;

  return wrapEmailContainer(bodyContent, 'Bienvenida y Acceso al Sistema');
}

/**
 * 3. Correo de Restablecimiento de Contraseña
 */
async function renderPasswordResetEmail({
  nombre = 'Usuario',
  apellidos = '',
  resetLink = 'http://localhost:5173/reset-password'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';

  const bodyContent = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background-color:#FEF3C7;border:1px solid #FDE68A;color:#B45309;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">
        🔐 Solicitud de Recuperación
      </span>
      <h2 style="color:${colors.navy900};font-size:22px;font-weight:800;margin:16px 0 8px;">
        Hola, ${fullName}
      </h2>
      <p style="color:${colors.textBody};font-size:14px;line-height:1.6;margin:0;">
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Chazin Food. Haz clic en el botón a continuación para crear una nueva clave de acceso seguro.
      </p>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}" style="background:${colors.primaryGradient};color:#FFFFFF;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:bold;text-decoration:none;display:inline-block;box-shadow:0 8px 18px rgba(225, 29, 72, 0.35);">
        Restablecer Mi Contraseña
      </a>
    </div>

    <div style="background-color:#F8FAFC;border:1px solid ${colors.borderLight};border-radius:12px;padding:14px;text-align:center;">
      <p style="color:${colors.textMuted};font-size:12px;line-height:1.5;margin:0;">
        ⏱️ Este enlace es personal e intransferible y expira en <strong>1 hora</strong> por motivos de seguridad.<br />
        Si tú no realizaste esta solicitud, puedes ignorar este mensaje; tu contraseña actual se mantendrá a salvo.
      </p>
    </div>
  `;

  return wrapEmailContainer(bodyContent, 'Seguridad y Protección de Cuenta');
}

/**
 * 4. Correo de Contraseña Modificada
 */
async function renderPasswordChangedEmail({
  nombre = 'Usuario',
  apellidos = '',
  nuevaContrasena = '',
  password = '',
  supportLink = 'http://localhost:5173'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
  const finalPass = nuevaContrasena || password || '';

  const bodyContent = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background-color:#ECFDF5;border:1px solid #A7F3D0;color:#047857;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">
        ✅ Actualización Confirmada
      </span>
      <h2 style="color:${colors.navy900};font-size:22px;font-weight:800;margin:16px 0 8px;">
        Hola, ${fullName}
      </h2>
      <p style="color:${colors.textBody};font-size:14px;line-height:1.6;margin:0;">
        Te notificamos que la contraseña de tu cuenta en Chazin Food ha sido modificada exitosamente.
      </p>
    </div>

    ${finalPass ? `
    <div style="background-color:#F8FAFC;border:1px solid ${colors.borderLight};border-radius:14px;padding:18px;margin-bottom:24px;text-align:center;">
      <span style="color:${colors.textMuted};font-size:13px;display:block;margin-bottom:6px;">Tu Nueva Contraseña Asignada:</span>
      <code style="color:${colors.primary};font-size:16px;font-weight:bold;letter-spacing:1px;background:#FFF;border:1px dashed ${colors.borderLight};padding:8px 16px;border-radius:8px;display:inline-block;">${finalPass}</code>
    </div>
    ` : ''}

    <div style="text-align:center;margin-bottom:20px;">
      <a href="${supportLink}/login" style="background:${colors.primaryGradient};color:#FFFFFF;padding:12px 26px;border-radius:12px;font-size:13.5px;font-weight:bold;text-decoration:none;display:inline-block;">
        Ir a Iniciar Sesión
      </a>
    </div>

    <p style="color:${colors.textLight};font-size:11.5px;line-height:1.5;text-align:center;margin:0;">
      Si no reconoces este cambio, comunícate de inmediato con la administración del restaurante.
    </p>
  `;

  return wrapEmailContainer(bodyContent, 'Notificación de Seguridad');
}

/**
 * 5. Correo de Actualización de Usuario
 */
async function renderUserUpdatedEmail({
  nombre = 'Usuario',
  apellidos = '',
  email = '',
  rol = '',
  estado = '',
  cambios = []
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';

  const bodyContent = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background-color:#EEF2FF;border:1px solid #C7D2FE;color:#4338CA;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;">
        ℹ️ Actualización de Datos de Perfil
      </span>
      <h2 style="color:${colors.navy900};font-size:22px;font-weight:800;margin:16px 0 8px;">
        Hola, ${fullName}
      </h2>
      <p style="color:${colors.textBody};font-size:14px;line-height:1.6;margin:0;">
        La información de tu perfil o rol en el sistema de Chazin Food ha sido actualizada recientemente.
      </p>
    </div>

    <div style="background-color:#F8FAFC;border:1px solid ${colors.borderLight};border-radius:14px;padding:20px;margin-bottom:20px;">
      <p style="color:${colors.navy800};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
        Resumen de Tu Perfil
      </p>
      <div style="margin-bottom:6px;"><span style="color:${colors.textMuted};font-size:13px;">Correo:</span> <strong style="color:${colors.navy900};font-size:13px;">${email}</strong></div>
      ${rol ? `<div style="margin-bottom:6px;"><span style="color:${colors.textMuted};font-size:13px;">Rol Asignado:</span> <strong style="color:${colors.navy900};font-size:13px;">${rol}</strong></div>` : ''}
      ${estado ? `<div><span style="color:${colors.textMuted};font-size:13px;">Estado:</span> <strong style="color:${colors.emerald600};font-size:13px;">${estado}</strong></div>` : ''}
    </div>
  `;

  return wrapEmailContainer(bodyContent, 'Actualización de Perfil');
}

module.exports = {
  renderActivationEmail,
  renderWelcomeEmail,
  renderPasswordResetEmail,
  renderPasswordChangedEmail,
  renderUserUpdatedEmail
};
