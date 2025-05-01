import type { FC } from 'react';

import { Image } from '../../../shared/components/common/image';
import { cn } from '../../../shared/lib/utils';
interface CompanyImageProps {
  name: string;
  logo?: string;
}

interface CompanyLogoProps {
  company?: CompanyImageProps | null;
  className?: string;
}
const getInitials = (fullName?: string) => {
  if (!fullName) return '';

  return (
    fullName
      .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetic characters
      .trim() // Remove leading and trailing whitespace
      .split(' ') // Split by space
      .filter(Boolean) // Remove empty strings
      .map((name) => name[0].toUpperCase()) // Take first character, capitalize
      .slice(0, 2) // Take first two initials
      .join('') || ''
  ); // Join into initials
};

const AvatarFallback = ({ company }: { company: CompanyImageProps | null }) => {
  return (
    <div className="bg-muted flex items-center justify-center w-full h-full">
      <span className="text-muted-foreground text-sm font-semibold">{getInitials(company?.name)}</span>
    </div>
  );
};

export const CompanyLogo: FC<CompanyLogoProps> = ({ className, company }) => {
  return (
    <Image
      src={company?.logo || ''}
      alt={company?.name || ''}
      className={cn('rounded-full w-full h-full object-cover object-center', className)}
      noImageComponent={<AvatarFallback company={company || null} />}
      fallbackComponent={<AvatarFallback company={company || null} />}
      wrapperClassName={cn('rounded-full overflow-hidden border-2 aspect-square', className)}
    />
  );
};
