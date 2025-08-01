import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 1000,
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI') || 
                         process.env.MONGODB_URI || 
                         'mongodb://localhost:27017/test'; // Fallback for development
        
        console.log('MongoDB URI exists:', !!mongoUri);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        if (!mongoUri || mongoUri === 'mongodb://localhost:27017/test') {
          console.warn('Using fallback MongoDB URI. Make sure MONGODB_URI is set in production.');
        }
        
        return {
          uri: mongoUri,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
      inject: [ConfigService],
    }),
    
    UserModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}