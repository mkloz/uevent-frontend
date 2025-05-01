import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { QueryKeys } from '@/shared/constants/query-keys';
import { TimeUtils } from '@/shared/utils/time.utils';

import { TicketService } from '../services/ticket.service';

export const ActivateTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { data } = useAuth();

  const { isSuccess, isError, isLoading } = useQuery({
    queryKey: [QueryKeys.TICKET_VERIFICATION, ticketId],
    queryFn: () => TicketService.verify(ticketId!),
    enabled: !!ticketId
  });

  useEffect(() => {
    if (isSuccess) {
      TimeUtils.timeout(2000, () => {
        navigate(`/users/${data?.id}`, { replace: true });
      });
    }
  }, [isSuccess]);

  if (!ticketId) {
    navigate('/', { replace: true });

    return;
  }

  return (
    <div className="h-svh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {isLoading && (
          <>
            <CgSpinner className="animate-spin h-10 w-10" />
            <p className="text-balance text-sm text-muted-foreground">Activating ticket...</p>
          </>
        )}
        {isError && (
          <>
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-balance text-sm text-muted-foreground">There was an error activating your ticket</p>
          </>
        )}
        {isSuccess && (
          <>
            <h1 className="text-2xl font-bold">Success</h1>
            <p className="text-balance text-sm text-muted-foreground">Ticket was successfully activated</p>
          </>
        )}
      </div>
    </div>
  );
};
