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
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentController = class PaymentController {
    constructor(paymentService, prisma) {
        this.paymentService = paymentService;
        this.prisma = prisma;
    }
    async createCheckoutSession(courseId, userId) {
        if (!courseId || !userId) {
            throw new common_1.HttpException('courseId and userId are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const session = await this.paymentService.createCheckoutSession(courseId, userId);
        return { url: session.url };
    }
    async handleWebhook(signature, req, res) {
        if (!signature) {
            return res.status(400).send('Missing stripe-signature header');
        }
        try {
            const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
            res.status(200).send(result);
        }
        catch (error) {
            console.error('Webhook Error:', error.message);
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
    async enrollUser(courseId, userId) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new common_1.HttpException('El curso no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const enrollment = await this.prisma.courseEnrollment.create({
            data: {
                userId,
                courseId,
                enrolledAt: new Date(),
            },
        });
        return { message: 'Inscripción registrada exitosamente', enrollment };
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
    (0, common_1.Post)('enroll'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar la inscripción de un usuario en un curso' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                courseId: { type: 'string', description: 'ID del curso' },
                userId: { type: 'string', description: 'ID del usuario' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario inscrito exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al registrar la inscripción.' }),
    __param(0, (0, common_1.Body)('courseId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "enrollUser", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        prisma_service_1.PrismaService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map