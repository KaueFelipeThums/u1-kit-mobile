import colors from './colors';
import sizes from './sizes';

export default {
  colors: colors,
  sizes: sizes,
  theme: {
    light: {
      background: '#ffffff',
      foreground: '#1c1917',

      card: '#fcfcfc',
      cardForeground: '#292524',

      popover: '#ffffff',
      popoverForeground: '#1c1917',

      primary: '#0072BC',
      primaryForeground: '#ffffff',

      secondary: '#f0f0f0',
      secondaryForeground: '#1c1917',

      muted: '#f5f5f5',
      mutedForeground: '#8c8c8c',

      accent: '#f0f0f0',
      accentForeground: '#1c1917',

      destructive: '#d72638',
      destructiveForeground: '#d72638',

      border: '#d6d6d6',
      input: '#d6d6d6',
    },
    dark: {
      background: '#1c1917',
      foreground: '#f5f5f4',

      card: '#292524',
      cardForeground: '#f5f5f4',

      popover: '#292524',
      popoverForeground: '#f5f5f4',

      primary: '#0072BC',
      primaryForeground: '#1c1917',

      secondary: '#44403c',
      secondaryForeground: '#e7e5e4',

      muted: '#57534e',
      mutedForeground: '#d6d3d1',

      accent: '#44403c',
      accentForeground: '#e7e5e4',

      destructive: '#ef4444',
      destructiveForeground: '#f5f5f4',

      border: '#44403c',
      input: '#44403c',
    },
  },
};
