import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UserDto } from 'src/users/dto/user.dto';
import bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<UserDto> {
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    const newUser = await this.prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    const newUserDto = new UserDto();
    newUserDto.id = newUser.id;
    newUserDto.name = newUser.name;
    newUserDto.email = newUser.email;
    newUserDto.createdAt = newUser.createdAt;
    newUserDto.updatedAt = newUser.updatedAt;

    return newUserDto;
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();
    console.log(users);
    return users;
  }

  async getUserByUserId(userId: string): Promise<CreateUserDto> {
    const userByUserId = await this.prismaService.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    return userByUserId as CreateUserDto;
  }
}
