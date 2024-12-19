import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('api/users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Res() response: Response) {
    // console.log(user);

    const allUsers = await this.userService.getAllUsers();
    // console.log(allUsers);
    return response.status(200).json(allUsers);
  }

  @Post('/create')
  async createUser(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    // console.log(createUserDto);

    const userCreated = await this.userService.createUser(createUserDto);
    // console.log(userCreated);

    return response.status(201).json(userCreated);
  }

  @Patch('/:userId')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: UserDto,
    @Param('userId') userId: string,
    @Res() response: Response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // console.log(user);

    if (user.id.toString() !== userId) {
      return response.status(403).json({ message: 'Forbidden' });
    }

    const updatedUser = await this.userService.updateUser(
      updateUserDto,
      userId,
    );

    return response.status(200).json(updatedUser);
  }
}
