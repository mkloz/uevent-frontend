import { apiClient } from '../../../shared/api/api';
import { Paginated, PaginationDto } from '../../../shared/types/pagination';
import { Notification } from '../interfaces/notification.interface';

export class NotificationService {
  static async getMy(opt?: PaginationDto): Promise<Paginated<Notification>> {
    const searchParams = new URLSearchParams();
    if (opt?.page) searchParams.append('page', opt.page.toString());
    if (opt?.limit) searchParams.append('limit', opt.limit.toString());

    return await apiClient.get<Paginated<Notification>>(`notifications/my`, { searchParams }).json();
  }

  static async update(notificationId: string, isRead: boolean) {
    return await apiClient.patch(`notifications/${notificationId}`, { json: { isRead } }).json();
  }

  static async delete(notificationId: string) {
    return await apiClient.delete(`notifications/${notificationId}`).json();
  }
}
