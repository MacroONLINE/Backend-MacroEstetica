import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionType } from '@prisma/client';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  /**
   * Crear una sesión de checkout para la suscripción empresarial
   */
  async createCompanySubscriptionCheckoutSession(
    empresaId: string,
    subscriptionType: 'ORO' | 'PLATA' | 'BRONCE',
  ) {
    // Validar el tipo de suscripción
    const validSubscriptionTypes: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
    if (!validSubscriptionTypes.includes(subscriptionType as SubscriptionType)) {
      throw new HttpException(
        `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar si el tipo de suscripción existe
    const subscription = await this.prisma.subscription.findUnique({
      where: { type: subscriptionType as SubscriptionType }, // Conversión explícita
    });
    if (!subscription) {
      throw new HttpException('El tipo de suscripción no existe', HttpStatus.BAD_REQUEST);
    }

    // Crear sesión de Stripe para el checkout
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Usar modo pago único
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(subscription.price * 100), // Precio en centavos
            product_data: {
              name: `Suscripción ${subscriptionType}`,
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
      success_url: `${this.configService.get<string>('APP_URL')}/subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/subscription/cancel`,
    });

    return session;
  }

  /**
   * Manejar los eventos de Stripe mediante webhooks
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new HttpException(`Webhook signature verification failed: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { empresaId, subscriptionType } = session.metadata || {};

        if (!empresaId || !subscriptionType) {
          console.error('Faltan metadata en la sesión de Stripe. No se puede procesar el pago.');
          return { received: true };
        }

        // Validar el tipo de suscripción
        const validSubscriptionTypes: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
        if (!validSubscriptionTypes.includes(subscriptionType as SubscriptionType)) {
          console.error('Tipo de suscripción inválido');
          return { received: true };
        }

        // Verificar si el tipo de suscripción existe
        const subscription = await this.prisma.subscription.findUnique({
          where: { type: subscriptionType as SubscriptionType },
        });
        if (!subscription) {
          console.error('El tipo de suscripción no existe');
          return { received: true };
        }

        // Registrar la transacción
        await this.prisma.transaction.create({
          data: {
            stripePaymentIntentId: session.payment_intent as string,
            stripeCheckoutSessionId: session.id,
            status: session.payment_status,
            amount: session.amount_total / 100,
            currency: session.currency,
            userId: null, // No aplica para empresa
            courseId: null, // No aplica para empresa
            responseData: session as any,
          },
        });

        // Crear la suscripción empresarial
        await this.prisma.empresaSubscription.create({
          data: {
            empresaId,
            subscriptionId: subscription.id,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Mensual
            status: 'active',
          },
        });

        console.log(`Suscripción registrada para empresa ${empresaId}, tipo: ${subscriptionType}`);
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Crear una sesión de Stripe para la compra de un curso
   */
  async createCheckoutSession(courseId: string, userId: string) {
    // Verificar existencia del curso
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new HttpException('El curso no existe', HttpStatus.BAD_REQUEST);
    }

    // Calcular precio en centavos
    const priceInCents = Math.round(course.price * 100);

    // Crear sesión de Stripe
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
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
    });

    return session;
  }

  /**
   * Renovar suscripciones activas para empresas
   */
  async renewSubscriptions() {
    const now = new Date();

    // Buscar suscripciones activas que han caducado
    const expiredSubscriptions = await this.prisma.empresaSubscription.findMany({
      where: {
        endDate: { lte: now },
        status: 'active',
      },
    });

    // Renovar las suscripciones
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
