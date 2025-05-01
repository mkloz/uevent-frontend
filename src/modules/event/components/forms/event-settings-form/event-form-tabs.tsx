'use client';

import { AlertTriangle, Bell, CalendarClock, ImageIcon, Info, MapPin, Ticket } from 'lucide-react';

import { TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const EVENT_SETTINGS_TABS = [
  { value: 'basic', label: 'Basic', icon: Info },
  { value: 'media', label: 'Media', icon: ImageIcon },
  { value: 'datetime', label: 'Date', icon: CalendarClock },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'tickets', label: 'Tickets', icon: Ticket },
  { value: 'settings', label: 'Settings', icon: Bell },
  { value: 'danger', label: 'Danger', icon: AlertTriangle }
];

export const EventFormTabs = () => {
  return (
    <TabsList className="grid grid-cols-7 w-full min-w-60">
      {EVENT_SETTINGS_TABS.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="text-sm ">
          <tab.icon className="h-4 w-4" />
          <span className="hidden md:inline">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
