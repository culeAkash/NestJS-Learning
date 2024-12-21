export class CommentsDto {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId?: string;
  parentCommentId?: string;
  childComments?: CommentsDto[];
}

export class CreateCommentDto {
  content: string;
  authorId: string;
  postId: string;
  parentCommentId: string;
}

export class UpdateCommentDto {
  content: string;
}
