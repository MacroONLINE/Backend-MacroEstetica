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

  /**
   * CREA CHECKOUT SESSION PARA COMPRA DE CURSO (PAGO ÚNICO)
   */
  async createCheckoutSession(
    courseId: string, 
    userId: string, 
    email: string
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new HttpException(
        'El curso no existe',
        HttpStatus.BAD_REQUEST,
      );
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

    this.logger.log(`Sesión de checkout creada: ${JSON.stringify(session)}`);
    return session;
  }

  /**
   * CREA CHECKOUT SESSION PARA SUSCRIPCIÓN DE EMPRESA (PAGO RECURRENTE)
   */
  async createCompanySubscriptionCheckoutSession(
    empresaId: string,
    userId: string,
    subscriptionType: SubscriptionType, // enum
    email: string,
  ) {
    // Validamos que sea un plan reconocido (ORO, PLATA, BRONCE)
    this.validateSubscriptionType(subscriptionType);

    // Precio en centavos
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
        subscriptionType, // Esto llegará como "ORO", "PLATA" o "BRONCE"
        checkoutSessionId: '',
      },
      success_url: `${this.configService.get<string>('APP_URL')}/subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/subscription/cancel`,
    });

    // Actualizar la metadata con el session.id
    await this.stripe.checkout.sessions.update(session.id, {
      metadata: {
        empresaId,
        userId,
        subscriptionType,
        checkoutSessionId: session.id,
      },
    });

    this.logger.log(
      `Sesión de suscripción creada: ${JSON.stringify(session)}`,
    );
    return session;
  }

  /**
   * CREA CHECKOUT SESSION PARA LA SUSCRIPCIÓN DE USUARIO ("update")
   */
  async createUserUpgradeCheckoutSession(
    userId: string,
    email: string,
  ) {
    // Validar que el usuario exista (opcional pero recomendado)
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new HttpException(
        'El usuario no existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Definir el precio en centavos (ejemplo: $20)
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
        subscriptionType: 'update', // <--- OJO: "update" no es del enum, es una string libre
        checkoutSessionId: '',
      },
      success_url: `${this.configService.get<string>('APP_URL')}/user-subscription/success`,
      cancel_url: `${this.configService.get<string>('APP_URL')}/user-subscription/cancel`,
    });

    // Actualizar metadata con session.id
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

  /**
   * WEBHOOK: RECIBE TODOS LOS EVENTOS DE STRIPE
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    const webhookSecret = 'whsec_O31crSeRM1gXmwuFgrgEpvijVGDnpUqW';
    this.logger.log(`Secreto del webhook usado: ${webhookSecret}`);
    this.logger.debug(`Payload recibido: ${payload.toString('utf8')}`);

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload, 
        signature, 
        webhookSecret,
      );
      this.logger.log(`Evento recibido: ${event.type}`);
      this.logger.debug(`Evento completo: ${JSON.stringify(event)}`);
    } catch (err) {
      this.logger.error(
        `Error al verificar la firma del webhook: ${err.message}`,
      );
      throw new HttpException(
        'Webhook signature verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (event.type) {
      // CUANDO SE COMPLETA EL CHECKOUT (PRIMER PAGO ÚNICO O SUSCRIPCIÓN)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        this.logger.debug(`Metadata de la sesión: ${JSON.stringify(session.metadata)}`);
        await this.processTransaction(session);
        break;
      }

      // CUANDO SE REALIZA UN PAGO ÚNICO (payment_intent.succeeded)
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;

        if (intent.metadata?.checkoutSessionId) {
          this.logger.debug(`Metadata del intent: ${JSON.stringify(intent.metadata)}`);
          const session = await this.stripe.checkout.sessions.retrieve(
            intent.metadata.checkoutSessionId,
          );
          await this.processTransaction(session);
        } else {
          this.logger.warn(
            'No se encontró checkoutSessionId en los metadatos del intent.',
          );
        }
        break;
      }

      // CUANDO SE COBRA UNA FACTURA DE SUSCRIPCIÓN (RENOVACIONES)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        try {
          if (!invoice.subscription) {
            this.logger.warn(
              'El invoice no tiene suscripción asociada.',
            );
            break;
          }

          // Recuperamos info de la suscripción
          const subscription = await this.stripe.subscriptions.retrieve(
            invoice.subscription as string,
          );

          this.logger.debug(
            `Metadata de la suscripción: ${JSON.stringify(subscription.metadata)}`,
          );

          // Extraemos la metadata
          const { empresaId, userId, subscriptionType } = subscription.metadata;

          // Creamos la transacción
          const paymentIntentId = invoice.payment_intent as string;
          const paymentIntent = await this.stripe.paymentIntents.retrieve(
            paymentIntentId,
          );

          const transaction = await this.prisma.transaction.create({
            data: {
              stripePaymentIntentId: paymentIntentId,
              stripeCheckoutSessionId: null, // no hay session en renovaciones
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: invoice.status ?? paymentIntent.status,
              userId: userId || null,
              courseId: null,
              responseData: invoice as unknown as Prisma.JsonValue,
            },
          });

          // Si es suscripción de empresa
          if (empresaId && subscriptionType) {
            // Asegúrate de que sea un SubscriptionType válido
            if (this.isValidCompanySubscription(subscriptionType)) {
              await this.createEmpresaSubscription(
                empresaId,
                subscriptionType as SubscriptionType,
                transaction.id,
              );
            } else {
              this.logger.warn(
                `Tipo de suscripción inválido para empresa: ${subscriptionType}`,
              );
            }
          } else {
            this.logger.warn(
              'No se encontró empresaId o subscriptionType en la metadata de la suscripción.',
            );
          }
        } catch (error) {
          this.logger.error(
            `Error procesando invoice.payment_succeeded: ${error.message}`,
          );
          throw new HttpException(
            `Error procesando invoice: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        break;
      }

      default:
        this.logger.warn(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * PROCESA TRANSACCIONES PARA PAGOS ÚNICOS O PRIMER PAGO DE SUSCRIPCIÓN
   */
  private async processTransaction(session: Stripe.Checkout.Session) {
    const {
      metadata,
      payment_intent,
      amount_total,
      currency,
      status,
    } = session;
    const { userId, courseId, empresaId, subscriptionType } = metadata;

    this.logger.debug(
      `Procesando transacción con metadata: ${JSON.stringify(metadata)}`,
    );

    // Creación de la transacción en la DB
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

    // 1) Suscripción de empresa (ORO, PLATA, BRONCE, etc.)
    if (
      empresaId &&
      subscriptionType && 
      this.isValidCompanySubscription(subscriptionType)
    ) {
      await this.createEmpresaSubscription(
        empresaId,
        subscriptionType as SubscriptionType,
        transaction.id,
      );
    }
    // 2) Suscripción de usuario ("update")
    else if (userId && subscriptionType === 'update') {
      await this.upgradeUserSubscription(userId);
    }
    // 3) Compra de curso (pago único)
    else if (userId && courseId) {
      await this.enrollUserInCourse(userId, courseId, transaction.id);
    }
    // 4) No se pudo determinar el tipo
    else {
      this.logger.warn(
        'No se pudo determinar el tipo de transacción a procesar.',
      );
    }

    this.logger.log(`Transacción procesada con éxito para sesión ${session.id}`);
  }

  /**
   * Valida que subscriptionType sea uno de ORO, PLATA, BRONCE, etc.
   */
  private isValidCompanySubscription(subscriptionType: string): boolean {
    const validValues: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
    return validValues.includes(subscriptionType as SubscriptionType);
  }

  /**
   * CREA O RENUEVA LA SUSCRIPCIÓN DE EMPRESA EN LA DB
   */
  private async createEmpresaSubscription(
    empresaId: string,
    subscriptionType: SubscriptionType,
    transactionId: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { type: subscriptionType },
    });

    if (!subscription) {
      throw new HttpException(
        'Tipo de suscripción no válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear un registro en EmpresaSubscription
    await this.prisma.empresaSubscription.create({
      data: {
        empresaId,
        subscriptionId: subscription.id,
        startDate: new Date(),
        endDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ),
        status: 'active',
      },
    });

    this.logger.log(
      `Suscripción ${subscriptionType} creada/renovada para empresa ${empresaId}`,
    );
  }

  /**
   * INSCRIBE AL USUARIO EN EL CURSO (COMPRA ÚNICA)
   */
  private async enrollUserInCourse(
    userId: string,
    courseId: string,
    transactionId: string,
  ) {
    await this.prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
      },
    });
    this.logger.log(
      `Usuario ${userId} inscrito en el curso ${courseId}`,
    );
  }

  /**
   * MARCA EN LA DB QUE EL USUARIO TIENE LA SUSCRIPCIÓN "update"
   */
  private async upgradeUserSubscription(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { userSubscription: 'update' },
    });
    this.logger.log(
      `Usuario ${userId} se ha actualizado al plan "update".`,
    );
  }

  /**
   * EJEMPLO DE LÓGICA PARA RENOVAR SUSCRIPCIONES (CRON)
   */
  async renewSubscriptions() {
    const now = new Date();
    const expiredSubscriptions =
      await this.prisma.empresaSubscription.findMany({
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


/**
 * Verifica si la suscripción de empresa es válida (ORO, PLATA, BRONCE).
 */
private validateSubscriptionType(subscriptionType: SubscriptionType) {
  const validSubscriptionTypes: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
  if (!validSubscriptionTypes.includes(subscriptionType)) {
    throw new HttpException(
      `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Retorna el precio (en centavos) según el tipo de suscripción de empresa.
 */
private getSubscriptionPrice(subscriptionType: SubscriptionType): number {
  // Precios en centavos
  const subscriptionPrices: { [key in SubscriptionType]?: number } = {
    ORO: 2000,   // $20.00
    PLATA: 1200, // $12.00
    BRONCE: 800, // $8.00
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
