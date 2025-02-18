import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [PostService],
})
export class PostsModule {}
