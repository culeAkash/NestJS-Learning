import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcryptjs from 'bcryptjs';
import { UserLogin } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateCredentials({ identifier, password }: UserLogin): Promise<any> {
    console.log(identifier, password);

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
            name: identifier,
          },
        ],
      },
    });

    console.log(user);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async loginWithCredentials({ identifier }: UserLogin) {
    const payload = { identifier };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
