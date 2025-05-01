'use client';

import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/shared/lib/utils';
import { ColorScheme, useColorScheme } from '@/shared/store/color-scheme.store';
import { useTheme } from '@/shared/store/theme.store';

import { useAuth } from '../../../auth/queries/use-auth.query';
import { UserService } from '../../services/user.service';

interface ColorOption {
  value: ColorScheme;
  label: string;
  color: string;
}

const colorOptions: ColorOption[] = [
  { value: ColorScheme.INDIGO, label: 'Indigo', color: 'oklch(0.59 0.265 290.9)' },
  { value: ColorScheme.BLUE, label: 'Blue', color: 'oklch(0.57 0.17 250)' },
  { value: ColorScheme.CYAN, label: 'Cyan', color: 'oklch(0.59 0.18 200)' },
  { value: ColorScheme.TEAL, label: 'Teal', color: 'oklch(0.58 0.15 180)' },
  { value: ColorScheme.EMERALD, label: 'Emerald', color: 'oklch(0.59 0.18 160)' },
  { value: ColorScheme.ORANGE, label: 'Orange', color: 'oklch(0.595 0.185 70)' },
  { value: ColorScheme.ROSE, label: 'Rose', color: 'oklch(0.55 0.18 10)' },
  { value: ColorScheme.PURPLE, label: 'Purple', color: 'oklch(0.59 0.25 320)' },
  { value: ColorScheme.SLATE, label: 'Slate', color: 'oklch(0.55 0.05 255)' },
  { value: ColorScheme.MONOCHROME, label: 'Monochrome', color: 'dynamic' }
];

export const ColorSchemeSelector = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { theme } = useTheme();
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(colorScheme);
  const { data: currentUser } = useAuth();

  useEffect(() => {
    // Initialize from user settings if available
    if (currentUser?.settings?.themeMainColor) {
      const matchedScheme = colorOptions.find((option) => option.color === currentUser?.settings?.themeMainColor);

      if (matchedScheme) {
        setSelectedScheme(matchedScheme.value);
      }
    }
  }, [currentUser]);

  const updateColorScheme = useMutation({
    mutationFn: (colorScheme: ColorScheme) => {
      const matchedOption = colorOptions.find((option) => option.value === colorScheme);
      return UserService.updateUserSettings({
        themeMainColor: matchedOption?.color
      });
    },
    onSuccess: () => {
      toast.success('Color scheme updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update color scheme', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const handleColorChange = (scheme: ColorScheme) => {
    setSelectedScheme(scheme);
    setColorScheme(scheme);
    updateColorScheme.mutate(scheme);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {colorOptions.map((option) => (
          <button
            key={option.value}
            className={cn(
              'relative h-14 w-full rounded-md border-2 transition-all flex items-center justify-center overflow-hidden',
              selectedScheme === option.value
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-muted hover:border-primary/50'
            )}
            style={{
              backgroundColor:
                option.value === ColorScheme.MONOCHROME ? (theme === 'dark' ? 'white' : 'black') : option.color
            }}
            onClick={() => handleColorChange(option.value)}
            aria-label={`Select ${option.label} color scheme`}>
            {selectedScheme === option.value && (
              <Check
                className={cn(
                  'h-6 w-6 drop-shadow-md',
                  option.value === ColorScheme.MONOCHROME && theme === 'light' ? 'text-white' : 'text-white'
                )}
              />
            )}
            {option.value === ColorScheme.MONOCHROME && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-full bg-black"></div>
                <div className="w-1/2 h-full bg-white"></div>
              </div>
            )}
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Select a color scheme to personalize your experience. This will change the primary color throughout the
        application. The Monochrome option will automatically use {theme === 'dark' ? 'white' : 'black'} in your current
        theme mode.
      </p>
    </div>
  );
};
