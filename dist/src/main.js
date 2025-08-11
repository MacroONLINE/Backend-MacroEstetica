"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const express = require("express");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const morgan = require("morgan");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    logger.log('🚀 Inicializando aplicación...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
        logger: ['log', 'error', 'warn', 'debug'],
    });
    app.use(morgan('dev'));
    app.use('/payment/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
        req['rawBody'] = req.body;
        console.log('✅ RawBody recibido en /payment/webhook:', req['rawBody']);
        next();
    });
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
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    logger.log('✅ WebSocket Adapter configurado.');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('📖 Documentación de la API')
        .setDescription('API para la aplicación con soporte WebSockets')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    logger.log('✅ Swagger configurado en /api-docs.');
    await app.listen(3010, '0.0.0.0');
    logger.log('🚀 Aplicación escuchando en http://localhost:3010');
    logger.log('📡 WebSocket activo en ws://localhost:3010');
}
bootstrap();
//# sourceMappingURL=main.js.map