import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerDocument from './docs/swagger.json';
import * as swaggerUi from 'swagger-ui-express';
import { setupSwagger } from './config/swagger.config';
import { existsSync, mkdirSync } from 'fs';

export const UPLOAD_BASE_PATH =
  process.env.NODE_ENV === 'production'
    ? '/app/uploads'
    : join(process.cwd(), 'uploads'); 

export function ensureUploadDirs() {
  const dirs = [
    UPLOAD_BASE_PATH,
    join(UPLOAD_BASE_PATH, 'users'),
    join(UPLOAD_BASE_PATH, 'documents'),
    join(UPLOAD_BASE_PATH, 'promotions'),
    join(UPLOAD_BASE_PATH, 'blogs'),
    join(UPLOAD_BASE_PATH, 'currency'),

  ];

  for (const dir of dirs) {
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log('Created upload dir:', dir);
      }
    } catch (err) {
      console.error('Failed to create dir:', dir, err);
    }
  }
}

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(bodyParser.json({ limit: '10mb' })); 
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors({   // allows all origins
    // origin: [
    //   "http://localhost:3000",
    //   "http://127.0.0.1:3000",
    //   "http://127.0.0.1:3001",
    //   'http://localhost:3001',
    //   "http://127.0.0.1:3000",
    //   "http://127.0.0.1:3002",
    //   'http://localhost:3002',
    //   "http://127.0.0.1:3000",
    //   "http://127.0.0.1:3003",
    //   'http://localhost:3003',
    //   'https://j1.playrise.vip',
    // ],
    origin : true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  });

  ensureUploadDirs()


if (!existsSync(UPLOAD_BASE_PATH)) {
  mkdirSync(UPLOAD_BASE_PATH, { recursive: true });
}

  // Enable CORS for your frontend domain
  // app.enableCors({
  //   origin: 'http://localhost:3001', // frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true, // if you need cookies/auth headers
  // });

  // Use PORT from environment (set by Coolify), fallback to 3000
  //   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads',
  // });
    app.use(
  '/uploads',
  express.static(UPLOAD_BASE_PATH)
);

  //swagger
          setupSwagger(app);
   // Load existing swagger.json
  //  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
