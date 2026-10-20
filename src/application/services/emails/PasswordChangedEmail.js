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
  supportLink = 'http://localhost:5173'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
  const changeDate = new Date().toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `🔐 Tu contraseña de Chazin Food fue modificada`),
    e(
      Body,
      {
        style: {
          backgroundColor: '#F1F5F9',
          fontFamily: typography.fontFamily,
          margin: 0,
          padding: '24px 12px'
        }
      },
      e(
        Container,
        {
          style: {
            backgroundColor: colors.white,
            borderRadius: '20px',
            maxWidth: '580px',
            margin: '0 auto',
            border: `1px solid ${colors.slate200}`,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
          }
        },
        e(EmailHeader, { subtitle: 'Alerta de Seguridad' }),
        e(
          Section,
          { style: { padding: '36px 32px 28px' } },
          e(
            'div',
            {
              style: {
                display: 'inline-block',
                backgroundColor: colors.indigo50,
                border: `1px solid ${colors.indigo200}`,
                borderRadius: '9999px',
                padding: '6px 16px',
                marginBottom: '16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.indigo600,
                  fontSize: '12px',
                  fontWeight: '700',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }
              },
              '🔐 Actualización de Credencial'
            )
          ),
          e(
            Heading,
            {
              as: 'h2',
              style: {
                color: colors.slate900,
                fontSize: '22px',
                fontWeight: '800',
                lineHeight: '1.3',
                margin: '0 0 16px 0'
              }
            },
            `Hola, ${fullName}`
          ),
          e(
            Text,
            {
              style: {
                color: colors.slate600,
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '0 0 20px 0'
              }
            },
            'Te notificamos que la contraseña de tu cuenta en ',
            e('strong', { style: { color: colors.slate900 } }, 'Chazin Food'),
            ` ha sido modificada exitosamente el `,
            e('strong', null, changeDate),
            '.'
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.slate50,
                border: `1px solid ${colors.slate200}`,
                borderRadius: '16px',
                padding: '18px 20px',
                marginBottom: '24px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.slate800,
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0
                }
              },
              'Si fuiste tú quien realizó esta acción, no es necesario hacer nada más. Tu nueva contraseña ya se encuentra activa para iniciar sesión.'
            )
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.primaryLight,
                border: `1px solid ${colors.primaryBorder}`,
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '24px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.primaryDark,
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0
                }
              },
              '🚨 ',
              e('strong', null, '¿No fuiste tú?'),
              e('br'),
              'Si no autorizaste esta modificación, te recomendamos restablecer tu contraseña inmediatamente o comunicarte con el administrador de Chazin Food para proteger tu cuenta.'
            )
          ),
          e(
            Section,
            { style: { textAlign: 'center', margin: '20px 0 10px' } },
            e(
              Button,
              {
                href: supportLink,
                style: {
                  backgroundColor: colors.slate900,
                  color: colors.white,
                  padding: '13px 30px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }
              },
              'Ir al Sitio de Chazin Food ➔'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordChangedEmail;
