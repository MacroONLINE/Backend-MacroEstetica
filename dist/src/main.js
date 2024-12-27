"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const express = require("express");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    logger.log('Inicializando aplicación...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
        logger: ['log', 'error', 'warn', 'debug'],
    });
    app.use('/payment/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
        req['rawBody'] = req.body;
        console.log('RawBody recibido:', req['rawBody']);
        console.log('Es Buffer:', Buffer.isBuffer(req['rawBody']));
        next();
    });
    logger.log('Middleware raw configurado para /payment/webhook.');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    logger.log('Middleware JSON y URL-encoded habilitados.');
    app.enableCors();
    logger.log('CORS habilitado.');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Documentación de la API')
        .setDescription('Documentación de la API para la aplicación')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    logger.log('Swagger configurado en /api-docs.');
    await app.listen(3001);
    logger.log('Aplicación escuchando en http://localhost:3001');
}
bootstrap();
//# sourceMappingURL=main.js.map