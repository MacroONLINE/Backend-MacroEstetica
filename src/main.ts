import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('🚀 Inicializando aplicación...');

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: ['log', 'error', 'warn', 'debug'],
  });

  app.use(morgan('dev'));

  app.use(
    '/payment/webhook',
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
      req['rawBody'] = req.body;
      console.log('✅ RawBody recibido en /payment/webhook:', req['rawBody']);
      next();
    },
  );
  logger.log('✅ Middleware raw configurado para /payment/webhook.');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  logger.log('✅ Middleware JSON y URL-encoded habilitados.');

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  logger.log('✅ CORS habilitado.');

  app.useWebSocketAdapter(new IoAdapter(app));
  logger.log('✅ WebSocket Adapter configurado.');

  const config = new DocumentBuilder()
    .setTitle('📖 Documentación de la API')
    .setDescription('API para la aplicación con soporte WebSockets')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  logger.log('✅ Swagger configurado en /api-docs.');

  await app.listen(3010, '0.0.0.0');
  logger.log('🚀 Aplicación escuchando en http://localhost:3010');
  logger.log('📡 WebSocket activo en ws://localhost:3010');
}

bootstrap();
