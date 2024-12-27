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
    // Coloca directamente el secreto del webhook aquí
    const webhookSecret = 'whsec_6W5UG3Adau1bUdNXlEsp3lqVjfSSKidj';
  
    // Imprime el secreto para verificar
    this.logger.log(`Secreto del webhook usado: ${webhookSecret}`);
    console.log(`Secreto del webhook usado: ${webhookSecret}`);
  
    if (!webhookSecret) {
      this.logger.error('El secreto del webhook no está configurado.');
      throw new HttpException('El secreto del webhook no está configurado.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    let event: Stripe.Event;
  
    try {
      // Verifica la firma del webhook usando el secreto directamente
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Error al verificar la firma del webhook: ${err.message}`);
      throw new HttpException(`Webhook signature verification failed: ${err.message}`, HttpStatus.BAD_REQUEST);
    }
  
    this.logger.log(`Evento recibido: ${event.type}`);
  
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
        this.logger.log(`PaymentIntent procesado con éxito: ${paymentIntent.id}`);
        console.log(`PaymentIntent procesado con éxito: ${paymentIntent.id}`);
        break;
      }
  
      default:
        this.logger.warn(`Evento no manejado: ${event.type}`);
        console.log(`Evento no manejado: ${event.type}`);
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
}
