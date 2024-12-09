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
    async createCheckoutSession(body) {
        const { courseId, userId } = body;
        console.log('Cuerpo recibido:', body);
        if (!courseId) {
            throw new common_1.HttpException('courseId es requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!userId) {
            throw new common_1.HttpException('userId es requerido', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const session = await this.paymentService.createCheckoutSession(courseId, userId);
            return { url: session.url };
        }
        catch (error) {
            console.error('Error en createCheckoutSession:', error.message);
            throw new common_1.HttpException('Error al crear la sesión de Stripe', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleWebhook(signature, req, res) {
        console.log('Webhook recibido con firma:', signature);
        if (!signature) {
            return res.status(400).send('Falta el header stripe-signature');
        }
        try {
            const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
            res.status(200).send(result);
        }
        catch (error) {
            console.error('Error en el webhook:', error.message);
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una sesión de checkout de Stripe para un curso' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                courseId: { type: 'string', description: 'ID del curso que el usuario desea comprar' },
                userId: { type: 'string', description: 'ID del usuario que realiza la compra' },
            },
            required: ['courseId', 'userId'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Falta el courseId o el userId.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Endpoint para recibir notificaciones (webhooks) de Stripe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Confirma que el webhook se recibió correctamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al procesar el webhook.' }),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map