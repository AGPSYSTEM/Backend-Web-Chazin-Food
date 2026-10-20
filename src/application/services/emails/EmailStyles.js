const path = require('path');
const fs = require('fs');

const colors = {
  primary: '#EF4444',
  primaryDark: '#DC2626',
  primaryLight: '#FEF2F2',
  primaryBorder: '#FCA5A5',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',
  emerald600: '#059669',
  emerald50: '#ECFDF5',
  emerald200: '#A7F3D0',
  amber600: '#D97706',
  amber50: '#FFFBEB',
  amber200: '#FDE68A',
  indigo600: '#4F46E5',
  indigo50: '#EEF2FF',
  indigo200: '#C7D2FE'
};

const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
};

function getLogoBase64() {
  try {
    const logoPath = path.join(__dirname, '../../../presentation/assets/chazin_logo_small.jpg');
    if (fs.existsSync(logoPath)) {
      const data = fs.readFileSync(logoPath).toString('base64');
      return `data:image/jpeg;base64,${data}`;
    }
  } catch (err) {
    // Fallback if read fails
  }
  return null;
}

module.exports = {
  colors,
  typography,
  getLogoBase64
};
