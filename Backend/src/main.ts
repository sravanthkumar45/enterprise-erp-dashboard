import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable absolute validation rules across all incoming requests
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Strips away undocumented properties automatically
    forbidNonWhitelisted: true // Rejects requests entirely if someone passes malicious keys
  }));

  app.enableCors();
  await app.listen(3000);
}
bootstrap();