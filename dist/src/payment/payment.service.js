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
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                userId,
                courseId,
                checkoutSessionId: session.id,
            },
        });
        this.logger.log(`Sesión de checkout creada: ${JSON.stringify(session)}`);
        return session;
    }
    async createCompanySubscriptionCheckoutSession(empresaId, userId, subscriptionType, email) {
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
            metadata: {
                empresaId,
                userId,
                subscriptionType,
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/subscription/success`,
            cancel_url: `${this.configService.get('APP_URL')}/subscription/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                empresaId,
                userId,
                subscriptionType,
                checkoutSessionId: session.id,
            },
        });
        this.logger.log(`Sesión de suscripción creada: ${JSON.stringify(session)}`);
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
        const webhookSecret = "whsec_O31crSeRM1gXmwuFgrgEpvijVGDnpUqW";
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
            throw new common_1.HttpException('Webhook signature verification failed', common_1.HttpStatus.BAD_REQUEST);
        }
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                this.logger.debug(`Metadata de la sesión: ${JSON.stringify(session.metadata)}`);
                await this.processTransaction(session);
                break;
            }
            case 'payment_intent.succeeded': {
                const intent = event.data.object;
                if (intent.metadata?.checkoutSessionId) {
                    this.logger.debug(`Metadata del intent: ${JSON.stringify(intent.metadata)}`);
                    const session = await this.stripe.checkout.sessions.retrieve(intent.metadata.checkoutSessionId);
                    await this.processTransaction(session);
                }
                else {
                    this.logger.warn('No se encontró checkoutSessionId en los metadatos del intent.');
                }
                break;
            }
            default:
                this.logger.warn(`Evento no manejado: ${event.type}`);
        }
        return { received: true };
    }
    async processTransaction(session) {
        const { metadata, payment_intent, amount_total, currency, status } = session;
        this.logger.debug(`Procesando transacción con metadata: ${JSON.stringify(metadata)}`);
        const userId = metadata.userId;
        const courseId = metadata.courseId;
        const empresaId = metadata.empresaId;
        const subscriptionType = metadata.subscriptionType;
        if (!userId && !empresaId) {
            this.logger.error('El ID del usuario o empresa no está presente en los metadatos.');
            throw new common_1.HttpException('El ID del usuario o empresa no está presente en los metadatos.', common_1.HttpStatus.BAD_REQUEST);
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                stripePaymentIntentId: payment_intent,
                stripeCheckoutSessionId: session.id,
                amount: amount_total / 100,
                currency,
                status,
                userId,
                courseId: courseId || null,
                responseData: session,
            },
        });
        if (empresaId && subscriptionType) {
            await this.createEmpresaSubscription(empresaId, subscriptionType, transaction.id);
        }
        else if (courseId) {
            await this.enrollUserInCourse(userId, courseId, transaction.id);
        }
        this.logger.log(`Transacción procesada con éxito para sesión ${session.id}`);
    }
    async createEmpresaSubscription(empresaId, subscriptionType, transactionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { type: subscriptionType },
        });
        if (!subscription) {
            throw new common_1.HttpException('Tipo de suscripción no válido', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.empresaSubscription.create({
            data: {
                empresaId,
                subscriptionId: subscription.id,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                status: 'active',
            },
        });
        this.logger.log(`Suscripción ${subscriptionType} creada para empresa ${empresaId}`);
    }
    async enrollUserInCourse(userId, courseId, transactionId) {
        await this.prisma.courseEnrollment.create({
            data: {
                userId,
                courseId,
            },
        });
        this.logger.log(`Usuario ${userId} inscrito en el curso ${courseId}`);
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