"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_service_1 = require("./users/users.service");
const users_controller_1 = require("./users/users.controller");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const courses_module_1 = require("./courses/courses.module");
const products_module_1 = require("./products/products.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const payment_module_1 = require("./payment/payment.module");
const reset_password_module_1 = require("./reset-password/reset-password.module");
const empresa_module_1 = require("./empresa/empresa.module");
const banner_module_1 = require("./banner/banner.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            courses_module_1.CoursesModule,
            products_module_1.ProductsModule,
            cloudinary_module_1.CloudinaryModule,
            payment_module_1.PaymentModule,
            reset_password_module_1.ResetPasswordModule,
            empresa_module_1.EmpresaModule,
            banner_module_1.BannerModule
        ],
        controllers: [app_controller_1.AppController, users_controller_1.UsersController],
        providers: [app_service_1.AppService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map