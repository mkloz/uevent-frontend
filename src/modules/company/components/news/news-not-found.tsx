import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

export const NewsNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">News Item Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The news item you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
};
