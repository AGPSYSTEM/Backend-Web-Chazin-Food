const React = require('react');
const { Section, Text, Img } = require('@react-email/components');
const { colors, LOGO_OFFICIAL_URL } = require('./EmailStyles');

const e = React.createElement;

function EmailHeader({ subtitle = 'Comidas Rápidas Artesanales' }) {
  return e(
    'div',
    null,
    // Línea de acento flame & ember en el borde superior
    e('div', {
      style: {
        height: '4px',
        background: 'linear-gradient(90deg, #DC2626 0%, #EA580C 50%, #D97706 100%)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }
    }),
    e(
      Section,
      {
        style: {
          backgroundColor: colors.castIron,
          padding: '30px 24px 26px',
          textAlign: 'center',
          borderBottom: `1px solid ${colors.castIronBorder}`
        }
      },
      // Logo centralizado con halo artesanal
      e(
        'table',
        {
          border: '0',
          cellPadding: '0',
          cellSpacing: '0',
          style: { margin: '0 auto', textAlign: 'center' }
        },
        e(
          'tbody',
          null,
          e(
            'tr',
            null,
            e(
              'td',
              { align: 'center' },
              e(Img, {
                src: LOGO_OFFICIAL_URL,
                alt: 'Chazin Food - Hamburguesería Artesanal',
                width: '76',
                height: '76',
                style: {
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), 0 0 0 4px rgba(220, 38, 38, 0.18)',
                  display: 'block',
                  margin: '0 auto',
                  backgroundColor: '#FFFFFF'
                }
              })
            )
          )
        )
      ),
      // Wordmark principal
      e(
        Text,
        {
          style: {
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            margin: '12px 0 2px 0',
            textTransform: 'uppercase'
          }
        },
        'Chazin Food'
      ),
      // Tagline de autenticidad
      e(
        'div',
        { style: { marginTop: '4px' } },
        e(
          'span',
          {
            style: {
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '9999px',
              padding: '3px 12px',
              color: '#FCA5A5',
              fontSize: '10.5px',
              fontWeight: '600',
              letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }
          },
          'Hamburguesería & Sabor Artesanal'
        )
      ),
      subtitle
        ? e(
            Text,
            {
              style: {
                color: '#A8A29E',
                fontSize: '12.5px',
                fontWeight: '500',
                letterSpacing: '0.2px',
                margin: '8px 0 0 0'
              }
            },
            subtitle
          )
        : null
    )
  );
}

module.exports = EmailHeader;
