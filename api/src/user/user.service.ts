import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './entities/user.entity';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userFound = await this.createUser({
      email,
      password: hashedPassword,
    });

    if (!userFound) {
      throw new NotFoundException('User Not Found');
    }

    return {
      message: 'user created successfully',
      userFound: {
        _id: userFound._id,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      },
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Find user by email
    const userFound = await this.findUserByEmail(email);
    if (!userFound) {
      throw new NotFoundException('User Not Found');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // Generate token
    const token = await this.generateToken(userFound);

    return {
      message: 'Sign in Successful',
      token,
    };
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }

  private async createUser(userData: { email: string; password: string }): Promise<UserDocument> {
    return await this.userModel.create(userData);
  }

  private async generateToken(user: UserDocument): Promise<string> {
    const secretKey = this.configService.get<string>('SECRETEKEY');
    if (!secretKey) {
      throw new Error('SECRETEKEY is not defined in environment variables');
    }

    return jwt.sign(
      { id: user._id },
      secretKey,
      { expiresIn: '1d' }
    );
  }

  async validateToken(token: string): Promise<any> {
    try {
      const secretKey = this.configService.get<string>('SECRETEKEY');
      if (!secretKey) {
        throw new Error('SECRETEKEY is not defined in environment variables');
      }
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}