import { Card, CardContent } from '@/shared/components/ui/card';

interface CompanyAboutProps {
  description: string | undefined;
}

export const CompanyAbout = ({ description }: CompanyAboutProps) => {
  return (
    <Card className="bg-card rounded-xl p-6 border">
      <CardContent className="p-0">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="underline decoration-primary decoration-4 underline-offset-3">About</span> This Company
        </h2>
        <div className="prose max-w-none">
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {description || 'No description available for this company.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
