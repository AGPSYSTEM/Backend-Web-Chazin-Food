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
const { colors, commonStyles } = require('./EmailStyles');

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
    e(Preview, null, `Instrucciones para restablecer tu contraseña en Chazin Food`),
    e(
      Body,
      { style: commonStyles.body },
      e(
        Container,
        { style: commonStyles.container },
        e(EmailHeader, { subtitle: 'Seguridad y Protección de Cuenta' }),
        e(
          Section,
          { style: commonStyles.contentSection },
          // Badge de seguridad
          e(
            'div',
            { style: { textAlign: 'center', marginBottom: '18px' } },
            e(
              'span',
              {
                style: {
                  ...commonStyles.badge,
                  backgroundColor: colors.crimsonLight,
                  border: `1px solid ${colors.crimsonBorder}`,
                  color: colors.crimson
                }
              },
              'Seguridad de la Cuenta'
            )
          ),
          // Heading
          e(
            Heading,
            {
              as: 'h2',
              style: {
                color: colors.textTitle,
                fontSize: '22px',
                fontWeight: '800',
                lineHeight: '1.3',
                margin: '0 0 12px 0',
                textAlign: 'center'
              }
            },
            `Restablece tu contraseña, ${fullName}`
          ),
          e(
            Text,
            {
              style: {
                color: colors.textBody,
                fontSize: '14.5px',
                lineHeight: '1.6',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }
            },
            'Recibimos una solicitud para cambiar la contraseña asociada a tu cuenta. Para establecer tu nueva clave de acceso seguro, pulsa el botón:'
          ),
          // Aviso de expiración de 60 minutos
          e(
            'div',
            { style: { textAlign: 'center', marginBottom: '24px' } },
            e(
              'span',
              {
                style: {
                  display: 'inline-block',
                  backgroundColor: colors.briocheAmberLight,
                  border: `1px solid ${colors.briocheAmberBorder}`,
                  color: colors.amberText,
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '5px 14px',
                  borderRadius: '6px'
                }
              },
              'Este enlace es válido durante 60 minutos'
            )
          ),
          // Botón Principal CTA
          e(
            Section,
            { style: { textAlign: 'center', margin: '20px 0 28px' } },
            e(
              Button,
              {
                href: resetLink,
                style: commonStyles.ctaButton
              },
              'Restablecer Mi Contraseña'
            )
          ),
          // Fallback de URL directa
          e(
            Section,
            {
              style: {
                backgroundColor: colors.cardSubtle,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '22px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.textMuted,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: '0 0 6px 0'
                }
              },
              '¿El botón no responde? Copia y abre este enlace directamente en tu navegador:'
            ),
            e(
              'div',
              {
                style: {
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: '6px',
                  padding: '8px 10px',
                  wordBreak: 'break-all'
                }
              },
              e(
                Link,
                {
                  href: resetLink,
                  style: {
                    color: colors.crimson,
                    fontSize: '11px',
                    fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace',
                    textDecoration: 'none'
                  }
                },
                resetLink
              )
            )
          ),
          // Reaseguro si el usuario no hizo la solicitud
          e(
            Section,
            {
              style: {
                backgroundColor: colors.emeraldLight,
                border: `1px solid ${colors.emeraldBorder}`,
                borderRadius: '10px',
                padding: '12px 14px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.emeraldText,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              e('strong', null, '¿No reconoces esta solicitud? '),
              'Puedes descartar este mensaje. Tu contraseña actual permanecerá intacta y nadie podrá acceder a tu cuenta.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordResetEmail;
