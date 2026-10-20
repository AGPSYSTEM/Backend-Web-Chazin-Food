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
  Button,
  Link
} = require('@react-email/components');
const EmailHeader = require('./EmailHeader');
const EmailFooter = require('./EmailFooter');
const { colors, typography } = require('./EmailStyles');

const e = React.createElement;

function PasswordResetEmail({
  nombre = 'Usuario',
  apellidos = '',
  resetLink = 'http://localhost:5173/login'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `🔐 Restablecimiento de contraseña de Chazin Food`),
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
        e(EmailHeader, { subtitle: 'Seguridad y Protección de Cuenta' }),
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
              '🛡️ Solicitud de Seguridad'
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
                margin: '0 0 24px 0'
              }
            },
            'Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta en ',
            e('strong', { style: { color: colors.slate900 } }, 'Chazin Food'),
            '. Haz clic en el botón de abajo para definir una nueva contraseña de forma segura:'
          ),
          e(
            Section,
            { style: { textAlign: 'center', margin: '24px 0 28px' } },
            e(
              Button,
              {
                href: resetLink,
                style: {
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '15px 36px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }
              },
              'Restablecer Mi Contraseña ➔'
            )
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.amber50,
                border: `1px solid ${colors.amber200}`,
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '24px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.amber600,
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0
                }
              },
              '⏱️ ',
              e('strong', null, 'Información importante:'),
              e('br'),
              '• Este enlace es de un solo uso y expirará en ',
              e('strong', null, '1 hora'),
              ' por motivos de seguridad.',
              e('br'),
              '• Si no solicitaste este cambio, puedes ignorar este mensaje de manera segura; tu cuenta no se verá afectada.'
            )
          ),
          e(
            Text,
            {
              style: {
                color: colors.slate400,
                fontSize: '12px',
                lineHeight: '1.5',
                margin: '0',
                wordBreak: 'break-all'
              }
            },
            'Si el botón no funciona, copia y pega el siguiente enlace directamente en tu navegador:',
            e('br'),
            e(
              Link,
              {
                href: resetLink,
                style: { color: colors.primary, textDecoration: 'underline' }
              },
              resetLink
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordResetEmail;
