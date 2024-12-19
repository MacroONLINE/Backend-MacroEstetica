"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createCheckoutSession(courseId, userId) {
        if (!courseId || !userId) {
            throw new common_1.HttpException('courseId y userId son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        const session = await this.paymentService.createCheckoutSession(courseId, userId);
        return { url: session.url };
    }
    async handleWebhook(signature, req, res) {
        if (!signature) {
            return res.status(400).send('Falta el encabezado stripe-signature');
        }
        try {
            const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
            res.status(200).send(result);
        }
        catch (error) {
            console.error('Error en Webhook:', error.message);
            res.status(400).send(`Error en Webhook: ${error.message}`);
        }
    }
    async createCompanySubscription(empresaId, subscriptionType) {
        if (!empresaId || !subscriptionType) {
            throw new common_1.HttpException('empresaId y subscriptionType son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        const subscription = await this.paymentService.createCompanySubscription(empresaId, subscriptionType);
        return { message: 'Suscripción creada exitosamente', subscription };
    }
    async createSubscriptionSession(empresaId, subscriptionType) {
        if (!empresaId || !subscriptionType) {
            throw new common_1.HttpException('empresaId y subscriptionType son requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        const session = await this.paymentService.createSubscriptionSession(empresaId, subscriptionType);
        return { url: session.url };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una sesión de checkout de Stripe para un curso' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                courseId: { type: 'string', description: 'ID del curso' },
                userId: { type: 'string', description: 'ID del usuario' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error en los parámetros proporcionados.' }),
    __param(0, (0, common_1.Body)('courseId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint para recibir notificaciones de Stripe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Confirma que el webhook fue recibido.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al procesar el webhook.' }),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('company-subscription'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una suscripción para una empresa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                empresaId: { type: 'string', description: 'ID de la empresa' },
                subscriptionType: { type: 'string', description: 'Tipo de suscripción (ORO, PLATA, BRONCE)' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Suscripción creada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al crear la suscripción.' }),
    __param(0, (0, common_1.Body)('empresaId')),
    __param(1, (0, common_1.Body)('subscriptionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCompanySubscription", null);
__decorate([
    (0, common_1.Post)('subscription-session'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una sesión de Stripe para suscripciones empresariales' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                empresaId: { type: 'string', description: 'ID de la empresa' },
                subscriptionType: { type: 'string', description: 'Tipo de suscripción (ORO, PLATA, BRONCE)' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error en los parámetros proporcionados.' }),
    __param(0, (0, common_1.Body)('empresaId')),
    __param(1, (0, common_1.Body)('subscriptionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createSubscriptionSession", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map