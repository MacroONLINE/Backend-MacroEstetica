import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  /**
   * Crea una sesión de checkout de Stripe para un curso específico.
   * @param courseId El ID del curso.
   * @param userId   El ID del usuario que va a comprar el curso.
   */
  async createCheckoutSession(courseId: string, userId: string) {
    // Obtener datos del curso
    const course = await this.coursesService.getCourseById(courseId);

    const priceInCents = Math.round(course.price * 100);
    const currency = 'usd'; // Ajusta la moneda según tu necesidad

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency,
          unit_amount: priceInCents,
          product_data: {
            name: course.title,
            images: [course.courseImageUrl],
            description: course.description,
          },
        },
        quantity: 1,
      }],
      metadata: {
        userId,
        courseId,
      },
      success_url: `${this.configService.get<string>('APP_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/payment/cancel`,
    });

    return session;
  }

  /**
   * Maneja el webhook de Stripe.
   * @param signature Cabecera stripe-signature del request.
   * @param payload Cuerpo crudo del webhook.
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      throw new HttpException(`Webhook signature verification failed: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, courseId } = session.metadata;

      // Obtener detalles del pago
      const paymentIntentId = session.payment_intent as string;
      const amount_total = session.amount_total; // en centavos
      const currency = session.currency;
      const status = 'succeeded'; // Si se completa con éxito

      // Guardar el pago en la base de datos
      await this.prisma.payment.create({
        data: {
          stripePaymentIntentId: paymentIntentId,
          stripeCheckoutSessionId: session.id,
          amount: amount_total / 100, // convertir a la unidad monetaria principal
          currency: currency,
          status: status,
          userId: userId,
          courseId: courseId,
        },
      });

      // Crear CourseEnrollment para inscribir al usuario en el curso
      await this.prisma.courseEnrollment.create({
        data: {
          userId: userId,
          courseId: courseId,
          enrolledAt: new Date(),
        },
      });

      console.log('User enrolled and payment recorded:', { userId, courseId, paymentIntentId });
    }

    return { received: true };
  }
}
