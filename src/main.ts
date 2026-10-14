import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  const allowedOrigins = [
    'http://localhost:3000',
    process.env.APP_FRONT_URL,
  ].filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();

// old start package.json
// "start": "cross-env NODE_ENV=prod nest start",
// "start:production": "node dist/main",
//"prebuild": "rimraf dist",
