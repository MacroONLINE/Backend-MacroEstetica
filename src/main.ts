import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  // Crear la aplicación sin análisis automático del cuerpo (bodyParser: false)
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  // Configurar el raw body en la ruta del webhook de Stripe
  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Documentación de la API')
    .setDescription('Documentación de la API para la aplicación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
