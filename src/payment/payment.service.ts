import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia', // Ajusta a tu versión de API de Stripe si es diferente
    });
  }

  /**
   * Crea una sesión de pago de Stripe
   */
  async createCheckoutSession(courseId: string, userId: string) {
    try {
      console.log('courseId recibido en PaymentService:', courseId);
      console.log('userId recibido en PaymentService:', userId);

      // Busca el curso en la base de datos
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        console.error('Curso no encontrado con ID:', courseId);
        throw new HttpException('Curso no encontrado', HttpStatus.NOT_FOUND);
      }

      console.log('Curso encontrado:', course);

      const priceInCents = Math.round(course.price * 100);
      console.log('Precio en centavos:', priceInCents);

      // Crea la sesión de Stripe
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
                images: [course.courseImageUrl],
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
        success_url: `${this.configService.get<string>('APP_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
      });

      console.log('Sesión de Stripe creada:', session);
      return session;
    } catch (error) {
      console.error('Error al crear la sesión de Stripe:', error.message);
      throw new HttpException('Error al crear la sesión de Stripe', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Maneja eventos de Stripe enviados al webhook
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      // Valida la firma del evento
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      console.error('Error al validar la firma del webhook:', err.message);
      throw new HttpException(`Webhook signature verification failed: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    // Maneja los diferentes tipos de eventos
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, courseId } = session.metadata || {};

      if (!userId || !courseId) {
        console.error('Falta metadata en la sesión de Stripe. No se puede procesar el webhook.');
        return { received: true };
      }

      console.log('Procesando inscripción para userId:', userId, 'courseId:', courseId);

      // Registra la inscripción en la base de datos
      try {
        await this.prisma.courseEnrollment.create({
          data: {
            userId,
            courseId,
            enrolledAt: new Date(),
          },
        });
        console.log('Usuario inscrito en el curso:', { userId, courseId });
      } catch (error) {
        console.error('Error al inscribir al usuario:', error.message);
        throw new HttpException('Error al procesar la inscripción', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    return { received: true };
  }
}
