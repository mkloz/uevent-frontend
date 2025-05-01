import { Success } from '@/modules/auth/interfaces/auth.interface';
import { apiClient } from '@/shared/api/api';

export class TicketService {
  static async verify(ticketId: string) {
    return apiClient.post<Success>(`tickets/verify/${ticketId}`).json();
  }
}
