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
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
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
        this.logger.log(`Sesión de checkout (curso) creada: ${JSON.stringify(session)}`);
        return session;
    }
    async createCompanySubscriptionCheckoutSession(empresaId, userId, subscriptionType, email) {
        this.validateSubscriptionType(subscriptionType);
        const unitAmount = this.getSubscriptionPrice(subscriptionType);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
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
                }],
            customer_email: email,
            metadata: {
                checkoutSessionId: '',
            },
            subscription_data: {
                metadata: {
                    empresaId,
                    userId,
                    subscriptionType,
                },
            },
            success_url: `${this.configService.get('APP_URL')}/subscription/success`,
            cancel_url: `${this.configService.get('APP_URL')}/subscription/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                ...session.metadata,
                checkoutSessionId: session.id
            },
        });
        this.logger.log(`[createCompanySubscription] Sesión creada: ${session.id}`);
        this.logger.debug(`[createCompanySubscription] session.metadata: ${JSON.stringify(session.metadata)}`);
        return session;
    }
    async createUserUpgradeCheckoutSession(userId, email) {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new common_1.HttpException('El usuario no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        const unitAmount = 2000;
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
                            name: 'Suscripción de usuario: update',
                            description: 'Suscripción "update" para este usuario',
                        },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: {
                userId,
                subscriptionType: 'update',
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/user-subscription/success`,
            cancel_url: `${this.configService.get('APP_URL')}/user-subscription/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                userId,
                subscriptionType: 'update',
                checkoutSessionId: session.id,
            },
        });
        this.logger.log(`Sesión de suscripción (usuario - update) creada: ${JSON.stringify(session)}`);
        return session;
    }
    async createEventCheckoutSession(eventId, userId, email) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            throw new common_1.HttpException('El evento no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        if (typeof event.price !== 'number') {
            throw new common_1.HttpException('Este evento no tiene un precio definido', common_1.HttpStatus.BAD_REQUEST);
        }
        const priceInCents = Math.round(event.price * 100);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: priceInCents,
                        product_data: {
                            name: event.title,
                            description: event.longDescription ?? 'Evento especial',
                        },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: {
                userId,
                eventId,
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                userId,
                eventId,
                checkoutSessionId: session.id,
            },
        });
        return session;
    }
    async createWorkshopCheckoutSession(workshopId, userId, email) {
        const workshop = await this.prisma.workshop.findUnique({ where: { id: workshopId } });
        if (!workshop) {
            throw new common_1.HttpException('El workshop no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        if (typeof workshop.price !== 'number') {
            throw new common_1.HttpException('Este workshop no tiene un precio definido', common_1.HttpStatus.BAD_REQUEST);
        }
        const priceInCents = Math.round(workshop.price * 100);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: priceInCents,
                        product_data: {
                            name: workshop.title,
                            description: workshop.description,
                        },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: {
                userId,
                workshopId,
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                userId,
                workshopId,
                checkoutSessionId: session.id,
            },
        });
        return session;
    }
    async createClassroomCheckoutSession(classroomId, userId, email) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
        if (!classroom) {
            throw new common_1.HttpException('El classroom no existe', common_1.HttpStatus.BAD_REQUEST);
        }
        if (typeof classroom.price !== 'number') {
            throw new common_1.HttpException('Este classroom no tiene un precio definido', common_1.HttpStatus.BAD_REQUEST);
        }
        const priceInCents = Math.round(classroom.price * 100);
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: priceInCents,
                        product_data: {
                            name: classroom.title,
                            description: classroom.description ?? '',
                        },
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            metadata: {
                userId,
                classroomId,
                checkoutSessionId: '',
            },
            success_url: `${this.configService.get('APP_URL')}/payment/success`,
            cancel_url: `${this.configService.get('APP_URL')}/payment/cancel`,
        });
        await this.stripe.checkout.sessions.update(session.id, {
            metadata: {
                userId,
                classroomId,
                checkoutSessionId: session.id,
            },
        });
        return session;
    }
    async handleWebhookEvent(signature, payload) {
        this.logger.log(`🔔 [Webhook] Inicio de handleWebhookEvent`);
        let event;
        try {
            const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            this.logger.log(`✔️ [Webhook] Firma verificada — event.type=${event.type}`);
        }
        catch (err) {
            this.logger.error(`❌ [Webhook] Error al verificar firma: ${err.message}`);
            throw new common_1.HttpException('Stripe webhook signature verification failed', common_1.HttpStatus.BAD_REQUEST);
        }
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                this.logger.log(`🛒 [checkout.session.completed] session.id=${session.id}`);
                this.logger.debug(`📝 [checkout.session.completed] metadata: ${JSON.stringify(session.metadata)}`);
                await this.processTransaction(session);
                break;
            }
            case 'payment_intent.succeeded': {
                const intent = event.data.object;
                this.logger.log(`💳 [payment_intent.succeeded] intent.id=${intent.id}`);
                if (intent.metadata?.checkoutSessionId) {
                    this.logger.debug(`🔍 [payment_intent.succeeded] metadata: ${JSON.stringify(intent.metadata)}`);
                    const session = await this.stripe.checkout.sessions.retrieve(intent.metadata.checkoutSessionId);
                    this.logger.log(`🔄 [payment_intent.succeeded] Recuperada session.id=${session.id}`);
                    await this.processTransaction(session);
                }
                else {
                    this.logger.warn('⚠️ [payment_intent.succeeded] No hay checkoutSessionId en metadata');
                }
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                this.logger.log(`📄 [invoice.payment_succeeded] invoice.id=${invoice.id}`);
                if (!invoice.subscription) {
                    this.logger.warn('⚠️ [invoice.payment_succeeded] Invoice sin subscription, abortando.');
                    break;
                }
                const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription);
                this.logger.debug(`📝 [invoice.subscription] metadata: ${JSON.stringify(subscription.metadata)}`);
                const { empresaId, subscriptionType, userId } = subscription.metadata;
                if (!empresaId || !subscriptionType) {
                    this.logger.error('❌ [invoice.payment_succeeded] Metadata incompleta, no se crea renovación.');
                    break;
                }
                const tx = await this.prisma.transaction.create({
                    data: {
                        stripePaymentIntentId: invoice.payment_intent,
                        amount: invoice.amount_paid / 100,
                        currency: invoice.currency,
                        status: invoice.status ?? 'succeeded',
                        userId: userId || null,
                        responseData: invoice,
                    },
                });
                this.logger.log(`💾 [invoice.payment_succeeded] Transaction creada ID=${tx.id}`);
                await this.createEmpresaSubscription(empresaId, subscriptionType, tx.id);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                this.logger.log(`⚠️ [invoice.payment_failed] invoice.id=${invoice.id}`);
                if (!invoice.subscription) {
                    this.logger.warn('⚠️ [invoice.payment_failed] Invoice sin subscription, abortando.');
                    break;
                }
                const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription);
                this.logger.debug(`📝 [invoice.subscription FAILED] metadata: ${JSON.stringify(subscription.metadata)}`);
                const { empresaId } = subscription.metadata;
                if (!empresaId) {
                    this.logger.error('❌ [invoice.payment_failed] Metadata incompleta, no se cancela.');
                    break;
                }
                const tx = await this.prisma.transaction.create({
                    data: {
                        stripePaymentIntentId: invoice.payment_intent,
                        amount: invoice.amount_paid / 100,
                        currency: invoice.currency,
                        status: invoice.status ?? 'failed',
                        userId: subscription.metadata.userId || null,
                        responseData: invoice,
                    },
                });
                this.logger.log(`💾 [invoice.payment_failed] Transaction creada ID=${tx.id}`);
                await this.cancelEmpresaSubscription(empresaId);
                break;
            }
            default:
                this.logger.warn(`⚠️ [Webhook] Evento no manejado: ${event.type}`);
        }
        return { received: true };
    }
    async processTransaction(session) {
        const { metadata, payment_intent, amount_total, currency, status } = session;
        const { userId, courseId, empresaId, subscriptionType, eventId, workshopId, classroomId } = metadata;
        this.logger.debug(`Procesando transacción con metadata: ${JSON.stringify(metadata)}`);
        const existingTransaction = await this.prisma.transaction.findUnique({
            where: { stripeCheckoutSessionId: session.id },
        });
        if (existingTransaction) {
            this.logger.warn(`La transacción para stripeCheckoutSessionId ${session.id} ya existe.`);
            return existingTransaction;
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                stripePaymentIntentId: payment_intent,
                stripeCheckoutSessionId: session.id,
                amount: (amount_total ?? 0) / 100,
                currency,
                status,
                userId: userId || null,
                courseId: courseId || null,
                responseData: session,
            },
        });
        if (empresaId && subscriptionType && this.isValidCompanySubscription(subscriptionType)) {
            await this.createEmpresaSubscription(empresaId, subscriptionType, transaction.id);
        }
        else if (userId && subscriptionType === 'update') {
            await this.upgradeUserSubscription(userId);
        }
        else if (userId && courseId) {
            await this.enrollUserInCourse(userId, courseId, transaction.id);
        }
        else if (userId && eventId) {
            await this.enrollUserInEvent(userId, eventId, transaction.id);
        }
        else if (userId && workshopId) {
            await this.enrollUserInWorkshop(userId, workshopId, transaction.id);
        }
        else if (userId && classroomId) {
            await this.enrollUserInClassroom(userId, classroomId, transaction.id);
        }
        else {
            this.logger.warn('No se pudo determinar el tipo de transacción a procesar.');
        }
        this.logger.log(`Transacción procesada con éxito para sesión ${session.id}`);
        return transaction;
    }
    isValidCompanySubscription(subscriptionType) {
        const validValues = ['BASICO', 'INTERMEDIO', 'PREMIUM'];
        return validValues.includes(subscriptionType);
    }
    async createEmpresaSubscription(empresaId, subscriptionType, transactionId, interval = 'MONTHLY') {
        this.logger.log(`🔨 [createEmpresaSubscription] inicio — empresaId=${empresaId}, type=${subscriptionType}, txId=${transactionId}, interval=${interval}`);
        const plan = await this.prisma.subscription.findUnique({
            where: { type: subscriptionType },
        });
        this.logger.debug(`🔍 [createEmpresaSubscription] subscription.findUnique() → ${plan ? 'encontrado' : 'NO encontrado'}`);
        if (!plan) {
            const msg = `Tipo de suscripción inválido: ${subscriptionType}`;
            this.logger.error(`❌ [createEmpresaSubscription] ${msg}`);
            throw new common_1.HttpException(msg, common_1.HttpStatus.BAD_REQUEST);
        }
        const now = new Date();
        const monthsToAdd = interval === 'MONTHLY' ? 1 : interval === 'SEMIANNUAL' ? 6 : 12;
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + monthsToAdd);
        this.logger.log(`📅 [createEmpresaSubscription] startDate=${now.toISOString()}, endDate=${endDate.toISOString()}`);
        const created = await this.prisma.empresaSubscription.create({
            data: {
                empresaId,
                subscriptionId: plan.id,
                interval,
                startDate: now,
                endDate: endDate,
                status: 'active',
            },
        });
        this.logger.log(`💾 [createEmpresaSubscription] EmpresaSubscription creada ID=${created.id}`);
        this.logger.debug(`🗂️ [createEmpresaSubscription] registro completo: ${JSON.stringify(created)}`);
    }
    async cancelEmpresaSubscription(empresaId) {
        await this.prisma.empresaSubscription.updateMany({
            where: {
                empresaId,
                status: 'active',
            },
            data: { status: 'canceled' },
        });
        this.logger.log(`Suscripción de empresa ${empresaId} cancelada (status = "canceled").`);
    }
    async enrollUserInCourse(userId, courseId, transactionId) {
        await this.prisma.courseEnrollment.create({
            data: { userId, courseId },
        });
        this.logger.log(`Usuario ${userId} inscrito en el curso ${courseId}`);
    }
    async enrollUserInEvent(userId, eventId, transactionId) {
        await this.prisma.eventEnrollment.create({
            data: {
                userId,
                eventId,
                status: 'active',
            },
        });
        this.logger.log(`Usuario ${userId} inscrito en el evento ${eventId}`);
    }
    async enrollUserInWorkshop(userId, workshopId, transactionId) {
        await this.prisma.workshopEnrollment.create({
            data: {
                userId,
                workshopId,
                status: 'active',
            },
        });
        this.logger.log(`Usuario ${userId} inscrito en el workshop ${workshopId}`);
    }
    async enrollUserInClassroom(userId, classroomId, transactionId) {
        await this.prisma.classroomEnrollment.create({
            data: {
                userId,
                classroomId,
                status: 'active',
            },
        });
        this.logger.log(`Usuario ${userId} inscrito en el classroom ${classroomId}`);
    }
    async upgradeUserSubscription(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { userSubscription: 'update' },
        });
        this.logger.log(`Usuario ${userId} se ha actualizado al plan "update".`);
    }
    async downgradeUserSubscription(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { userSubscription: null },
        });
        this.logger.log(`Usuario ${userId} -> suscripción "update" eliminada (pago fallido).`);
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
    validateSubscriptionType(subscriptionType) {
        const validSubscriptionTypes = [
            'BASICO',
            'INTERMEDIO',
            'PREMIUM',
        ];
        if (!validSubscriptionTypes.includes(subscriptionType)) {
            throw new common_1.HttpException(`Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    getSubscriptionPrice(subscriptionType) {
        const subscriptionPrices = {
            BASICO: 1000,
            INTERMEDIO: 1500,
            PREMIUM: 3000,
        };
        const price = subscriptionPrices[subscriptionType];
        if (!price) {
            throw new common_1.HttpException(`Tipo de suscripción no reconocido: ${subscriptionType}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return price;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map