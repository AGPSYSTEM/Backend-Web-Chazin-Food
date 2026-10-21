const React = require('react');
const { Section, Text, Img } = require('@react-email/components');
const { colors, LOGO_OFFICIAL_URL } = require('./EmailStyles');

const e = React.createElement;

function EmailHeader({ subtitle = 'Comidas Rápidas Artesanales' }) {
  return e(
    'div',
    null,
    // Barra de acento con gradiente gastronómico vibrante
    e('div', {
      style: {
        height: '6px',
        background: 'linear-gradient(90deg, #FF4B2B 0%, #E11D48 35%, #F59E0B 75%, #FF5A1F 100%)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px'
      }
    }),
    e(
      Section,
      {
        style: {
          backgroundColor: colors.obsidian,
          padding: '36px 24px 30px',
          textAlign: 'center',
          borderBottom: `1px solid ${colors.navy800}`
        }
      },
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
                alt: 'Chazin Food',
                width: '88',
                height: '88',
                style: {
                  borderRadius: '50%',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 8px 24px rgba(225, 29, 72, 0.45)',
                  display: 'block',
                  margin: '0 auto',
                  backgroundColor: '#FFFFFF'
                }
              })
            )
          )
        )
      ),
      e(
        Text,
        {
          style: {
            color: colors.white,
            fontSize: '24px',
            fontWeight: '900',
            letterSpacing: '2px',
            margin: '14px 0 4px 0',
            textTransform: 'uppercase'
          }
        },
        'Chazin Food'
      ),
      // Badge insignia artesanal
      e(
        'div',
        { style: { marginTop: '6px' } },
        e(
          'span',
          {
            style: {
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '9999px',
              padding: '4px 14px',
              color: '#FDA4AF',
              fontSize: '10.5px',
              fontWeight: '700',
              letterSpacing: '1.2px',
              textTransform: 'uppercase'
            }
          },
          '🔥 Sabor Artesanal Gourmet 🔥'
        )
      ),
      subtitle
        ? e(
            Text,
            {
              style: {
                color: colors.textLight,
                fontSize: '12.5px',
                fontWeight: '500',
                letterSpacing: '0.4px',
                margin: '10px 0 0 0'
              }
            },
            subtitle
          )
        : null
    )
  );
}

module.exports = EmailHeader;
