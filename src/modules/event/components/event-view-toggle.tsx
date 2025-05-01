import type { FC } from 'react';
import { FiGrid, FiList, FiMapPin } from 'react-icons/fi';

import { Button } from '../../../shared/components/ui/button';
import { cn } from '../../../shared/lib/utils';

export enum EventsView {
  GRID = 'grid',
  LIST = 'list',
  MAP = 'map'
}

interface EventViewToggleProps {
  view: EventsView;
  setView: (view: EventsView) => void;
}

const VIEWS = [
  { name: 'Grid', icon: FiGrid, value: EventsView.GRID },
  { name: 'List', icon: FiList, value: EventsView.LIST },
  { name: 'Map', icon: FiMapPin, value: EventsView.MAP }
];

export const EventViewToggle: FC<EventViewToggleProps> = ({ view, setView }) => {
  return (
    <div className="flex">
      {VIEWS.map((item, index) => (
        <Button
          key={item.name}
          variant={view === item.value ? 'default' : 'outline'}
          size="default"
          onClick={() => setView(item.value)}
          className={cn(
            'flex gap-1 items-center justify-center',
            index === 0 ? 'rounded-r-none' : index === VIEWS.length - 1 ? 'rounded-l-none' : 'rounded-none',
            item.value === EventsView.LIST && 'max-md:hidden'
          )}>
          <item.icon className="h-4 w-4" />
          {item.name}
        </Button>
      ))}
    </div>
  );
};
