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
  const fullName = `${nombre} ${apellidos}`.trim() || 'Estimado(a) Cliente';

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `🎉 ¡Bienvenido a Chazin Food, ${fullName}! Tus credenciales de acceso`),
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
        e(EmailHeader, { subtitle: 'Registro Exitoso en la Plataforma' }),
        e(
          Section,
          { style: { padding: '36px 32px 30px' } },
          // Badge pill
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
              '✨ Cuenta Creada Exitosamente ✨'
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
            `¡Bienvenido a la familia Chazin Food, ${fullName}! 🍔`
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
            'Nos alegra enormemente darte la bienvenida a nuestra comunidad gastronómica. A continuación encontrarás las credenciales asignadas para acceder a tu cuenta y realizar pedidos:'
          ),
          // Credenciales Card
          e(
            Section,
            {
              style: {
                backgroundColor: '#F8FAFC',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '16px',
                padding: '22px 24px',
                marginBottom: '28px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }
            },
            e(
              'div',
              {
                style: {
                  borderBottom: `1px solid ${colors.borderLight}`,
                  paddingBottom: '10px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }
              },
              e(
                'span',
                {
                  style: {
                    color: colors.navy900,
                    fontSize: '12px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px'
                  }
                },
                '🔑 Datos de Inicio de Sesión'
              ),
              e(
                'span',
                {
                  style: {
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '10.5px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }
                },
                'Seguro SSL'
              )
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
                    { style: { padding: '8px 0', color: colors.textMuted, fontSize: '13px', width: '140px', fontWeight: '600' } },
                    'Correo Registrado:'
                  ),
                  e(
                    'td',
                    { style: { padding: '8px 0', color: colors.navy900, fontSize: '13.5px', fontWeight: '700' } },
                    email
                  )
                ),
                e(
                  'tr',
                  null,
                  e(
                    'td',
                    { style: { padding: '8px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600' } },
                    'Contraseña:'
                  ),
                  e(
                    'td',
                    { style: { padding: '8px 0' } },
                    password
                      ? e(
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
                          password
                        )
                      : e(
                          'span',
                          {
                            style: {
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1px solid #BFDBFE',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700'
                            }
                          },
                          '🔵 (Autenticado con tu cuenta de Google)'
                        )
                  )
                )
              )
            )
          ),
          // Big CTA Button
          e(
            Section,
            { style: { textAlign: 'center', margin: '26px 0 32px' } },
            e(
              Button,
              {
                href: loginLink,
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
              'Iniciar Sesión en Chazin Food ➔'
            )
          ),
          // Beneficios Gastronómicos (Features Grid)
          e(
            'div',
            {
              style: {
                backgroundColor: '#F8FAFC',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '22px'
              }
            },
            e(
              'div',
              {
                style: {
                  color: colors.navy900,
                  fontSize: '12.5px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }
              },
              '🌟 Descubre lo que te espera en Chazin Food'
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
                  e(
                    'td',
                    { style: { padding: '8px 10px', verticalAlign: 'top', width: '33.3%' } },
                    e('div', { style: { fontSize: '20px', marginBottom: '4px' } }, '🍔'),
                    e('div', { style: { color: colors.navy900, fontSize: '12px', fontWeight: '800' } }, '100% Artesanal'),
                    e('div', { style: { color: colors.textMuted, fontSize: '11px', lineHeight: '1.4' } }, 'Pan brioche fresco y carnes premium seleccionadas.')
                  ),
                  e(
                    'td',
                    { style: { padding: '8px 10px', verticalAlign: 'top', width: '33.3%' } },
                    e('div', { style: { fontSize: '20px', marginBottom: '4px' } }, '⏱️'),
                    e('div', { style: { color: colors.navy900, fontSize: '12px', fontWeight: '800' } }, 'Control en Vivo'),
                    e('div', { style: { color: colors.textMuted, fontSize: '11px', lineHeight: '1.4' } }, 'Tiempo estimado y seguimiento exacto de tu pedido.')
                  ),
                  e(
                    'td',
                    { style: { padding: '8px 10px', verticalAlign: 'top', width: '33.3%' } },
                    e('div', { style: { fontSize: '20px', marginBottom: '4px' } }, '⭐'),
                    e('div', { style: { color: colors.navy900, fontSize: '12px', fontWeight: '800' } }, 'Puntos y VIP'),
                    e('div', { style: { color: colors.textMuted, fontSize: '11px', lineHeight: '1.4' } }, 'Acumula beneficios por compras y redime adiciones.')
                  )
                )
              )
            )
          ),
          // Tip de seguridad
          e(
            Section,
            {
              style: {
                backgroundColor: colors.amberLight,
                border: `1px solid ${colors.amberBorder}`,
                borderRadius: '12px',
                padding: '12px 16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: '#92400E',
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              '🔒 ',
              e('strong', null, 'Nota de Seguridad:'),
              ' Nunca compartas tu contraseña con nadie. Chazin Food nunca te solicitará tus claves de acceso por teléfono ni por mensajes no oficiales.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = WelcomeEmail;
