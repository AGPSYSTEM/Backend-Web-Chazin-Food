const React = require('react');
const {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button
} = require('@react-email/components');
const EmailHeader = require('./EmailHeader');
const EmailFooter = require('./EmailFooter');
const { colors, typography } = require('./EmailStyles');

const e = React.createElement;

function PasswordChangedEmail({
  nombre = 'Usuario',
  apellidos = '',
  nuevaContrasena = '',
  password = '',
  supportLink = 'http://localhost:5173'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
  const changeDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `🔐 Tu contraseña de Chazin Food fue modificada exitosamente`),
    e(
      Body,
      {
        style: {
          backgroundColor: '#F1F5F9',
          fontFamily: typography.fontFamily,
          margin: 0,
          padding: '28px 12px'
        }
      },
      e(
        Container,
        {
          style: {
            backgroundColor: colors.cardBg,
            borderRadius: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            border: `1px solid ${colors.borderLight}`,
            boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }
        },
        e(EmailHeader, { subtitle: 'Alerta de Seguridad' }),
        e(
          Section,
          { style: { padding: '36px 32px 30px' } },
          // Badge
          e(
            'div',
            { style: { textAlign: 'center', marginBottom: '20px' } },
            e(
              'span',
              {
                style: {
                  display: 'inline-block',
                  backgroundColor: colors.emerald50,
                  border: `1px solid ${colors.emerald200}`,
                  borderRadius: '9999px',
                  padding: '6px 18px',
                  color: colors.emerald600,
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }
              },
              '🛡️ Cambio de Contraseña Confirmado 🛡️'
            )
          ),
          // Heading
          e(
            Heading,
            {
              as: 'h2',
              style: {
                color: colors.navy900,
                fontSize: '23px',
                fontWeight: '900',
                lineHeight: '1.35',
                margin: '0 0 14px 0',
                textAlign: 'center'
              }
            },
            `Hola, ${fullName}`
          ),
          e(
            Text,
            {
              style: {
                color: colors.textBody,
                fontSize: '14.5px',
                lineHeight: '1.65',
                margin: '0 0 24px 0',
                textAlign: 'center'
              }
            },
            'Te informamos que la contraseña asociada a tu cuenta de Chazin Food ha sido modificada con éxito. Ya puedes utilizar tu nueva clave para acceder a todas las funciones de la plataforma.'
          ),
          // Audit Log Card
          e(
            Section,
            {
              style: {
                backgroundColor: '#F8FAFC',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '26px'
              }
            },
            e(
              'div',
              {
                style: {
                  borderBottom: `1px solid ${colors.borderLight}`,
                  paddingBottom: '10px',
                  marginBottom: '12px',
                  color: colors.navy900,
                  fontSize: '12px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px'
                }
              },
              '📋 Registro de Auditoría de Seguridad'
            ),
            e(
              'table',
              { border: '0', cellPadding: '0', cellSpacing: '0', style: { width: '100%' } },
              e(
                'tbody',
                null,
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', width: '130px', fontWeight: '600' } }, 'Fecha y Hora:'),
                  e('td', { style: { padding: '6px 0', color: colors.navy900, fontSize: '13px', fontWeight: '700' } }, changeDate)
                ),
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600' } }, 'Estado de Clave:'),
                  e('td', { style: { padding: '6px 0', color: colors.emerald600, fontSize: '13px', fontWeight: '700' } }, '✅ Actualizada y Protegida')
                ),
                (nuevaContrasena || password)
                  ? e(
                      'tr',
                      null,
                      e('td', { style: { padding: '8px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600', width: '130px' } }, 'Nueva Contraseña:'),
                      e(
                        'td',
                        { style: { padding: '8px 0' } },
                        e(
                          'code',
                          {
                            style: {
                              backgroundColor: colors.primaryLight,
                              color: colors.primary,
                              border: `1px dashed ${colors.primaryBorder}`,
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '13.5px',
                              fontWeight: '800',
                              fontFamily: 'Consolas, Monaco, monospace',
                              letterSpacing: '0.8px'
                            }
                          },
                          nuevaContrasena || password
                        )
                      )
                    )
                  : null,
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600' } }, 'Plataforma:'),
                  e('td', { style: { padding: '6px 0', color: colors.navy900, fontSize: '13px', fontWeight: '700' } }, 'Chazin Food Web (HTTPS)')
                )
              )
            )
          ),
          // Big CTA Button
          e(
            Section,
            { style: { textAlign: 'center', margin: '24px 0 28px' } },
            e(
              Button,
              {
                href: supportLink,
                style: {
                  background: 'linear-gradient(135deg, #FF4B2B 0%, #E11D48 60%, #9F1239 100%)',
                  color: colors.white,
                  padding: '16px 40px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 10px 24px -4px rgba(225, 29, 72, 0.45)',
                  letterSpacing: '0.5px'
                }
              },
              'Ir al Portal Chazin Food ➔'
            )
          ),
          // Alerta crítica de seguridad
          e(
            Section,
            {
              style: {
                backgroundColor: colors.primaryLight,
                border: `1px solid ${colors.primaryBorder}`,
                borderRadius: '12px',
                padding: '14px 16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.primaryDark,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              '⚠️ ',
              e('strong', null, '¿No reconoces esta actividad?'),
              ' Si no fuiste tú quien realizó este cambio, comunícate con nosotros inmediatamente para congelar temporalmente tu cuenta y restaurar tu acceso seguro.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordChangedEmail;
