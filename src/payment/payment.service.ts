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
    subscriptionType: SubscriptionType,
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
      metadata: { empresaId, subscriptionType },
      success_url: `${this.configService.get<string>('APP_URL')}/subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/subscription/cancel`,
    });

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
        // Existing logic for handling completed checkout session...

        break;
      }
      case 'subscription.created': { // New case for subscription creation
        const subscription = event.data.object as Stripe.Subscription;
        const { empresaId } = await this.prisma.customer.findUnique({
          where: { stripeCustomerId: subscription.customer },
          select: { empresaId: true },
        });

        if (!empresaId) {
          console.error('Empresa no encontrada para la suscripción creada');
          return { received: true };
        }

        // Update or create empresaSubscription based on subscription ID
        const existingSubscription = await this.prisma.empresaSubscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (existingSubscription) {
          // Update existing subscription (optional, depending on your logic)
          console.log(`Subscription actualizada para empresa ${empresaId}`);
        } else {
          // Create new empresaSubscription
          await this.prisma.empresaSubscription.create({
            data: {
              empresaId,
              stripeSubscriptionId: subscription.id,
              startDate: new Date(subscription.created * 1000), // Convert timestamp to Date
              endDate: calculateSubscriptionEndDate(subscription.current_period_end * 1000), // Function to calculate end date
              status: subscription.status,
            },
          });
          console.log(`Suscripción creada para empresa ${empresaId}`);
        }

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
