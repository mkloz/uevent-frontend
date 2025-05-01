import { MoonIcon, SunIcon } from 'lucide-react';

import { Theme, useTheme } from '../../store/theme.store';
import { Toggle } from '../ui/toggle';

export const ThemeToggle = () => {
  const { setTheme, isDark } = useTheme();

  return (
    <div className="flex items-center">
      <Toggle
        aria-label="Toggle dark mode"
        pressed={isDark}
        variant={'outline'}
        size={'default'}
        onPressedChange={(value) => {
          setTheme(value ? Theme.DARK : Theme.LIGHT);
        }}
        className="relative inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/80 hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary aspect-square data-[state=on]:bg-accent! p-0!">
        {isDark ? (
          <MoonIcon className="w-6 h-6 text-blue-500 fill-current" />
        ) : (
          <SunIcon className="w-6 h-6 text-yellow-600 fill-current" />
        )}
      </Toggle>
    </div>
  );
};
