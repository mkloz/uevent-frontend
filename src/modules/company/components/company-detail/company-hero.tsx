import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import { FaCalendarDays, FaLocationDot, FaRegUser } from 'react-icons/fa6';
import { FiBell, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { QueryKeys } from '@/shared/constants/query-keys';
import { useShare } from '@/shared/hooks/use-share';
import { cn } from '@/shared/lib/utils';

import { Image } from '../../../../shared/components/common/image';
import { getStaticMapImageUrl } from '../../../../shared/utils/maps.utils';
import { useCompanyFollow } from '../../hooks/use-company-follow';
import type { Company } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyLogo } from '../company-logo';
import { CompanySettingsModal } from '../modal/company-settings-modal';

interface CompanyHeroProps {
  company: Company;
}

export const CompanyHero = ({ company }: CompanyHeroProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const share = useShare();
  const { isFollowing, toggle } = useCompanyFollow(company.id);
  const { data } = useAuth();

  const handleShare = () => {
    share({
      title: company.name,
      text: `Check out this event organizer: ${company.name}`,
      url: window.location.href
    });
  };

  const { mutate: verify, isPending: isVerificationPending } = useMutation({
    mutationFn: CompanyService.verify,
    onSuccess: ({ url }) => {
      window.open(url);
    }
  });
  const { mutate: openDashboard, isPending: isDashboardPending } = useMutation({
    mutationFn: CompanyService.openDashboard,
    onSuccess: ({ url }) => {
      window.open(url, '_blank');
    }
  });
  const { mutate: updateLogo } = useMutation({
    mutationFn: (logo: File) => CompanyService.updateLogo(company.id, logo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES, company.id] });
    }
  });
  const { mutate: updateCover } = useMutation({
    mutationFn: (cover: File) => CompanyService.updateCover(company.id, cover),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES, company.id] });
    }
  });

  const isOwner = data?.id === company?.ownerId;
  const handleUpdateLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateLogo(file);
  };

  const handleUpdateCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateCover(file);
  };

  return (
    <>
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden ">
        <div className="absolute inset-0 z-10"></div>
        <Image
          src={
            company.coverImage ||
            (company.location &&
              getStaticMapImageUrl({
                center: company.location,
                zoom: 6,
                size: {
                  width: 600,
                  height: 300
                },
                markers: [{ position: company.location }]
              }))
          }
          alt={company.name}
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/40"></div>
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white">
          <div className="container mx-auto flex items-end gap-6">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-accent shadow-lg">
              <CompanyLogo company={company} className="w-full h-full" />

              {isOwner && (
                <div className="absolute -bottom-1 right-2">
                  <Label
                    htmlFor="logo"
                    className={cn(buttonVariants({ size: 'sm' }), 'relative gap-0 rounded-full h-6 w-6')}>
                    <Upload className="h-2 w-2" />
                    <Input
                      type="file"
                      id="logo"
                      className="hidden h-0 w-0 absolute"
                      accept="image/*"
                      onChange={handleUpdateLogo}
                    />
                  </Label>
                </div>
              )}
            </div>
            <div className="flex-1 gap-2 grid">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {company.name} {!company.isVerified && isOwner && '(unverified)'}
              </h1>
              <CompanyHeroStats company={company} />

              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
                    Settings
                  </Button>

                  {!company.isVerified && (
                    <Button
                      onClick={() => verify(company.id)}
                      isLoading={isVerificationPending}
                      variant="secondary"
                      size="sm">
                      Verify
                    </Button>
                  )}

                  {company.isVerified && (
                    <Button
                      onClick={() => openDashboard(company.id)}
                      isLoading={isDashboardPending}
                      variant="secondary"
                      size="sm">
                      Dashboard
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="link"
          size="icon"
          className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
          onClick={() => nav(-1)}
          aria-label="Go back">
          <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
          Go Back
        </Button>

        <div className="flex items-center space-x-2 absolute top-4 right-4 z-20">
          {isOwner && (
            <Label htmlFor="cover" className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'gap-0')}>
              Change Cover
              <Input
                type="file"
                id="cover"
                className="hidden h-0 w-0 absolute"
                accept="image/*"
                onChange={handleUpdateCover}
              />
            </Label>
          )}

          <Button
            variant="ghost"
            size={'icon'}
            className="text-white/90 hover:text-red-700/80 hover:bg-red-500/30 transition-colors duration-300 hover:border-red-700/80"
            onClick={toggle}
            aria-pressed={isFollowing}
            aria-label="Follow Company">
            <FiBell className="size-6" fill={isFollowing ? 'currentColor' : 'none'} />
          </Button>
          <Button
            variant="ghost"
            size={'icon'}
            onClick={handleShare}
            className="text-white/90 hover:text-primary hover:bg-primary/30 transition-colors duration-300"
            aria-label="Share Company">
            <FiShare2 className="size-6" />
          </Button>
        </div>
      </div>

      {open && <CompanySettingsModal company={company} open={open} setOpen={setOpen} />}
    </>
  );
};

interface CompanyHeroStatsProps {
  company: Company;
}

const CompanyHeroStats = ({ company }: CompanyHeroStatsProps) => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
      {location && (
        <div className="flex items-center">
          <FaLocationDot className="mr-2 h-5 w-5" />
          <span>{company.location.address}</span>
        </div>
      )}
      <div className="flex items-center">
        <FaCalendarDays className="mr-2 h-5 w-5" />
        <span>{company._count?.events} Events</span>
      </div>
      <div className="flex items-center">
        <FaRegUser className="mr-2 h-5 w-5" />

        <span>{company._count?.subscribers} Followers</span>
      </div>
    </div>
  );
};
