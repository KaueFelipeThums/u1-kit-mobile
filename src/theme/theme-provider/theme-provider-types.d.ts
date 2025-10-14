import theme from '@/theme/config/theme';

type ThemeMode = 'dark' | 'light' | 'system';

type ThemeColors = typeof theme.colors & typeof theme.theme.light;

type ThemeValue = {
  themeMode: ThemeMode;
  selectedTheme: Omit<ThemeMode, 'system'>;
  colors: ThemeColors;
  sizes: typeof theme.sizes;
};
export type { ThemeValue, ThemeMode };
