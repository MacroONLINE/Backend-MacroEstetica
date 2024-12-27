import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Inicializando aplicación...');

  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Deshabilita el bodyParser predeterminado de NestJS
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // Middleware personalizado para capturar el rawBody solo en /payment/webhook
  app.use('/payment/webhook', (req, res, next) => {
    express.raw({ type: 'application/json' })(req, res, (err) => {
      if (err) {
        next(err);
      } else {
        req['rawBody'] = req.body;
        next();
      }
    });
  });
  logger.log('Middleware raw configurado para /payment/webhook.');

  // Middleware para JSON y URL-encoded para el resto de las rutas
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  logger.log('Middleware JSON y URL-encoded habilitados.');

  app.enableCors();
  logger.log('CORS habilitado.');

  const config = new DocumentBuilder()
    .setTitle('Documentación de la API')
    .setDescription('Documentación de la API para la aplicación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  logger.log('Swagger configurado en /api-docs.');

  await app.listen(3001);
  logger.log('Aplicación escuchando en http://localhost:3001');
}

bootstrap();
