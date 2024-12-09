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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = require("stripe");
let PaymentService = class PaymentService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-11-20.acacia',
        });
    }
    async createCheckoutSession(courseId, userId) {
        try {
            console.log('courseId recibido en PaymentService:', courseId);
            console.log('userId recibido en PaymentService:', userId);
            const course = await this.prisma.course.findUnique({ where: { id: courseId } });
            if (!course) {
                console.error('Curso no encontrado con ID:', courseId);
                throw new common_1.HttpException('Curso no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            console.log('Curso encontrado:', course);
            const priceInCents = Math.round(course.price * 100);
            console.log('Precio en centavos:', priceInCents);
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            unit_amount: priceInCents,
                            product_data: {
                                name: course.title,
                                images: [course.courseImageUrl],
                                description: course.description,
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId,
                    courseId,
                },
                success_url: `${this.configService.get('APP_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
            });
            console.log('Sesión de Stripe creada:', session);
            return session;
        }
        catch (error) {
            console.error('Error al crear la sesión de Stripe:', error.message);
            throw new common_1.HttpException('Error al crear la sesión de Stripe', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleWebhookEvent(signature, payload) {
        const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        }
        catch (err) {
            console.error('Error al validar la firma del webhook:', err.message);
            throw new common_1.HttpException(`Webhook signature verification failed: ${err.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { userId, courseId } = session.metadata || {};
            if (!userId || !courseId) {
                console.error('Falta metadata en la sesión de Stripe. No se puede procesar el webhook.');
                return { received: true };
            }
            console.log('Procesando inscripción para userId:', userId, 'courseId:', courseId);
            try {
                await this.prisma.courseEnrollment.create({
                    data: {
                        userId,
                        courseId,
                        enrolledAt: new Date(),
                    },
                });
                console.log('Usuario inscrito en el curso:', { userId, courseId });
            }
            catch (error) {
                console.error('Error al inscribir al usuario:', error.message);
                throw new common_1.HttpException('Error al procesar la inscripción', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return { received: true };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map