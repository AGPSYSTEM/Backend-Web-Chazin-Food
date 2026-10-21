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
        backgroundColor: '#F8FAFC',
        padding: '28px 24px 30px',
        textAlign: 'center',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        borderTop: `1px solid ${colors.borderLight}`
      }
    },
    // Fila de iconos gourmet
    e(
      'div',
      { style: { fontSize: '18px', letterSpacing: '6px', marginBottom: '8px' } },
      '🍔 🍟 🌭 🥤'
    ),
    e(
      Text,
      {
        style: {
          color: colors.navy900,
          fontSize: '13.5px',
          fontWeight: '800',
          letterSpacing: '0.3px',
          margin: '0 0 4px 0'
        }
      },
      'Chazin Food | Comidas Rápidas Artesanales'
    ),
    e(
      Text,
      {
        style: {
          color: colors.textMuted,
          fontSize: '12px',
          lineHeight: '1.6',
          margin: '0 0 16px 0',
          maxWidth: '440px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      },
      'El auténtico sabor artesanal con ingredientes seleccionados, pan brioche recién horneado y carnes 100% de calidad.'
    ),
    // Botones / Enlaces rápidos tipo píldora
    e(
      'div',
      { style: { margin: '14px 0' } },
      e(
        Link,
        {
          href: frontendUrl,
          style: {
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.borderLight}`,
            borderRadius: '8px',
            color: colors.primary,
            fontSize: '11.5px',
            fontWeight: '700',
            textDecoration: 'none',
            padding: '7px 14px',
            margin: '0 4px',
            display: 'inline-block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }
        },
        '🌐 Menú Digital'
      ),
      e(
        Link,
        {
          href: `${frontendUrl}/login`,
          style: {
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.borderLight}`,
            borderRadius: '8px',
            color: colors.primary,
            fontSize: '11.5px',
            fontWeight: '700',
            textDecoration: 'none',
            padding: '7px 14px',
            margin: '0 4px',
            display: 'inline-block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }
        },
        '🔑 Iniciar Sesión'
      )
    ),
    e(Hr, {
      style: {
        borderColor: colors.borderLight,
        margin: '18px 0 14px 0'
      }
    }),
    e(
      Text,
      {
        style: {
          color: colors.textLight,
          fontSize: '11px',
          lineHeight: '1.6',
          margin: 0
        }
      },
      '📍 Bogotá D.C., Colombia • Pedidos Online y Presencial',
      e('br'),
      `© ${currentYear} Chazin Food. Todos los derechos reservados.`,
      e('br'),
      'Este es un mensaje seguro generado automáticamente por el sistema de Chazin Food. Por favor no respondas a este correo.'
    )
  );
}

module.exports = EmailFooter;
