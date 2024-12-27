import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
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
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createCheckoutSession(courseId: string, userId: string, email: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
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
      success_url: `${this.configService.get<string>('APP_URL')}/subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/subscription/cancel`,
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

  private validateSubscriptionType(subscriptionType: SubscriptionType) {
    const validSubscriptionTypes: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      throw new HttpException(
        `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getSubscriptionPrice(subscriptionType: SubscriptionType): number {
    const subscriptionPrices = {
      ORO: 2000,
      PLATA: 1200,
      BRONCE: 800,
    };
    return subscriptionPrices[subscriptionType];
  }

  async handleWebhookEvent(signature: string, payload: Buffer) {
    const webhookSecret = "whsec_O31crSeRM1gXmwuFgrgEpvijVGDnpUqW";
    this.logger.log(`Secreto del webhook usado: ${webhookSecret}`);
    this.logger.debug(`Payload recibido: ${payload.toString('utf8')}`);

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      this.logger.log(`Evento recibido: ${event.type}`);
      this.logger.debug(`Evento completo: ${JSON.stringify(event)}`);
    } catch (err) {
      this.logger.error(`Error al verificar la firma del webhook: ${err.message}`);
      throw new HttpException('Webhook signature verification failed', HttpStatus.BAD_REQUEST);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        this.logger.debug(`Metadata de la sesión: ${JSON.stringify(session.metadata)}`);
        await this.processTransaction(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;

        if (intent.metadata?.checkoutSessionId) {
          this.logger.debug(`Metadata del intent: ${JSON.stringify(intent.metadata)}`);
          const session = await this.stripe.checkout.sessions.retrieve(intent.metadata.checkoutSessionId);
          await this.processTransaction(session);
        } else {
          this.logger.warn('No se encontró checkoutSessionId en los metadatos del intent.');
        }
        break;
      }

      default:
        this.logger.warn(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }

  private async processTransaction(session: Stripe.Checkout.Session) {
    const { metadata, payment_intent, amount_total, currency, status } = session;

    this.logger.debug(`Procesando transacción con metadata: ${JSON.stringify(metadata)}`);

    const userId = metadata.userId;
    const courseId = metadata.courseId;
    const empresaId = metadata.empresaId;
    const subscriptionType = metadata.subscriptionType;

    if (!userId && !empresaId) {
      this.logger.error('El ID del usuario o empresa no está presente en los metadatos.');
      throw new HttpException('El ID del usuario o empresa no está presente en los metadatos.', HttpStatus.BAD_REQUEST);
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        stripePaymentIntentId: payment_intent as string,
        stripeCheckoutSessionId: session.id,
        amount: amount_total / 100,
        currency,
        status,
        userId,
        courseId: courseId || null,
        responseData: session as unknown as Prisma.JsonValue,
      },
    });

    if (empresaId && subscriptionType) {
      await this.createEmpresaSubscription(empresaId, subscriptionType as SubscriptionType, transaction.id);
    } else if (courseId) {
      await this.enrollUserInCourse(userId, courseId, transaction.id);
    }

    this.logger.log(`Transacción procesada con éxito para sesión ${session.id}`);
  }

  private async createEmpresaSubscription(
    empresaId: string,
    subscriptionType: SubscriptionType,
    transactionId: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { type: subscriptionType },
    });

    if (!subscription) {
      throw new HttpException('Tipo de suscripción no válido', HttpStatus.BAD_REQUEST);
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

  private async enrollUserInCourse(userId: string, courseId: string, transactionId: string) {
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
}
