import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  // Inicializa la aplicación
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Configuración del middleware raw solo para el webhook
  app.use('/payment/webhook', express.raw({ type: 'application/json' }));

  // Habilitar bodyParser para el resto de los endpoints
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Habilitar CORS
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentación de la API')
    .setDescription('Documentación de la API para la aplicación')
    .setVersion('1.0')
    .addBearerAuth() // Agregar autenticación Bearer para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Iniciar el servidor
  await app.listen(3001);
  console.log('Aplicación escuchando en http://localhost:3001');
}

bootstrap();