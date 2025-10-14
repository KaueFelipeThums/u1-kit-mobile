import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, ThemeValue } from './theme-provider-types';
import currentTheme from '@/theme/config/theme';
import { storage } from '@/utils/local-storage';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
};

type ThemeProviderState = ThemeValue & {
  setThemeMode: (theme: ThemeMode) => void;
};

const initialState: ThemeProviderState = {
  themeMode: 'light',
  selectedTheme: 'light',
  setThemeMode: () => {},
  colors: { ...currentTheme.theme.light, ...currentTheme.colors },
  sizes: currentTheme.sizes,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'mobile-coperdia-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme);
  const colorScheme = useColorScheme();
  const selectedTheme = themeMode === 'system' ? (colorScheme ?? 'light') : themeMode;

  const getTheme = React.useCallback(async () => {
    const theme = await storage.get(storageKey);
    if (['light', 'dark', 'system'].includes(theme)) {
      setThemeMode(theme);
    }
  }, [storageKey]);

  const setTheme = React.useCallback(
    async (themeProp: ThemeMode) => {
      await storage.set(storageKey, themeProp);
      setThemeMode(themeProp);
    },
    [storageKey],
  );

  useEffect(() => {
    getTheme();
  }, [getTheme]);

  const value: ThemeProviderState = {
    themeMode,
    selectedTheme,
    setThemeMode: (themeValue: ThemeMode) => {
      setTheme(themeValue);
    },
    colors: { ...currentTheme.theme[selectedTheme], ...currentTheme.colors },
    sizes: currentTheme.sizes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export type { ThemeProviderState };
export { ThemeProviderContext };
export { ThemeProvider };
