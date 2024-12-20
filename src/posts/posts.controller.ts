import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { FileTypeValidationPipe } from './file-types-validation.pipe';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { PostService } from './posts.service';
import path from 'path';

function getValidExtensions(): string[] {
  const extensions = (process.env.VALID_EXTENSIONS || '.*').split(',');
  //   console.log(extensions);

  return extensions;
}

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (getValidExtensions().includes(ext)) {
          cb(null, true); // Accept file
        } else {
          cb(new BadRequestException(`Unsupported file type: ${ext}`), false); // Reject file
        }
      },
    }),
  )
  async createPost(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
    @Body() body,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
          message: 'File size should not exceed 5MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
      new FileTypeValidationPipe(),
    )
    images: Array<Express.Multer.File>,
  ) {
    const createPostDto = new CreatePostDto();
    createPostDto.title = body.title;
    createPostDto.content = body.content;
    createPostDto.authorId = user.id;
    createPostDto.published = body.published === 'true' ? true : false || true;

    try {
      const newPost = await this.postService.createNewPost(
        createPostDto,
        images,
        user.id,
      );
      response.status(HttpStatus.CREATED).json(newPost);
    } catch (error) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  }

  @Get()
  async getAllPosts(@Res() response: Response) {
    try {
      const allPosts = await this.postService.getAllPosts();
      response.json(allPosts);
    } catch (error) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  }

  @Get('/user/:userId')
  @UseGuards(JwtAuthGuard)
  async getPostsByUserId(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    try {
      const postsByUserId = await this.postService.getPostsByUserId(userId);
      response.json(postsByUserId);
    } catch (error) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  }

  @Get('getPostsByCurrentUser')
  @UseGuards(JwtAuthGuard)
  async getPostsByCurrentUser(
    @CurrentUser() user: UserDto,
    @Res() response: Response,
  ) {
    try {
      const postsByUserId = await this.postService.getPostsByUserId(user.id);
      response.json(postsByUserId);
    } catch (error) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  }

  @Patch('/:postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @CurrentUser() user: UserDto,
    @Param('postId') postId: string,
    @Res() response: Response,
    @Body() body: UpdatePostDto,
  ) {
    try {
      const userId = user.id;
      const updatedPost = await this.postService.updatePost(
        postId,
        userId,
        body,
      );
      response.json(updatedPost);
    } catch (error) {}
  }

  @Delete('/:postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @CurrentUser() user: UserDto,
    @Param('postId') postId: string,
    @Res() response: Response,
  ) {
    try {
      const userId = user.id;
      await this.postService.deletePost(postId, userId);
      response.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
    }
  }
}
