import { apiClient } from '../../../shared/api/api';
import type { Paginated } from '../../../shared/types/pagination';
import { objectToSearchParams } from '../../../shared/utils/converters.utils';
import type { CommentGetManyDto, CreateCommentDto, UpdateCommentDto } from '../interfaces/comment.dto';
import type { Comment } from '../interfaces/comment.interface';

export class CommentService {
  static getById(id: string): Promise<Comment> {
    return apiClient.get(`comments/${id}`).json<Comment>();
  }

  static getMany(opt: CommentGetManyDto): Promise<Paginated<Comment>> {
    const searchParams = objectToSearchParams(opt);

    return apiClient.get(`comments`, { searchParams }).json<Paginated<Comment>>();
  }

  static create(dto: CreateCommentDto): Promise<Comment> {
    return apiClient.post(`comments`, { json: dto }).json<Comment>();
  }

  static update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    return apiClient.patch(`comments/${id}`, { json: dto }).json<Comment>();
  }

  static delete(id: string): Promise<void> {
    return apiClient.delete(`comments/${id}`).json<void>();
  }
}
