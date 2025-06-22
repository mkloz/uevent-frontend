import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  inverse: () => void;
}

const getPreferredTheme = (): Theme => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
};

export const useThemeStore = create(
  persist<ThemeStore>(
    (set, get) => {
      const initialTheme = getPreferredTheme();

      return {
        theme: initialTheme,
        setTheme: (theme) => set({ theme }),
        inverse: () => {
          const newTheme = get().theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
          set({ theme: newTheme });
        }
      };
    },
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useTheme = () => {
  const { theme, setTheme, inverse } = useThemeStore((state) => state);
  const root = document.documentElement;

  useEffect(() => {
    root.dataset.theme = theme;
    root.classList.remove(Theme.LIGHT, Theme.DARK);
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? Theme.DARK : Theme.LIGHT;
      setTheme(newColorScheme);
    };
    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [setTheme]);

  return {
    theme,
    setTheme,
    inverse,
    isDark: theme === Theme.DARK,
    isLight: theme === Theme.LIGHT
  };
};
