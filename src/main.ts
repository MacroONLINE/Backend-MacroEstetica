import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Deshabilitar bodyParser solo para el webhook
  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  // Habilitar bodyParser para otros endpoints
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await app.listen(3001);
  console.log(`Aplicación escuchando en http://localhost:3001`);
}
bootstrap();
