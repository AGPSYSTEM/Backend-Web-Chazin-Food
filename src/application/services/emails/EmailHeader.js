const React = require('react');
const { Section, Row, Column, Text, Img } = require('@react-email/components');
const { colors, getLogoBase64 } = require('./EmailStyles');

const e = React.createElement;

function EmailHeader({ subtitle = 'Comidas Rápidas Artesanales' }) {
  const logoData = getLogoBase64();

  return e(
    Section,
    {
      style: {
        backgroundColor: colors.slate900,
        padding: '32px 24px 28px',
        textAlign: 'center',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottom: `3px solid ${colors.primary}`
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
            logoData
              ? e(Img, {
                  src: logoData,
                  alt: 'Chazin Food',
                  width: '84',
                  height: '84',
                  style: {
                    borderRadius: '50%',
                    border: `3px solid ${colors.white}`,
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                    display: 'block',
                    margin: '0 auto'
                  }
                })
              : e(
                  'div',
                  {
                    style: {
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      border: `3px solid ${colors.white}`,
                      color: colors.white,
                      fontSize: '32px',
                      lineHeight: '74px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      margin: '0 auto'
                    }
                  },
                  '🍔'
                )
          )
        )
      ),
      e(
        Text,
        {
          style: {
            color: colors.white,
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '1px',
            margin: '14px 0 2px 0',
            textTransform: 'uppercase'
          }
        },
        'Chazin Food'
      ),
      e(
        Text,
        {
          style: {
            color: colors.slate400,
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.5px',
            margin: '0'
          }
        },
        subtitle
      )
    )
  );
}

module.exports = EmailHeader;
