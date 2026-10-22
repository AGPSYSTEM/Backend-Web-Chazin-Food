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
    timeStyle: 'short'
  });

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `Tu contraseña de Chazin Food fue modificada exitosamente`),
    e(
      Body,
      { style: commonStyles.body },
      e(
        Container,
        { style: commonStyles.container },
        e(EmailHeader, { subtitle: 'Seguridad y Notificaciones' }),
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
              'Cambio Confirmado'
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
            `Hola, ${fullName}`
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
            'Te confirmamos que la contraseña asociada a tu cuenta en Chazin Food ha sido modificada con éxito. Puedes ingresar al portal con tu nueva clave.'
          ),
          // Audit Log Card
          e(
            Section,
            {
              style: {
                backgroundColor: colors.cardSubtle,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '12px',
                padding: '18px 20px',
                marginBottom: '24px'
              }
            },
            e(
              'div',
              {
                style: {
                  borderBottom: `1px solid ${colors.borderLight}`,
                  paddingBottom: '10px',
                  marginBottom: '12px',
                  color: colors.textTitle,
                  fontSize: '11.5px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }
              },
              'Registro del Cambio'
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
                  e('td', { style: { padding: '5px 0', color: colors.textMuted, fontSize: '13px', width: '130px', fontWeight: '500' } }, 'Fecha y hora:'),
                  e('td', { style: { padding: '5px 0', color: colors.textTitle, fontSize: '13px', fontWeight: '600' } }, changeDate)
                ),
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '5px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '500' } }, 'Estado:'),
                  e('td', { style: { padding: '5px 0', color: colors.emeraldText, fontSize: '13px', fontWeight: '700' } }, 'Actualizada y protegida')
                ),
                (nuevaContrasena || password)
                  ? e(
                      'tr',
                      null,
                      e('td', { style: { padding: '8px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '500' } }, 'Nueva clave:'),
                      e(
                        'td',
                        { style: { padding: '8px 0' } },
                        e(
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
                              fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace'
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
                  e('td', { style: { padding: '5px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '500' } }, 'Plataforma:'),
                  e('td', { style: { padding: '5px 0', color: colors.textTitle, fontSize: '13px', fontWeight: '600' } }, 'Chazin Food Web (HTTPS)')
                )
              )
            )
          ),
          // CTA
          e(
            Section,
            { style: { textAlign: 'center', margin: '22px 0 26px' } },
            e(
              Button,
              {
                href: supportLink,
                style: commonStyles.ctaButton
              },
              'Ir al Portal Chazin Food'
            )
          ),
          // Advertencia de seguridad en caso de actividad no autorizada
          e(
            Section,
            {
              style: {
                backgroundColor: colors.crimsonLight,
                border: `1px solid ${colors.crimsonBorder}`,
                borderRadius: '10px',
                padding: '12px 14px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.crimson,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              e('strong', null, '¿No reconoces esta actividad? '),
              'Si no realizaste este cambio, comunícate de inmediato con el equipo de soporte de Chazin Food para asegurar tu cuenta.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = PasswordChangedEmail;
