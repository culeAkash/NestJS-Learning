import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { UserLogin } from './dto/auth.dto';

@Controller('api/auth/')
export class AuthGuardController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() body: UserLogin) {
    // console.log(body);

    return this.authService.loginWithCredentials(body);
  }
}
