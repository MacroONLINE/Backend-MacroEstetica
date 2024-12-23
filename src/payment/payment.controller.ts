import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SubscriptionType } from '@prisma/client';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso' },
        userId: { type: 'string', description: 'ID del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCheckoutSession(@Body('courseId') courseId: string, @Body('userId') userId: string) {
    if (!courseId || !userId) {
      throw new HttpException('courseId y userId son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId);
    return { url: session.url };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook fue recibido.' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook.' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log('Webhook recibido en /payment/webhook');

    if (!signature) {
      this.logger.error('Falta el encabezado stripe-signature');
      return res.status(400).send('Falta el encabezado stripe-signature');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      this.logger.log('Webhook procesado correctamente');
      res.status(200).send(result);
    } catch (error) {
      this.logger.error('Error en Webhook:', error.message);
      res.status(400).send(`Error en Webhook: ${error.message}`);
    }
  }

  @Post('subscription-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para suscripciones empresariales' })
  @ApiBody({
    schema: {
      properties: {
        empresaId: { type: 'string', description: 'ID de la empresa' },
        subscriptionType: { type: 'string', description: 'Tipo de suscripción (ORO, PLATA, BRONCE)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCompanySubscriptionCheckoutSession(
    @Body('empresaId') empresaId: string,
    @Body('subscriptionType') subscriptionType: 'ORO' | 'PLATA' | 'BRONCE',
  ) {
    if (!empresaId || !subscriptionType) {
      throw new HttpException('empresaId y subscriptionType son requeridos', HttpStatus.BAD_REQUEST);
    }

    // Validar el tipo de suscripción
    const validSubscriptionTypes: SubscriptionType[] = ['ORO', 'PLATA', 'BRONCE'];
    if (!validSubscriptionTypes.includes(subscriptionType as SubscriptionType)) {
      throw new HttpException(
        `Tipo de suscripción inválido. Valores permitidos: ${validSubscriptionTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = await this.paymentService.createCompanySubscriptionCheckoutSession(
      empresaId,
      subscriptionType as SubscriptionType, // Conversión explícita
    );
    this.logger.log(`Sesión de checkout creada para empresaId: ${empresaId}, tipo: ${subscriptionType}`);
    return { url: session.url };
  }
}
