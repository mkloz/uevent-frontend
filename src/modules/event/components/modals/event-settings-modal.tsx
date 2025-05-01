'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { Settings } from 'lucide-react';
import { type FC, type ReactNode, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { Button } from '../../../../shared/components/ui/button';
import { Event } from '../../interfaces/event.interface';
import { EventSettingsForm } from '../forms/event-settings-form';

interface EventSettingsModalProps {
  event: Event;
  children?: ReactNode;
  onEventDeleted?: () => void;
  className?: string;
}

export const EventSettingsModal: FC<EventSettingsModalProps> = ({ event, onEventDeleted, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!event) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className={className} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Event Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-200 min-h-100 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Settings</DialogTitle>
        </DialogHeader>
        <EventSettingsForm
          event={event}
          onSuccess={() => {
            setIsOpen(false);
          }}
          onDelete={onEventDeleted}
        />
      </DialogContent>
    </Dialog>
  );
};
