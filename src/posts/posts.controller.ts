import {
  Body,
  Controller,
  ParseFilePipeBuilder,
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
import { CreatePostDto } from './dto/posts.dto';
import { FileTypeValidationPipe } from './file-types-validation.pipe';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Controller('/api/posts')
export class PostController {
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4, {}))
  async createPost(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
    @Body() body: CreatePostDto,
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
    // console.log(images);
    // const imageBuffers = images.map((image) => image.buffer.toString());
    response.status(201).json({
      message: 'Post created successfully',
      imageStirngs: images.length,
    });
  }
}
