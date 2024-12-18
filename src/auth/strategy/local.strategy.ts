import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserLogin } from '../dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate({ identifier, password }: UserLogin) {
    console.log(identifier, password);

    const user = this.authService.validateCredentials({ identifier, password });
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    return user;
  }
}
