export const Colors = {
  primary: '#FF5A7D', // Pink
  secondary: '#FFE8EE', // Light Pastel Pink
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#222222',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#EEEEEE',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  greyLight: '#F8F9FA',
  greyDark: '#333333',
  overlay: 'rgba(0, 0, 0, 0.45)',
  gradientStart: 'transparent',
  gradientEnd: 'rgba(0, 0, 0, 0.85)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Sizes = {
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16, // Main Rounded UI Radius
  radiusXl: 22, // Large Rounded UI Radius
  radiusRound: 9999,
};

export const Shadows = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#FF5A7D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const Typography = {
  heading: {
    fontFamily: 'System',
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontFamily: 'System',
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  sizes: {
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    caption: 10,
  },
};

export const Theme = {
  Colors,
  Spacing,
  Sizes,
  Shadows,
  Typography,
};

export default Theme;
