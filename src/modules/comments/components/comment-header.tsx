'use client';

import dayjs from 'dayjs';
import { ChevronDown, ChevronUp, Pencil, Settings, Trash2 } from 'lucide-react';

import type { User } from '../../../modules/user/interfaces/user.interface';
import { Link } from '../../../shared/components/common/link';
import { UserAvatar } from '../../../shared/components/common/user-avatar';
import { Button } from '../../../shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../shared/components/ui/dropdown-menu';

interface CommentHeaderProps {
  user: User;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  isAuthor: boolean;
  isReply?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export const CommentHeader = ({
  user,
  userId,
  createdAt,
  updatedAt,
  isAuthor,
  isReply = false,
  isCollapsed,
  onToggleCollapse,
  onDelete,
  onEdit
}: CommentHeaderProps) => {
  const formattedDate = dayjs(createdAt).fromNow();
  const isEdited = updatedAt && createdAt.toString() !== updatedAt.toString();

  return (
    <div className="flex justify-between items-center">
      <Link to={`/users/${userId}`} className="flex items-center gap-2 p-0 h-min">
        <UserAvatar user={user} className="h-6 w-6 flex-shrink-0 sm:hidden block hover:border-primary" />
        <h4 className="font-semibold text-sm">{user?.name || 'Anonymous'}</h4>
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
          {isEdited && <span className="text-xs text-muted-foreground">(edited)</span>}
        </div>
      </Link>

      <div className="flex items-center">
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isReply ? 'h-7 w-7' : 'h-8 w-8'}`}
                aria-label="Comment options">
                <Settings className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2 text-current" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isReply ? 'h-7 w-7' : 'h-8 w-8'}`}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}>
          {isCollapsed ? (
            <ChevronDown className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
          ) : (
            <ChevronUp className={isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
          )}
        </Button>
      </div>
    </div>
  );
};
