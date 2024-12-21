import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CommentsDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(commentData: CreateCommentDto): Promise<CommentsDto> {
    try {
      const newComment = await this.prismaService.comment.create({
        data: {
          content: commentData.content,
          author: { connect: { id: commentData.authorId } },
          post: { connect: { id: commentData.postId } },
          parentComment: commentData.parentCommentId
            ? {
                connect: {
                  id: commentData.parentCommentId,
                },
              }
            : undefined,
        },
      });

      const newCommentDto = new CommentsDto();
      newCommentDto.id = newComment.id;
      newCommentDto.content = newComment.content;
      newCommentDto.createdAt = newComment.createdAt;
      newCommentDto.updatedAt = newComment.updatedAt;
      newCommentDto.authorId = newComment.authorId;
      newCommentDto.postId = newComment.postId;
      newCommentDto.parentCommentId = newComment.parentCommentId;
      newCommentDto.childComments = [];

      return newCommentDto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async getAllCommentsOfAPost(postId: string): Promise<CommentsDto[]> {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: {
          postId,
        },
        include: {
          childComments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
            },
          },
        },
      });

      if (!comments || comments.length === 0) {
        throw new NotFoundException(
          `No comments found for post with id ${postId}`,
        );
      }

      return comments;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getCommentById(commentId: string): Promise<CommentsDto> {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          childComments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
            },
          },
        },
      });

      if (!comment) {
        throw new NotFoundException(`Comment with id ${commentId} not found`);
      }
      return comment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateComment(
    commentId: string,
    userId: string,
    commentData: UpdateCommentDto,
  ): Promise<CommentsDto> {
    try {
      const updatedComment = await this.prismaService.comment.update({
        where: {
          id: commentId,
          authorId: userId,
        },
        data: {
          content: commentData.content,
        },
        include: {
          childComments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
            },
          },
        },
      });

      if (!updatedComment) {
        throw new NotFoundException(
          `Comment with id ${commentId} not found or you are not authorized to update this comment`,
        );
      }
      return updatedComment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      await this.prismaService.comment.update({
        where: {
          id: commentId,
          authorId: userId,
        },
        data: {
          content: 'Comment is deleted',
        }, // set content to 'Comment is deleted' to mark comment as deleted
        include: {
          childComments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
