import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignInDto, SignUpDto, AuthResponseDto, UserResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error or user already exists' 
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Sign in successful',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid credentials' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.userService.signIn(signInDto);
  }
}