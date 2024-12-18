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

export class UserDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
