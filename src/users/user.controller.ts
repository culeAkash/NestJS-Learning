import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers(@Res() response: Response) {
    const allUsers = await this.userService.getAllUsers();
    console.log(allUsers);
    return response.status(200).json(allUsers);
  }

  @Get('/userId/:userId')
  async getUserById(
    @Res() response: Response,
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.getUserByUserId(userId);
    console.log(user);
    return response.status(200).json(user);
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
}
