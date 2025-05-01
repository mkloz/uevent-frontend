import { Calendar, Check, Clock, ExternalLink, MapPin } from 'lucide-react';
import { ComponentProps } from 'react';
import { IoTicketOutline } from 'react-icons/io5';
import QRCode from 'react-qr-code';

import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import { Card, CardContent, CardFooter } from '../../../shared/components/ui/card';
import dayjs from '../../../shared/lib/dayjs';
import { cn } from '../../../shared/lib/utils';
import { Ticket } from '../interfaces/ticket.interface';

interface TicketCardProps extends ComponentProps<typeof Card> {
  ticket: Ticket;
}
const STATUS_COLORS = {
  VALID: 'bg-green-500/10 text-green-600 border-green-500/20',
  USED: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  CANCELLED: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
};

export const TicketCard = ({ ticket, className, ...props }: TicketCardProps) => {
  return (
    <Card
      key={ticket.id}
      {...props}
      className={cn('overflow-hidden hover:border-primary transition-colors py-0 @container', className)}>
      <div className="flex h-full flex-wrap items-center">
        {/* QR Code Section */}
        <div className="bg-muted p-3 flex flex-col items-center justify-center @max-xl:grow @xl:h-full m-0">
          <QRCode
            size={160}
            value={window.location.origin + `/verify-ticket/${ticket.id}`}
            bgColor="transparent"
            fgColor="var(--foreground)"
            className="size-full max-w-40 aspect-square"
          />
        </div>

        {/* Ticket Details Section */}
        <div className="min-w-40 grow flex flex-col">
          <CardContent className="p-3 pb-0 flex-grow">
            <div className="flex flex-col items-start justify-between gap-2 mb-2">
              <div className="min-w-0 w-full flex justify-between gap-2">
                <p className="line-clamp-1 font-semibold text-lg">{ticket.event.title}</p>

                <Badge variant="outline" className={`text-xs ${STATUS_COLORS[ticket.status]}`}>
                  {ticket.status === 'VALID' && <Check className="h-2.5 w-2.5 mr-1" />}
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <IoTicketOutline className="mr-1 h-3 w-3" />
                  <span className="text-xs text-center text-muted-foreground">#{ticket.id.substring(0, 8)}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="mr-1 h-3 w-3" />
                  {dayjs(ticket.event.startDate).format('MMM D, YYYY')}
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{ticket?.event?.location?.address || 'Online'}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Purchased {dayjs(ticket.purchaseDate).format('MMM D, YYYY')}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-3 !py-1 flex justify-between items-center border-t mt-auto">
            <div className="font-medium text-sm">
              {ticket.event.price > 0 ? `$${ticket.event.price.toFixed(2)}` : 'Free'}
            </div>
            <Link to={`/events/${ticket.event.id}`} className="text-xs text-primary hover:underline flex items-center">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
