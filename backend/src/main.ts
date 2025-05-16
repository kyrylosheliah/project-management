import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('NESTJS_PORT') || 3000;

  console.log(`starting nestjs at port ${port} ...`);

  await app.listen(port);
}
bootstrap();
