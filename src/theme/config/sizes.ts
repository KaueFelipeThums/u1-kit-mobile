type FontWeights = {
  light: '300';
  normal: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  extrabold: '800';
};

export default {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  } satisfies FontWeights,
  dimension: {
    auto: 'auto',
    xs: 16,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    '2xl': 64,
    '3xl': 80,
  },
  padding: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  radius: {
    default: 11,
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  border: {
    none: 0,
    sm: 1,
    md: 2,
    lg: 4,
  },
  gap: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  margin: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  opacity: {
    0: 0,
    25: 0.25,
    50: 0.5,
    75: 0.75,
    100: 1,
  },
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    loose: 28,
  },
  letterSpacing: {
    tighter: -0.5,
    normal: 0,
    wider: 0.5,
  },
  shadow: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
};
