const React = require('react');
const { Section, Text, Link, Hr } = require('@react-email/components');
const { colors } = require('./EmailStyles');

const e = React.createElement;

function EmailFooter() {
  const currentYear = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return e(
    Section,
    {
      style: {
        backgroundColor: colors.slate50,
        padding: '24px 28px 28px',
        textAlign: 'center',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        borderTop: `1px solid ${colors.slate200}`
      }
    },
    e(
      Text,
      {
        style: {
          color: colors.slate700,
          fontSize: '13px',
          fontWeight: '700',
          margin: '0 0 6px 0'
        }
      },
      'Chazin Food | Comidas Rápidas Artesanales'
    ),
    e(
      Text,
      {
        style: {
          color: colors.slate500,
          fontSize: '12px',
          lineHeight: '1.6',
          margin: '0 0 14px 0'
        }
      },
      'Sabor auténtico, ingredientes seleccionados y la mejor experiencia para nuestros clientes.'
    ),
    e(
      'div',
      { style: { margin: '12px 0' } },
      e(
        Link,
        {
          href: frontendUrl,
          style: {
            color: colors.primary,
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            margin: '0 10px'
          }
        },
        '🌐 Visitar Sitio Web'
      ),
      e('span', { style: { color: colors.slate400 } }, '•'),
      e(
        Link,
        {
          href: `${frontendUrl}/login`,
          style: {
            color: colors.primary,
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            margin: '0 10px'
          }
        },
        '🔑 Iniciar Sesión'
      )
    ),
    e(Hr, {
      style: {
        borderColor: colors.slate200,
        margin: '16px 0'
      }
    }),
    e(
      Text,
      {
        style: {
          color: colors.slate400,
          fontSize: '11px',
          lineHeight: '1.5',
          margin: '0'
        }
      },
      `© ${currentYear} Chazin Food. Todos los derechos reservados.`,
      e('br'),
      'Este es un correo automático de notificación generado por el sistema de Chazin Food. Por favor no respondas a este mensaje.'
    )
  );
}

module.exports = EmailFooter;
