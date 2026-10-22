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
const { colors, commonStyles } = require('./EmailStyles');

const e = React.createElement;

function WelcomeEmail({
  nombre = 'Usuario',
  apellidos = '',
  email = '',
  password = '',
  loginLink = 'http://localhost:5173/login'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Estimado(a) Colaborador(a)';

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `Bienvenido a Chazin Food. Tus credenciales de acceso`),
    e(
      Body,
      { style: commonStyles.body },
      e(
        Container,
        { style: commonStyles.container },
        e(EmailHeader, { subtitle: 'Bienvenida a la Plataforma Chazin Food' }),
        e(
          Section,
          { style: commonStyles.contentSection },
          // Badge
          e(
            'div',
            { style: { textAlign: 'center', marginBottom: '18px' } },
            e(
              'span',
              {
                style: {
                  ...commonStyles.badge,
                  backgroundColor: colors.emeraldLight,
                  border: `1px solid ${colors.emeraldBorder}`,
                  color: colors.emeraldText
                }
              },
              'Acceso Habilitado'
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
            `¡Te damos la bienvenida, ${fullName}!`
          ),
          e(
            Text,
            {
              style: {
                color: colors.textBody,
                fontSize: '14.5px',
                lineHeight: '1.6',
                margin: '0 0 24px 0',
                textAlign: 'center'
              }
            },
            'Tu cuenta en la plataforma de Chazin Food ha sido configurada exitosamente. A continuación encontrarás los datos asignados para ingresar al sistema:'
          ),
          // Credenciales Card
          e(
            Section,
            {
              style: {
                backgroundColor: colors.cardSubtle,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '26px'
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
                    color: colors.textTitle,
                    fontSize: '11.5px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }
                },
                'Datos de Inicio de Sesión'
              ),
              e(
                'span',
                {
                  style: {
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderLight}`,
                    color: colors.textBody,
                    fontSize: '10.5px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }
                },
                'Seguridad SSL'
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
                    {
                      style: {
                        padding: '6px 0',
                        color: colors.textMuted,
                        fontSize: '13px',
                        width: '130px',
                        fontWeight: '500'
                      }
                    },
                    'Correo Registrado:'
                  ),
                  e(
                    'td',
                    {
                      style: {
                        padding: '6px 0',
                        color: colors.textTitle,
                        fontSize: '13.5px',
                        fontWeight: '700'
                      }
                    },
                    email
                  )
                ),
                e(
                  'tr',
                  null,
                  e(
                    'td',
                    {
                      style: {
                        padding: '6px 0',
                        color: colors.textMuted,
                        fontSize: '13px',
                        fontWeight: '500'
                      }
                    },
                    'Contraseña:'
                  ),
                  e(
                    'td',
                    { style: { padding: '6px 0' } },
                    password
                      ? e(
                          'code',
                          {
                            style: {
                              backgroundColor: colors.crimsonLight,
                              color: colors.crimson,
                              border: `1px solid ${colors.crimsonBorder}`,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '13.5px',
                              fontWeight: '700',
                              fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace',
                              letterSpacing: '0.5px'
                            }
                          },
                          password
                        )
                      : e(
                          'span',
                          {
                            style: {
                              color: colors.textMuted,
                              fontSize: '12.5px',
                              fontStyle: 'italic'
                            }
                          },
                          'Acceso vinculado con Google'
                        )
                  )
                )
              )
            )
          ),
          // Botón Principal CTA
          e(
            Section,
            { style: { textAlign: 'center', margin: '24px 0 28px' } },
            e(
              Button,
              {
                href: loginLink,
                style: commonStyles.ctaButton
              },
              'Ingresar al Portal Chazin Food'
            )
          ),
          // Nota de seguridad
          e(
            Section,
            {
              style: {
                backgroundColor: colors.briocheAmberLight,
                border: `1px solid ${colors.briocheAmberBorder}`,
                borderRadius: '10px',
                padding: '12px 14px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.amberText,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              e('strong', null, 'Importante: '),
              'Por motivos de seguridad, te recomendamos cambiar la contraseña asignada al momento de tu primer ingreso desde la configuración de tu perfil.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = WelcomeEmail;
