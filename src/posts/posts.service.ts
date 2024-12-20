import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto, PostDto, UpdatePostDto } from './dto/posts.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as fs from 'fs';
import * as path from 'path';

function getDestPath(): string {
  return process.env.DEST_PATH || 'uploads';
}

function createOrGetDirectory(): string {
  const uploadDir = __dirname + `/${getDestPath()}/`;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

@Injectable()
export class PostService {
  private readonly uploadDir = createOrGetDirectory();

  constructor(private readonly prismaService: PrismaService) {
    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async createNewPost(
    postData: CreatePostDto,
    images: Array<Express.Multer.File>,
    userId: string,
  ): Promise<any> {
    // upload images
    // Create a unique filename and save
    const imageUrls: string[] = [];
    images.forEach((image) => {
      const uniqueFileName = `${Date.now()}-${image.originalname}`;
      const filePath = path.join(this.uploadDir, uniqueFileName);
      try {
        fs.writeFileSync(filePath, image.buffer);
        imageUrls.push(uniqueFileName);
      } catch (error) {
        throw new BadRequestException('File upload failed.');
      }
    });
    try {
      // console.log(postData);

      const newPost = await this.prismaService.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          published: postData.published,
          author: {
            connect: {
              id: userId,
            },
          },
          postImages: {
            createMany: {
              data: imageUrls.map((image) => {
                return {
                  imageUrl: image,
                };
              }),
            },
          },
        },
        include: {
          postImages: {
            select: {
              imageUrl: true,
              id: true,
            },
          },
        },
      });
      return newPost;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Post creation failed.');
    }
  }

  async getAllPosts(): Promise<PostDto[]> {
    try {
      const allPostsData: PostDto[] = await this.prismaService.post.findMany({
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          postImages: {
            select: {
              imageUrl: true,
              id: true,
            },
          },
        },
      });
      return allPostsData;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Failed to retrieve all posts.');
    }
  }

  async getPostsByUserId(userId: string): Promise<PostDto[]> {
    try {
      const postsByUserId = await this.prismaService.post.findMany({
        where: {
          authorId: userId,
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          postImages: {
            select: {
              imageUrl: true,
              id: true,
            },
          },
        },
      });
      return postsByUserId;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Failed to retrieve posts by user ID.');
    }
  }

  async updatePost(
    postId: string,
    userId: string,
    postData: UpdatePostDto,
  ): Promise<PostDto> {
    try {
      const updatedPost = await this.prismaService.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: {
          title: postData.title,
          content: postData.content,
          published: postData.published,
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          postImages: {
            select: {
              imageUrl: true,
              id: true,
            },
          },
        },
      });
      return updatedPost;
    } catch (error) {
      throw new BadRequestException('Failed to update post.');
    }
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    try {
      const imageUrls = await this.prismaService.post.findMany({
        where: {
          id: postId,
        },
        select: {
          postImages: {
            select: {
              imageUrl: true,
            },
          },
        },
      });
      await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId,
        },
      });

      imageUrls[0].postImages.forEach((image) => {
        const filePath = path.join(this.uploadDir, image.imageUrl);
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to delete post.');
    }
  }
}
