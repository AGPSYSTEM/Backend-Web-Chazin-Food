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
    e(Preview, null, `🔐 Restablecimiento de contraseña de Chazin Food - Enlace seguro`),
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
        e(EmailHeader, { subtitle: 'Seguridad y Protección de Cuenta' }),
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
                  backgroundColor: colors.indigo50,
                  border: `1px solid ${colors.indigo200}`,
                  borderRadius: '9999px',
                  padding: '6px 18px',
                  color: colors.indigo600,
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }
              },
              '🛡️ Solicitud de Restablecimiento 🛡️'
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
                margin: '0 0 20px 0',
                textAlign: 'center'
              }
            },
            'Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta en Chazin Food. Para crear tu nueva contraseña de forma segura, haz clic en el siguiente botón:'
          ),
          // Expiration Pill
          e(
            'div',
            { style: { textAlign: 'center', marginBottom: '24px' } },
            e(
              'span',
              {
                style: {
                  display: 'inline-block',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 16px',
                  borderRadius: '10px'
                }
              },
              '⏳ Este enlace de un solo uso expira en 60 minutos'
            )
          ),
          // Big CTA Button
          e(
            Section,
            { style: { textAlign: 'center', margin: '24px 0 28px' } },
            e(
              Button,
              {
                href: resetLink,
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
              'Restablecer Mi Contraseña ➔'
            )
          ),
          // Enlace directo en caso de fallo del botón
          e(
            Section,
            {
              style: {
                backgroundColor: '#F8FAFC',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '14px',
                padding: '16px 18px',
                marginBottom: '24px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.textMuted,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: '0 0 8px 0'
                }
              },
              'Si el botón no funciona en tu visor de correo, copia y pega este enlace directo en tu navegador web:'
            ),
            e(
              'div',
              {
                style: {
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: '8px',
                  padding: '10px 12px',
                  wordBreak: 'break-all'
                }
              },
              e(
                Link,
                {
                  href: resetLink,
                  style: {
                    color: colors.primary,
                    fontSize: '11.5px',
                    fontFamily: 'Consolas, Monaco, monospace',
                    textDecoration: 'underline'
                  }
                },
                resetLink
              )
            )
          ),
          // Aviso de seguridad
          e(
            Section,
            {
              style: {
                backgroundColor: colors.emerald50,
                border: `1px solid ${colors.emerald200}`,
                borderRadius: '12px',
                padding: '12px 16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.emerald600,
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              '🔒 ',
              e('strong', null, '¿No solicitaste este cambio?'),
              ' Puedes ignorar este correo con total tranquilidad. Tu contraseña actual no sufrirá ningún cambio y tu cuenta continuará completamente segura.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordResetEmail;
