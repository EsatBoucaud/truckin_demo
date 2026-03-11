import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [accent, setAccent] = useState<AccentColor>('blue');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  return (
    <ThemeContext.Provider value={{ mode, setMode, accent, setAccent, backgroundImage, setBackgroundImage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
