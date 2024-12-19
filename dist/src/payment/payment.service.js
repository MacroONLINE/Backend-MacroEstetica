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
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentService = class PaymentService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-11-20.acacia',
        });
    }
    async createCheckoutSession(courseId, userId) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new common_1.HttpException('El curso no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const priceInCents = Math.round(course.price * 100);
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
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        return session;
    }
    async handleWebhookEvent(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.HttpException(`Webhook signature verification failed: ${err.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':
                const session = event.data.object;
                const { userId, courseId } = session.metadata || {};
                if (!userId || !courseId) {
                    console.error('Faltan metadata en la sesión de Stripe. No se puede procesar el pago.');
                    return { received: true };
                }
                await this.prisma.transaction.create({
                    data: {
                        stripePaymentIntentId: session.payment_intent,
                        stripeCheckoutSessionId: session.id,
                        status: session.payment_status,
                        amount: session.amount_total / 100,
                        currency: session.currency,
                        userId,
                        courseId,
                        responseData: session,
                    },
                });
                await this.prisma.courseEnrollment.create({
                    data: {
                        userId,
                        courseId,
                        enrolledAt: new Date(),
                    },
                });
                console.log('Usuario inscrito y transacción registrada:', { userId, courseId });
                break;
            case 'checkout.session.async_payment_failed':
                const failedSession = event.data.object;
                console.error('El pago diferido falló:', failedSession);
                break;
            default:
                console.log(`Evento no manejado: ${event.type}`);
        }
        return { received: true };
    }
    async createCompanySubscription(empresaId, subscriptionType) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { type: subscriptionType },
        });
        if (!subscription) {
            throw new common_1.HttpException('El tipo de suscripción no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const empresaSubscription = await this.prisma.empresaSubscription.create({
            data: {
                empresaId,
                subscriptionId: subscription.id,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                status: 'active',
            },
        });
        return empresaSubscription;
    }
    async renewSubscriptions() {
        const now = new Date();
        const expiredSubscriptions = await this.prisma.empresaSubscription.findMany({
            where: {
                endDate: { lte: now },
                status: 'active',
            },
        });
        for (const sub of expiredSubscriptions) {
            await this.prisma.empresaSubscription.update({
                where: { id: sub.id },
                data: {
                    startDate: now,
                    endDate: new Date(now.setMonth(now.getMonth() + 1)),
                },
            });
        }
    }
    async createSubscriptionSession(empresaId, subscriptionType) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { type: subscriptionType },
        });
        if (!subscription) {
            throw new common_1.HttpException('El tipo de suscripción no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        recurring: { interval: 'month' },
                        unit_amount: Math.round(subscription.price * 100),
                        product_data: {
                            name: subscription.type,
                            description: subscription.description,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                empresaId,
                subscriptionType,
            },
            success_url: `${this.configService.get('APP_URL')}/subscription/success`,
            cancel_url: `${this.configService.get('APP_URL')}/subscription/cancel`,
        });
        return session;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map