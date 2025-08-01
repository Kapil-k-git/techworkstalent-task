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
    
    // CORS configuration
    app.enableCors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
        : ['http://localhost:3000'],
      credentials: true,
    });
    
    // Helmet security
    app.use(
      helmet({
        contentSecurityPolicy: false,
        xDownloadOptions: false,
      })
    );
    
    // Serve static files
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
    
    // Global validation pipe with class-validator & class-transformer
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // Allow unknown properties (for file uploads)
        transform: true, // Enable class-transformer
        transformOptions: {
          enableImplicitConversion: true, // Auto convert types
        },
        skipMissingProperties: true, // Skip validation for missing properties
      })
    );
    
    // Global prefix
    app.setGlobalPrefix('api');
    
    // Swagger documentation
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
    
    await app.listen(port);
    console.log(`🚀 Server is listening on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  } catch (err) {
    console.error('💥 Error in server startup:', err);
    process.exit(1);
  }
}

bootstrap();