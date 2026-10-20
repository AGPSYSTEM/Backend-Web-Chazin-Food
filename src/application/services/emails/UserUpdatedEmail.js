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
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return e(
    Html,
    { lang: 'es' },
    e(Head),
    e(Preview, null, `✏️ Tu información de cuenta en Chazin Food fue actualizada`),
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
        e(EmailHeader, { subtitle: 'Notificación de Perfil' }),
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
              '✏️ Actualización de Datos'
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
            'Te informamos que la información de tu cuenta en ',
            e('strong', { style: { color: colors.slate900 } }, 'Chazin Food'),
            ` ha sido modificada el `,
            e('strong', null, updateDate),
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
                  color: colors.slate700,
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 8px 0'
                }
              },
              'Detalles de la modificación:'
            ),
            e(
              Text,
              {
                style: {
                  color: colors.slate800,
                  fontSize: '13px',
                  fontWeight: '600',
                  margin: 0
                }
              },
              modifiedFields
            )
          ),
          e(
            Section,
            { style: { textAlign: 'center', margin: '20px 0 24px' } },
            e(
              Button,
              {
                href: portalLink,
                style: {
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '13px 32px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)'
                }
              },
              'Ver Mi Perfil en Chazin Food ➔'
            )
          ),
          e(
            Section,
            {
              style: {
                backgroundColor: colors.amber50,
                border: `1px solid ${colors.amber200}`,
                borderRadius: '12px',
                padding: '14px 18px'
              }
            },
            e(
              Text,
              {
                style: {
                  color: colors.amber600,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }
              },
              'ℹ️ Si no reconoces esta actualización, por favor ponte en contacto con nuestro equipo de soporte para revisar tu cuenta.'
            )
          )
        ),
        e(EmailFooter)
      )
    )
  );
}

module.exports = UserUpdatedEmail;
