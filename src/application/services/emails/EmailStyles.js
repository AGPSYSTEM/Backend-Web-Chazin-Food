/**
 * Design Tokens & Styling for Chazin Food Premium Transactional Emails
 */

const LOGO_OFFICIAL_URL = 'https://res.cloudinary.com/dckwtknmq/image/upload/w_200,h_200,c_fill,r_max,q_auto,f_auto/v1792555455/chazin_food/branding/chazin_emblem_official.png';

const colors = {
  // Brand Reds & Oranges (Gastronomic Gourmet)
  primary: '#E11D48',
  primaryDark: '#BE123C',
  primaryLight: '#FFF1F2',
  primaryBorder: '#FECDD3',
  primaryGradient: 'linear-gradient(135deg, #FF4B2B 0%, #E11D48 55%, #9F1239 100%)',
  accentOrange: '#FF5A1F',
  accentAmber: '#F59E0B',
  amberLight: '#FEF3C7',
  amberBorder: '#FDE68A',
  
  // Dark Luxury Palette (Hero Header)
  obsidian: '#0B0F19',
  navy900: '#0F172A',
  navy800: '#1E293B',
  navy700: '#334155',
  
  // Text & Body
  textMain: '#0F172A',
  textBody: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  
  // Backgrounds & Borders
  bodyBg: '#F8FAFC',
  cardBg: '#FFFFFF',
  cardSubtle: '#F8FAFC',
  borderLight: '#E2E8F0',
  borderSubtle: '#CBD5E1',
  white: '#FFFFFF',
  
  // Status Colors
  emerald600: '#059669',
  emerald50: '#ECFDF5',
  emerald200: '#A7F3D0',
  indigo600: '#4F46E5',
  indigo50: '#EEF2FF',
  indigo200: '#C7D2FE',
  purple600: '#7C3AED',
  purple50: '#F5F3FF',
  purple200: '#DDD6FE'
};

const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
};

function getLogoUrl() {
  return LOGO_OFFICIAL_URL;
}

module.exports = {
  colors,
  typography,
  LOGO_OFFICIAL_URL,
  getLogoUrl
};
