/**
 * Design System & Styling Tokens for Chazin Food Transactional Emails
 * Inspired by artisanal gastronomic branding: cast iron charcoals, flame crimson,
 * warm brioche amber, and warm parchment canvas.
 */

const LOGO_OFFICIAL_URL =
  'https://res.cloudinary.com/dckwtknmq/image/upload/w_200,h_200,c_fill,r_max,q_auto,f_auto/v1792555455/chazin_food/branding/chazin_emblem_official.png';

const colors = {
  // Cast Iron & Charcoal (Hero Masthead & Deep Accents)
  castIron: '#141210',
  castIronSubtle: '#1C1917',
  castIronBorder: '#292524',
  
  // Brand Flame & Crimson (Gastronomic Signature)
  crimson: '#DC2626',
  crimsonHover: '#B91C1C',
  crimsonLight: '#FEF2F2',
  crimsonBorder: '#FECACA',
  flameGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
  
  // Toasted Brioche & Amber (Warm Accents & Warnings)
  briocheAmber: '#D97706',
  briocheAmberLight: '#FFFBEB',
  briocheAmberBorder: '#FDE68A',
  amberText: '#92400E',
  
  // Natural Sage & Emerald (Success, Security & Badges)
  emerald: '#16A34A',
  emeraldLight: '#F0FDF4',
  emeraldBorder: '#BBF7D0',
  emeraldText: '#166534',
  
  // Deep Stone Typography
  textTitle: '#1C1917',
  textBody: '#44403C',
  textMuted: '#78716C',
  textSubtle: '#A8A29E',
  
  // Canvas & Surfaces (Warm artisanal parchment feel, never cold hospital grey)
  canvasBg: '#F8F6F2',
  cardBg: '#FFFFFF',
  cardSubtle: '#FAFAF9',
  borderLight: '#E7E5E4',
  borderStrong: '#D6D3D1',
  white: '#FFFFFF',

  // Backward compatibility aliases
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primaryLight: '#FEF2F2',
  primaryBorder: '#FECACA',
  primaryGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
  obsidian: '#141210',
  navy900: '#1C1917',
  navy800: '#292524',
  navy700: '#44403C',
  textMain: '#1C1917',
  bodyBg: '#F8F6F2',
  emerald600: '#16A34A',
  emerald50: '#F0FDF4',
  emerald200: '#BBF7D0',
  indigo600: '#4F46E5',
  indigo50: '#EEF2FF',
  indigo200: '#C7D2FE',
  purple600: '#7C3AED',
  purple50: '#F5F3FF',
  purple200: '#DDD6FE',
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A'
};

const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
};

const commonStyles = {
  body: {
    backgroundColor: colors.canvasBg,
    fontFamily: typography.fontFamily,
    margin: 0,
    padding: '32px 14px',
    WebkitFontSmoothing: 'antialiased'
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: '16px',
    maxWidth: '580px',
    margin: '0 auto',
    border: `1px solid ${colors.borderLight}`,
    boxShadow: '0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.03)',
    overflow: 'hidden'
  },
  contentSection: {
    padding: '36px 32px 28px'
  },
  ctaButton: {
    background: colors.flameGradient,
    color: '#FFFFFF',
    padding: '15px 36px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '15px',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 6px 18px -2px rgba(220, 38, 38, 0.35)',
    letterSpacing: '0.2px',
    textAlign: 'center'
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    color: colors.textTitle,
    border: `1px solid ${colors.borderStrong}`,
    padding: '11px 22px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '13px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  badge: {
    display: 'inline-block',
    borderRadius: '9999px',
    padding: '5px 14px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },
  infoCard: {
    backgroundColor: colors.cardSubtle,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '12px',
    padding: '18px 20px',
    marginBottom: '24px'
  },
  codeSnippet: {
    backgroundColor: colors.crimsonLight,
    color: colors.crimson,
    border: `1px solid ${colors.crimsonBorder}`,
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    letterSpacing: '0.5px',
    display: 'inline-block'
  }
};

function getLogoUrl() {
  return LOGO_OFFICIAL_URL;
}

module.exports = {
  colors,
  typography,
  commonStyles,
  LOGO_OFFICIAL_URL,
  getLogoUrl
};
