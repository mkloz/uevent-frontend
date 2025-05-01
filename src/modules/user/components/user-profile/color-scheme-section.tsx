import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { ColorSchemeSelector } from './color-scheme-selector';

export const ColorSchemeSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme</CardTitle>
        <CardDescription>Personalize your experience with a custom color scheme</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorSchemeSelector />
      </CardContent>
    </Card>
  );
};
