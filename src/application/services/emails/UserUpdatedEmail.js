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

function UserUpdatedEmail({
  nombre = 'Usuario',
  apellidos = '',
  modifiedFields = 'Perfil actualizado',
  portalLink = 'http://localhost:5173/perfil'
}) {
  const fullName = `${nombre} ${apellidos}`.trim() || 'Usuario';
  const updateDate = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `✏️ Tu perfil de usuario en Chazin Food ha sido actualizado`),
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
        e(EmailHeader, { subtitle: 'Notificación de Perfil' }),
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
                  backgroundColor: colors.purple50,
                  border: `1px solid ${colors.purple200}`,
                  borderRadius: '9999px',
                  padding: '6px 18px',
                  color: colors.purple600,
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }
              },
              '✏️ Perfil Modificado con Éxito ✏️'
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
            `Datos actualizados, ${fullName}`
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
            'Te confirmamos que los datos correspondientes a tu cuenta en Chazin Food han sido sincronizados y guardados correctamente en nuestra base de datos.'
          ),
          // Summary Card
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
              '📝 Resumen de la Actualización'
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
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', width: '130px', fontWeight: '600' } }, 'Campos Editados:'),
                  e(
                    'td',
                    { style: { padding: '6px 0' } },
                    e(
                      'span',
                      {
                        style: {
                          backgroundColor: '#F1F5F9',
                          border: `1px solid ${colors.borderLight}`,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          color: colors.navy900,
                          fontSize: '12.5px',
                          fontWeight: '700'
                        }
                      },
                      modifiedFields
                    )
                  )
                ),
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600' } }, 'Fecha de Registro:'),
                  e('td', { style: { padding: '6px 0', color: colors.navy900, fontSize: '13px', fontWeight: '700' } }, updateDate)
                ),
                e(
                  'tr',
                  null,
                  e('td', { style: { padding: '6px 0', color: colors.textMuted, fontSize: '13px', fontWeight: '600' } }, 'Estado:'),
                  e('td', { style: { padding: '6px 0', color: colors.emerald600, fontSize: '13px', fontWeight: '700' } }, '✅ Sincronizado en tiempo real')
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
                href: portalLink,
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
              'Ver Mi Perfil en Chazin Food ➔'
            )
          ),
          // Nota de seguridad
          e(
            Section,
            {
              style: {
                backgroundColor: colors.indigo50,
                border: `1px solid ${colors.indigo200}`,
                borderRadius: '12px',
                padding: '12px 16px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.indigo600,
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              '🔒 ',
              e('strong', null, 'Protección de Datos:'),
              ' Si no autorizaste esta modificación en tu cuenta, por favor ingresa de inmediato a tu perfil o contáctanos para revisar la seguridad de tus datos.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = UserUpdatedEmail;
