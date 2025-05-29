import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from 'package.json';
import { ValidationPipe } from '@nestjs/common';

const documentConfig = new DocumentBuilder()
  .setTitle("Project Management API")
  .setVersion(version)
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('NESTJS_PORT') || 3000;

  app.enableCors({
    origin: configService.get('FRONTEND_URL') || "http://localhost:5000",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log(`starting nestjs at port ${port} ...`);

  await app.listen(port);
}
bootstrap();
