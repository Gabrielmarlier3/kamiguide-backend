import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  configureValidationPipe(app);

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;
  logger.log(`App:     http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/api`);
}

function configureSwagger(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const config = new DocumentBuilder()
    .setTitle('API Kamiguide')
    .setDescription('Documentação da API Kamiguide')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // app.enableCors({
  //   origin: '*',
  //   credentials: true,
  // });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
}

void bootstrap();
