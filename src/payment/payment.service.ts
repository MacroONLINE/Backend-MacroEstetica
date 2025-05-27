import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SubscriptionType } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-11-20.acacia',
      },
    );
  }

  // ---------------------------------------------------------------------
  // MÉTODOS EXISTENTES PARA CURSOS, SUSCRIPCIONES, ETC.
  // ---------------------------------------------------------------------

  /**
   * CREA CHECKOUT SESSION PARA COMPRA DE CURSO (PAGO ÚNICO)
   */
  async createCheckoutSession(courseId: string, userId: string, email: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new HttpException('El curso no existe', HttpStatus.BAD_REQUEST);
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
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
    });

    // Actualizar la metadata con el session.id
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

  // src/payment/payment.service.ts

async createCompanySubscriptionCheckoutSession(
  empresaId: string,
  userId: string,
  subscriptionType: SubscriptionType,
  email: string,
) {
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

    // ← metadata para la sesión (solo checkout)
    metadata: {
      checkoutSessionId: '',
    },

    // ← metadata para la suscripción en Stripe
    subscription_data: {
      metadata: {
        empresaId,
        userId,
        subscriptionType,
      },
    },

    success_url: `${this.configService.get<string>('APP_URL')}/subscription/success`,
    cancel_url:  `${this.configService.get<string>('APP_URL')}/subscription/cancel`,
  });

  // luego guardamos el sessionId en la metadata de la sesión
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


  /**
   * CREA CHECKOUT SESSION PARA LA SUSCRIPCIÓN "update" DE UN USUARIO
   */
  async createUserUpgradeCheckoutSession(
    userId: string,
    email: string,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
    }

    const unitAmount = 2000; // $20

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
      success_url: `${this.configService.get<string>('APP_URL')}/user-subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/user-subscription/cancel`,
    });

    await this.stripe.checkout.sessions.update(session.id, {
      metadata: {
        userId,
        subscriptionType: 'update',
        checkoutSessionId: session.id,
      },
    });

    this.logger.log(
      `Sesión de suscripción (usuario - update) creada: ${JSON.stringify(session)}`,
    );
    return session;
  }

  // ---------------------------------------------------------------------
  // NUEVOS MÉTODOS PARA EVENT, WORKSHOP Y CLASSROOM
  // ---------------------------------------------------------------------

  /**
   * CREA CHECKOUT SESSION PARA PAGAR UN EVENT
   */
  async createEventCheckoutSession(
    eventId: string,
    userId: string,
    email: string,
  ): Promise<Stripe.Checkout.Session> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new HttpException('El evento no existe', HttpStatus.BAD_REQUEST);
    }
    if (typeof event.price !== 'number') {
      throw new HttpException('Este evento no tiene un precio definido', HttpStatus.BAD_REQUEST);
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
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
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

  /**
   * CREA CHECKOUT SESSION PARA PAGAR UN WORKSHOP
   */
  async createWorkshopCheckoutSession(
    workshopId: string,
    userId: string,
    email: string,
  ): Promise<Stripe.Checkout.Session> {
    const workshop = await this.prisma.workshop.findUnique({ where: { id: workshopId } });
    if (!workshop) {
      throw new HttpException('El workshop no existe', HttpStatus.BAD_REQUEST);
    }
    if (typeof workshop.price !== 'number') {
      throw new HttpException('Este workshop no tiene un precio definido', HttpStatus.BAD_REQUEST);
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
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
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

  /**
   * CREA CHECKOUT SESSION PARA PAGAR UN CLASSROOM
   */
  async createClassroomCheckoutSession(
    classroomId: string,
    userId: string,
    email: string,
  ): Promise<Stripe.Checkout.Session> {
    const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
    if (!classroom) {
      throw new HttpException('El classroom no existe', HttpStatus.BAD_REQUEST);
    }
    if (typeof classroom.price !== 'number') {
      throw new HttpException('Este classroom no tiene un precio definido', HttpStatus.BAD_REQUEST);
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
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
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

  // src/payment/payment.service.ts

async handleWebhookEvent(signature: string, payload: Buffer) {
  this.logger.log(`🔔 [Webhook] Inicio de handleWebhookEvent`);
  let event: Stripe.Event;
  try {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    this.logger.log(`✔️ [Webhook] Firma verificada — event.type=${event.type}`);
  } catch (err) {
    this.logger.error(`❌ [Webhook] Error al verificar firma: ${err.message}`);
    throw new HttpException('Stripe webhook signature verification failed', HttpStatus.BAD_REQUEST);
  }

  switch (event.type) {

    // ——————————————————————————————————————————
    // 1) Primera creación de suscripción
    // ——————————————————————————————————————————
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      this.logger.log(`🛒 [checkout.session.completed] session.id=${session.id}`);
      this.logger.debug(`📝 [checkout.session.completed] metadata: ${JSON.stringify(session.metadata)}`);
      await this.processTransaction(session);
      break;
    }

    // ——————————————————————————————————————————
    // 2) Pago de intent (fallback)
    // ——————————————————————————————————————————
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      this.logger.log(`💳 [payment_intent.succeeded] intent.id=${intent.id}`);
      if (intent.metadata?.checkoutSessionId) {
        this.logger.debug(`🔍 [payment_intent.succeeded] metadata: ${JSON.stringify(intent.metadata)}`);
        const session = await this.stripe.checkout.sessions.retrieve(
          intent.metadata.checkoutSessionId as string
        );
        this.logger.log(`🔄 [payment_intent.succeeded] Recuperada session.id=${session.id}`);
        await this.processTransaction(session);
      } else {
        this.logger.warn('⚠️ [payment_intent.succeeded] No hay checkoutSessionId en metadata');
      }
      break;
    }

    // ——————————————————————————————————————————
    // 3) Renovación exitosa de suscripción
    // ——————————————————————————————————————————
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      this.logger.log(`📄 [invoice.payment_succeeded] invoice.id=${invoice.id}`);
      if (!invoice.subscription) {
        this.logger.warn('⚠️ [invoice.payment_succeeded] Invoice sin subscription, abortando.');
        break;
      }
      const subscription = await this.stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      this.logger.debug(`📝 [invoice.subscription] metadata: ${JSON.stringify(subscription.metadata)}`);

      const { empresaId, subscriptionType, userId } = subscription.metadata;
      if (!empresaId || !subscriptionType) {
        this.logger.error('❌ [invoice.payment_succeeded] Metadata incompleta, no se crea renovación.');
        break;
      }

      const tx = await this.prisma.transaction.create({
        data: {
          stripePaymentIntentId: invoice.payment_intent as string,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: invoice.status ?? 'succeeded',
          userId: userId || null,
          responseData: invoice as any,
        },
      });
      this.logger.log(`💾 [invoice.payment_succeeded] Transaction creada ID=${tx.id}`);

      await this.createEmpresaSubscription(
        empresaId,
        subscriptionType as SubscriptionType,
        tx.id,
        // aquí podrías extraer interval si lo guardaste en subscription.metadata.interval
      );
      break;
    }

    // ——————————————————————————————————————————
    // 4) Fallo en pago de renovación
    // ——————————————————————————————————————————
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      this.logger.log(`⚠️ [invoice.payment_failed] invoice.id=${invoice.id}`);
      if (!invoice.subscription) {
        this.logger.warn('⚠️ [invoice.payment_failed] Invoice sin subscription, abortando.');
        break;
      }
      const subscription = await this.stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      this.logger.debug(`📝 [invoice.subscription FAILED] metadata: ${JSON.stringify(subscription.metadata)}`);

      const { empresaId } = subscription.metadata;
      if (!empresaId) {
        this.logger.error('❌ [invoice.payment_failed] Metadata incompleta, no se cancela.');
        break;
      }

      // registramos la transacción fallida
      const tx = await this.prisma.transaction.create({
        data: {
          stripePaymentIntentId: invoice.payment_intent as string,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: invoice.status ?? 'failed',
          userId: subscription.metadata.userId || null,
          responseData: invoice as any,
        },
      });
      this.logger.log(`💾 [invoice.payment_failed] Transaction creada ID=${tx.id}`);

      // cancelamos suscripción en la BD
      await this.cancelEmpresaSubscription(empresaId);
      break;
    }

    // ——————————————————————————————————————————
    // Otros eventos no manejados
    // ——————————————————————————————————————————
    default:
      this.logger.warn(`⚠️ [Webhook] Evento no manejado: ${event.type}`);
  }

  return { received: true };
}


  /**
   * PROCESA TRANSACCIONES PARA PAGOS ÚNICOS O PRIMER PAGO DE SUSCRIPCIÓN
   */
  private async processTransaction(session: Stripe.Checkout.Session) {
    const { metadata, payment_intent, amount_total, currency, status } = session;
    const { userId, courseId, empresaId, subscriptionType, eventId, workshopId, classroomId } = metadata;

    this.logger.debug(`Procesando transacción con metadata: ${JSON.stringify(metadata)}`);

    // Verificar si la transacción ya existe
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { stripeCheckoutSessionId: session.id },
    });

    if (existingTransaction) {
      this.logger.warn(`La transacción para stripeCheckoutSessionId ${session.id} ya existe.`);
      return existingTransaction;
    }

    // Crear la nueva transacción
    const transaction = await this.prisma.transaction.create({
      data: {
        stripePaymentIntentId: payment_intent as string,
        stripeCheckoutSessionId: session.id,
        amount: (amount_total ?? 0) / 100,
        currency,
        status,
        userId: userId || null,
        courseId: courseId || null,
        responseData: session as unknown as Prisma.JsonValue,
      },
    });

    // Lógica para determinar qué está comprando el usuario
    if (empresaId && subscriptionType && this.isValidCompanySubscription(subscriptionType)) {
      // Suscripción de empresa
      await this.createEmpresaSubscription(empresaId, subscriptionType as SubscriptionType, transaction.id);

    } else if (userId && subscriptionType === 'update') {
      // Suscripción "update" de usuario
      await this.upgradeUserSubscription(userId);

    } else if (userId && courseId) {
      // Compra de un curso
      await this.enrollUserInCourse(userId, courseId, transaction.id);

    } else if (userId && eventId) {
      // Compra de un evento
      await this.enrollUserInEvent(userId, eventId, transaction.id);

    } else if (userId && workshopId) {
      // Compra de un workshop
      await this.enrollUserInWorkshop(userId, workshopId, transaction.id);

    } else if (userId && classroomId) {
      // Compra de un classroom
      await this.enrollUserInClassroom(userId, classroomId, transaction.id);

    } else {
      this.logger.warn('No se pudo determinar el tipo de transacción a procesar.');
    }

    this.logger.log(`Transacción procesada con éxito para sesión ${session.id}`);
    return transaction;
  }

  // ---------------------------------------------------------------------
  // MÉTODOS AUXILIARES PARA CREAR/CANCELAR SUSCRIPCIONES, INSCRIBIR, ETC.
  // ---------------------------------------------------------------------

  private isValidCompanySubscription(subscriptionType: string): boolean {
    const validValues: SubscriptionType[] = ['BASICO', 'INTERMEDIO', 'PREMIUM'];
    return validValues.includes(subscriptionType as SubscriptionType);
  }

  /**
   * CREACIÓN de la suscripción en BD, con logs en cada paso
   */
  private async createEmpresaSubscription(
    empresaId: string,
    subscriptionType: SubscriptionType,
    transactionId: string,
    interval: 'MONTHLY' | 'SEMIANNUAL' | 'ANNUAL' = 'MONTHLY',
  ) {
    this.logger.log(`🔨 [createEmpresaSubscription] inicio — empresaId=${empresaId}, type=${subscriptionType}, txId=${transactionId}, interval=${interval}`);

    // 1) Consulta del plan
    const plan = await this.prisma.subscription.findUnique({
      where: { type: subscriptionType },
    });
    this.logger.debug(`🔍 [createEmpresaSubscription] subscription.findUnique() → ${plan ? 'encontrado' : 'NO encontrado'}`);

    if (!plan) {
      const msg = `Tipo de suscripción inválido: ${subscriptionType}`;
      this.logger.error(`❌ [createEmpresaSubscription] ${msg}`);
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    }

    // 2) Cálculo de fechas
    const now = new Date();
    const monthsToAdd = interval === 'MONTHLY' ? 1 : interval === 'SEMIANNUAL' ? 6 : 12;
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    this.logger.log(`📅 [createEmpresaSubscription] startDate=${now.toISOString()}, endDate=${endDate.toISOString()}`);

    // 3) Inserción en BD
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
  

   async cancelEmpresaSubscription(empresaId: string) {
    await this.prisma.empresaSubscription.updateMany({
      where: {
        empresaId,
        status: 'active',
      },
      data: { status: 'canceled' },
    });

    this.logger.log(`Suscripción de empresa ${empresaId} cancelada (status = "canceled").`);
  }

  private async enrollUserInCourse(userId: string, courseId: string, transactionId: string) {
    await this.prisma.courseEnrollment.create({
      data: { userId, courseId },
    });
    this.logger.log(`Usuario ${userId} inscrito en el curso ${courseId}`);
  }

  private async enrollUserInEvent(userId: string, eventId: string, transactionId: string) {
    await this.prisma.eventEnrollment.create({
      data: {
        userId,
        eventId,
        status: 'active',
      },
    });
    this.logger.log(`Usuario ${userId} inscrito en el evento ${eventId}`);
  }

  private async enrollUserInWorkshop(userId: string, workshopId: string, transactionId: string) {
    await this.prisma.workshopEnrollment.create({
      data: {
        userId,
        workshopId,
        status: 'active',
      },
    });
    this.logger.log(`Usuario ${userId} inscrito en el workshop ${workshopId}`);
  }

  private async enrollUserInClassroom(userId: string, classroomId: string, transactionId: string) {
    await this.prisma.classroomEnrollment.create({
      data: {
        userId,
        classroomId,
        status: 'active',
      },
    });
    this.logger.log(`Usuario ${userId} inscrito en el classroom ${classroomId}`);
  }

  private async upgradeUserSubscription(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { userSubscription: 'update' },
    });
    this.logger.log(`Usuario ${userId} se ha actualizado al plan "update".`);
  }

  private async downgradeUserSubscription(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { userSubscription: null },
    });
    this.logger.log(`Usuario ${userId} -> suscripción "update" eliminada (pago fallido).`);
  }

  /**
   * CRON DE EJEMPLO PARA RENOVAR SUSCRIPCIONES (OPCIONAL)
   */
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

  private validateSubscriptionType(subscriptionType: SubscriptionType) {
    const validSubscriptionTypes: SubscriptionType[] = [
      'BASICO',
      'INTERMEDIO',
      'PREMIUM',
    ];
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      throw new HttpException(
        `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getSubscriptionPrice(subscriptionType: SubscriptionType): number {
    const subscriptionPrices: { [key in SubscriptionType]?: number } = {
      BASICO: 1000,       // $10.00
      INTERMEDIO: 1500,   // $15.00
      PREMIUM: 3000,      // $30.00
    };

    const price = subscriptionPrices[subscriptionType];
    if (!price) {
      throw new HttpException(
        `Tipo de suscripción no reconocido: ${subscriptionType}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return price;
  }
}
