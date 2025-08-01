import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    dotenv.config();
    
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    const port = process.env.PORT || 8080;
    
    // Fixed CORS configuration
    app.enableCors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like curl, Postman, mobile apps)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          // Add your production domains
          ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
        ];
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        
        // Allow all in development
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Accept',
        'Origin',
        'X-Requested-With',
        'sec-ch-ua',
        'sec-ch-ua-mobile',
        'sec-ch-ua-platform',
        'Referer',
        'User-Agent'
      ],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 200
    });
    
    // Simplified Helmet
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        xDownloadOptions: false,
      })
    );
    
    // Static assets (can remove if using Cloudinary)
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        skipMissingProperties: true,
      })
    );
    
    app.setGlobalPrefix('api');
    
    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('Movie API')
      .setDescription('Movie API Documentation with Essential Features')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Movies', 'Movie management endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server is listening on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS enabled for development`);
  } catch (err) {
    console.error('💥 Error in server startup:', err);
    process.exit(1);
  }
}

bootstrap();