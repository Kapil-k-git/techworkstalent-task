import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class SignUpDto extends SignInDto {}

export class AuthResponseDto {
  @ApiProperty({ example: 'Sign in Successful' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'user created successfully' })
  message: string;

  @ApiProperty()
  userFound: {
    _id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}