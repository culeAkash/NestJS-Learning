import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';

import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('api/auth/')
export class AuthGuardController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(body);

    await this.authService.loginWithCredentials(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logout successful' });
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(body);

    await this.authService.loginWithCredentials(user, res);
  }
}
