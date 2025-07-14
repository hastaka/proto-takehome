// main.ts

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Strip properties not in the DTO
    forbidNonWhitelisted: true, // Throw an error if extra props are sent
    transform: true,           // Auto-transform payloads to DTO instances
  }));

  const config = new DocumentBuilder()
    .setTitle('Proto Takehome API')
    .setDescription('A simple, production-grade NestJS API for a basic task management system, supporting core operations around Projects and Tasks.<br>The API is modular, well-documented, and maintainable, using a relational database and ORM.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
