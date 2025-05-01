import { FC } from 'react';

import { cn } from '../../../../shared/lib/utils';

interface UserNoItemsProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  className?: string;
}

export const UserNoItems: FC<UserNoItemsProps> = ({ description, icon: Icon, title, className }) => {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-13rem)]',
        className
      )}>
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
