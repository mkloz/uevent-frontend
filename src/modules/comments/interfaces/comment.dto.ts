type CommentSortBy = 'date' | 'popularity';

export interface CommentGetManyDto extends CommentIdRelationField {
  page?: number;
  limit?: number;
  sortBy?: CommentSortBy;
  sortOrder?: 'asc' | 'desc';
  userId?: string;
}

export interface CreateCommentDto extends CommentIdRelationField {
  content: string;
}

export interface CommentIdRelationField {
  eventId?: string;
  newsId?: string;
  parentId?: string;
}
export interface UpdateCommentDto {
  content?: string;
}
