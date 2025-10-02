import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSystemTheme: boolean;
  setIsSystemTheme: (isSystem: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme() ?? 'light';
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [manualTheme, setManualTheme] = useState<Theme>(deviceTheme);

  const theme = isSystemTheme ? deviceTheme : manualTheme;

  const setTheme = (newTheme: Theme) => {
    setIsSystemTheme(false);
    setManualTheme(newTheme);
  };

  const value = useMemo(() => ({
    theme,
    setTheme,
    isSystemTheme,
    setIsSystemTheme,
  }), [theme, isSystemTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};