'use client';

import { Bell, CalendarClock, ImageIcon, Info, MapPin, Ticket } from 'lucide-react';

import { TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface EventFormTabsProps {
  accessibleTabs: Record<string, boolean>;
}

export const EventFormTabs = ({ accessibleTabs }: EventFormTabsProps) => {
  return (
    <TabsList className="grid grid-cols-6 w-full">
      <TabsTrigger value="basic" className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span className="hidden sm:inline">Basic</span>
      </TabsTrigger>
      <TabsTrigger value="media" className="flex items-center gap-2" disabled={!accessibleTabs.media}>
        <ImageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Media</span>
      </TabsTrigger>
      <TabsTrigger value="datetime" className="flex items-center gap-2" disabled={!accessibleTabs.datetime}>
        <CalendarClock className="h-4 w-4" />
        <span className="hidden sm:inline">Date</span>
      </TabsTrigger>
      <TabsTrigger value="location" className="flex items-center gap-2" disabled={!accessibleTabs.location}>
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Location</span>
      </TabsTrigger>
      <TabsTrigger value="tickets" className="flex items-center gap-2" disabled={!accessibleTabs.tickets}>
        <Ticket className="h-4 w-4" />
        <span className="hidden sm:inline">Tickets</span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2" disabled={!accessibleTabs.settings}>
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};
