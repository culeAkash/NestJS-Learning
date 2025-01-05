import { Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { LikesService } from './likes.service';

@Controller('/api/likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Post('/updateLikeStatus/:postId')
  async likeUnlikePost(
    @Param('postId') postId: string,
    @Res() response: Response,
    @CurrentUser() user: UserDto,
  ) {
    try {
      const userId = user.id;
      this.likesService.updateLikeStatus(userId, postId);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update like status');
    }
  }
}
