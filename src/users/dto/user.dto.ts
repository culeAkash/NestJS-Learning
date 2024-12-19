import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  name: string;
  @IsEmail(undefined, {
    message: 'Email is invalid',
  })
  email: string;
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}

export class UpdateUserDto {
  name: string;
  @IsEmail(undefined, {
    message: 'Email is invalid',
  })
  email: string;
}

export class UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
