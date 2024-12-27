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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(PaymentService_1.name);
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-11-20.acacia',
        });
    }
    async createCheckoutSession(courseId, userId, email) {
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
            customer_email: email,
            metadata: {
                userId,
                courseId,
            },
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        return session;
    }
    async createCompanySubscriptionCheckoutSession(empresaId, subscriptionType, email) {
        this.validateSubscriptionType(subscriptionType);
        const unitAmount = this.getSubscriptionPrice(subscriptionType);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        recurring: { interval: 'month' },
                        unit_amount: unitAmount,
                        product_data: {
                            name: `Suscripción ${subscriptionType}`,
                            description: `Suscripción ${subscriptionType} para empresa`,
                        },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: { empresaId, subscriptionType },
            success_url: `${this.configService.get('APP_URL')}/subscription/success`,
            cancel_url: `${this.configService.get('APP_URL')}/subscription/cancel`,
        });
        return session;
    }
    validateSubscriptionType(subscriptionType) {
        const validSubscriptionTypes = ['ORO', 'PLATA', 'BRONCE'];
        if (!validSubscriptionTypes.includes(subscriptionType)) {
            throw new common_1.HttpException(`Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    getSubscriptionPrice(subscriptionType) {
        const subscriptionPrices = {
            ORO: 2000,
            PLATA: 1200,
            BRONCE: 800,
        };
        return subscriptionPrices[subscriptionType];
    }
    async handleWebhookEvent(signature, payload) {
        const webhookSecret = 'whsec_6W5UG3Adau1bUdNXlEsp3lqVjfSSKidj';
        this.logger.log(`Secreto del webhook usado: ${webhookSecret}`);
        this.logger.debug(`Payload recibido: ${payload.toString('utf8')}`);
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            this.logger.log(`Evento recibido: ${event.type}`);
            this.logger.debug(`Evento completo: ${JSON.stringify(event)}`);
        }
        catch (err) {
            this.logger.error(`Error al verificar la firma del webhook: ${err.message}`);
            this.logger.error(`Tipo de payload: ${typeof payload}, Longitud: ${payload.length}`);
            throw new common_1.HttpException(`Webhook signature verification failed: ${err.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                this.logger.log('Pago completado con éxito');
                break;
            default:
                this.logger.warn(`Evento no manejado: ${event.type}`);
        }
        return { received: true };
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map