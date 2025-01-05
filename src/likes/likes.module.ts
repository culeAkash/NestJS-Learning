import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsModule } from 'src/posts/posts.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [PostsModule],
  controllers: [LikesController],
  providers: [PrismaService, LikesService],
  exports: [LikesService],
})
export class LikesModule {}
