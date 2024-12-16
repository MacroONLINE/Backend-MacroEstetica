import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  console.log('Inicializando aplicación...');
  
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  console.log('Aplicación creada.');

  app.use('/payment/webhook', express.raw({ type: 'application/json' }));
  console.log('Middleware raw configurado para /payment/webhook.');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log('Middleware JSON y URL-encoded habilitados.');

  app.enableCors();
  console.log('CORS habilitado.');

  const config = new DocumentBuilder()
    .setTitle('Documentación de la API')
    .setDescription('Documentación de la API para la aplicación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  console.log('Swagger configurado en /api-docs.');

  await app.listen(3001);
  console.log('Aplicación escuchando en http://localhost:3001');
}


bootstrap();