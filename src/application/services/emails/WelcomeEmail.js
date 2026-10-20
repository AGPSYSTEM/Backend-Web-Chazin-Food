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

function WelcomeEmail({
  nombre = 'Usuario',
  apellidos = '',
  email = '',
  password = '',
  loginLink = 'http://localhost:5173/login'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `🎉 ¡Bienvenido a Chazin Food!`),
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
        e(EmailHeader, { subtitle: 'Registro Exitoso en la Plataforma' }),
        e(
          Section,
          { style: { padding: '36px 32px 28px' } },
          e(
            'div',
            {
              style: {
                display: 'inline-block',
                backgroundColor: colors.emerald50,
                border: `1px solid ${colors.emerald200}`,
                borderRadius: '9999px',
                padding: '6px 16px',
                marginBottom: '16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.emerald600,
                  fontSize: '12px',
                  fontWeight: '700',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }
              },
              '✅ Cuenta Creada Exitosamente'
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
            `¡Bienvenido a la familia Chazin Food, ${fullName}! 🍔`
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
            'Nos alegra tenerte con nosotros. A continuación encontrarás los datos asignados a tu cuenta para acceder a la plataforma web:'
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.slate50,
                border: `1px solid ${colors.slate200}`,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '26px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.slate800,
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 12px 0'
                }
              },
              '🔑 Datos de Inicio de Sesión:'
            ),
            e(
              'table',
              {
                border: '0',
                cellPadding: '0',
                cellSpacing: '0',
                style: { width: '100%' }
              },
              e(
                'tbody',
                null,
                e(
                  'tr',
                  null,
                  e(
                    'td',
                    { style: { padding: '6px 0', color: colors.slate500, fontSize: '13px', width: '130px' } },
                    'Correo Registrado:'
                  ),
                  e(
                    'td',
                    { style: { padding: '6px 0', color: colors.slate900, fontSize: '13px', fontWeight: '600' } },
                    email
                  )
                ),
                password
                  ? e(
                      'tr',
                      null,
                      e(
                        'td',
                        { style: { padding: '6px 0', color: colors.slate500, fontSize: '13px' } },
                        'Contraseña:'
                      ),
                      e(
                        'td',
                        { style: { padding: '6px 0' } },
                        e(
                          'code',
                          {
                            style: {
                              backgroundColor: colors.primaryLight,
                              color: colors.primary,
                              border: `1px solid ${colors.primaryBorder}`,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '700',
                              fontFamily: 'monospace'
                            }
                          },
                          password
                        )
                      )
                    )
                  : null
              )
            )
          ),
          e(
            Section,
            { style: { textAlign: 'center', margin: '24px 0 28px' } },
            e(
              Button,
              {
                href: loginLink,
                style: {
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '14px 34px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
                  letterSpacing: '0.3px'
                }
              },
              'Iniciar Sesión en Chazin Food ➔'
            )
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.slate50,
                border: `1px solid ${colors.slate200}`,
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.slate600,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              '💡 ',
              e('strong', null, 'Consejo útil:'),
              ' Desde tu perfil podrás consultar el estado de tus pedidos, acumular puntos y beneficios por compras y personalizar tus preferencias.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = WelcomeEmail;
