import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SRM for online courses')
    .setDescription('The SRM API description')
    .setVersion('1.0')
    .addTag('srm')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('srm/api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
