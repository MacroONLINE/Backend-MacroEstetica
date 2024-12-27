import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionType } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia', // O la versión que uses
    });
  }

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
      },
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
    });

    return session;
  }

  async createCompanySubscriptionCheckoutSession(
    empresaId: string,
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
        `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(
          ', ',
        )}`,
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
   * Maneja el evento del webhook de Stripe.
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    // Este debe ser tu webhook secret real:
    const webhookSecret = 'whsec_6W5UG3Adau1bUdNXlEsp3lqVjfSSKidj';

    // Log básico de depuración
    this.logger.log(`Usando webhookSecret: ${webhookSecret}`);
    this.logger.log(`Firma (stripe-signature) recibida: ${signature}`);

    // Muestra el payload crudo como string
    this.logger.debug(
      `Payload crudo (Buffer -> string): ${payload.toString('utf8')}`,
    );

    // Tipo y longitud
    this.logger.debug(`Tipo de payload: ${typeof payload}, Longitud: ${payload.length}`);

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      this.logger.log(`Evento recibido de Stripe: ${event.type}`);
      this.logger.debug(`Evento completo: ${JSON.stringify(event, null, 2)}`);
    } catch (err) {
      this.logger.error(`Error al verificar la firma del webhook: ${err.message}`);
      this.logger.error(
        `Tipo de payload: ${typeof payload}, Longitud: ${payload.length}`,
      );
      throw new HttpException(
        `Webhook signature verification failed: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Procesa el evento según su tipo
    switch (event.type) {
      case 'payment_intent.succeeded': {
        this.logger.log('🔔 Pago completado con éxito (payment_intent.succeeded)');
        // Aquí va tu lógica de negocios, e.g. actualizar BDs, enviar correos, etc.
        break;
      }
      // Agrega otros casos si manejas más eventos
      default: {
        this.logger.warn(`Evento no manejado: ${event.type}`);
        break;
      }
    }

    // Respuesta final que retornas al controlador
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
}
