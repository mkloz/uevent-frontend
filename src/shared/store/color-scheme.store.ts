'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useTheme } from './theme.store';

export enum ColorScheme {
  INDIGO = 'indigo', // Default
  EMERALD = 'emerald',
  ROSE = 'rose',
  CYAN = 'cyan',
  PURPLE = 'purple',
  TEAL = 'teal',
  BLUE = 'blue',
  ORANGE = 'orange',
  SLATE = 'slate',
  MONOCHROME = 'monochrome'
}

interface ColorSchemeStore {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

export const useColorSchemeStore = create(
  persist<ColorSchemeStore>(
    (set) => ({
      colorScheme: ColorScheme.INDIGO,
      setColorScheme: (colorScheme) => set({ colorScheme })
    }),
    { name: 'color-scheme', storage: createJSONStorage(() => localStorage) }
  )
);

export const useColorScheme = () => {
  const { colorScheme, setColorScheme } = useColorSchemeStore((state) => state);
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    // Remove all color scheme classes
    document.documentElement.classList.remove(...Object.values(ColorScheme).map((scheme) => `color-scheme-${scheme}`));

    // Add the current color scheme class
    document.documentElement.classList.add(`color-scheme-${colorScheme}`);

    // For monochrome, add a data attribute to track the current mode
    if (colorScheme === ColorScheme.MONOCHROME) {
      document.documentElement.setAttribute('data-monochrome-mode', theme);
    } else {
      document.documentElement.removeAttribute('data-monochrome-mode');
    }
  }, [colorScheme, theme]);

  return {
    colorScheme,
    setColorScheme
  };
};
