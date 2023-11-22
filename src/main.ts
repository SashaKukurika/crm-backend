import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { AppModule } from './app.module';

// ?? check if parameter is null or undefine
const environment = process.env.NODE_ENV ?? '';
dotenv.config({ path: `environments/${environment}.env` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CRM for online courses')
    .setDescription('The CRM API description')
    .setContact(
      'Sasha Kukurika',
      'https://www.linkedin.com/in/sasha-kukurika-ab452618a/',
      'kukurika.sasha@gmail.com',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('crm/api', app, document);

  app.enableCors({
    origin: process.env.FRONT_CORS_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
}
bootstrap();
