import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { Response } from 'express';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Implement CRUD operations for comments here
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @CurrentUser() user: UserDto,
    @Body() commentData: CreateCommentDto,
    @Res() response: Response,
  ) {
    try {
      if (!commentData.authorId || user.id !== commentData.authorId) {
        throw new ForbiddenException(
          'You are not authorized to create this comment',
        );
      }
      const newComment = await this.commentsService.createComment(commentData);
      return response.status(HttpStatus.CREATED).json(newComment);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/getAllCommentsOfPost')
  @UseGuards(JwtAuthGuard)
  async getAllCommentsOfPost(
    @Res() response: Response,
    @Query('postId') postId: string,
  ) {
    try {
      const comments = await this.commentsService.getAllCommentsOfAPost(postId);
      return response.status(HttpStatus.OK).json(comments);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/getCommentById')
  @UseGuards(JwtAuthGuard)
  async getCommentByCommentId(
    @Res() response: Response,
    @Query('commentId') commentId: string,
  ) {
    try {
      const comments = await this.commentsService.getCommentById(commentId);
      return response.status(HttpStatus.OK).json(comments);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/updateComment')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Res() response: Response,
    @Body() commentData: UpdateCommentDto,
    @Query('commentId') commentId: string,
    @CurrentUser() user: UserDto,
  ) {
    try {
      const updatedComment = await this.commentsService.updateComment(
        commentId,
        user.id,
        commentData,
      );
      return response.status(HttpStatus.OK).json(updatedComment);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/deleteComment')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Res() response: Response,
    @Query('commentId') commentId: string,
    @CurrentUser() user: UserDto,
  ) {
    try {
      const deletedComment = await this.commentsService.deleteComment(
        commentId,
        user.id,
      );
      return response.status(HttpStatus.OK).json(deletedComment);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
