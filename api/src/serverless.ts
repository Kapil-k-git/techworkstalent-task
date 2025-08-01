import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: NestExpressApplication;

const createApp = async (): Promise<NestExpressApplication> => {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    const expressApp = express();
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressApp),
      { 
        logger: false // Disable logging to avoid issues
      }
    );

    // Simple CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Simple validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    await app.init();
    cachedApp = app;
    return app;
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
};

// Serverless function handler
export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};