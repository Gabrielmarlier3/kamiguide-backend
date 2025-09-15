import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Kamiguide')
    .setDescription('Documentação da API Kamiguide')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;
  logger.log(`App:     http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/api`);
  logger.log('NODE_OPTIONS=', process.env.NODE_OPTIONS);
  logger.log('JINKAN_BASE_URL=', process.env.JINKAN_BASE_URL);
}

void bootstrap();
