"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.use('/payment/webhook', express.raw({ type: 'application/json' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await app.listen(3001);
    console.log(`Aplicación escuchando en http://localhost:3001`);
}
bootstrap();
//# sourceMappingURL=main.js.map