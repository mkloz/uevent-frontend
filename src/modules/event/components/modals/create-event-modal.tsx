'use client';

import { PlusIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/components/ui/dialog';

import { CreateEventForm } from '../forms/create-event-form';

interface CreateEventModalProps {
  companyId: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function CreateEventModal({ companyId, children, className, disabled }: CreateEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className={className} variant="outline" disabled={disabled}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-200 min-h-100 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details to create a new event for your company.</DialogDescription>
        </DialogHeader>
        <CreateEventForm companyId={companyId} onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
