import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateLikeStatus(userId: string, postId: string): Promise<void> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      const userLikesPost = await this.prismaService.like.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      if (userLikesPost) {
        await this.prismaService.like.update({
          where: {
            id: userLikesPost.id,
          },
          data: {
            liked: !userLikesPost.liked,
          },
        });
      } else {
        await this.prismaService.like.create({
          data: {
            userId: userId,
            postId: postId,
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error updating like status');
    }
  }
}
