import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/users/dto/user.dto';
import bcryptjs from 'bcryptjs';
import { User } from '@prisma/client';

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

  async updateUser(user: UpdateUserDto, userId: string): Promise<UserDto> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        name: user.name,
        email: user.email,
        refreshToken: user.refreshToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!updatedUser) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
    return updatedUser;
  }

  async getAllUsers() {
    const users: UserDto[] = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // console.log(users);
    return users;
  }

  async getUserByIdentifier(identifier: string): Promise<User> {
    const userByUserId = await this.prismaService.user.findFirst({
      where: {
        OR: [{ name: identifier }, { email: identifier }],
      },
    });
    return userByUserId;
  }

  async getUserByUserId(userId: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
    return user;
  }
}
