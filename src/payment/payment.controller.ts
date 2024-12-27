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
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCheckoutSession(
    @Body('courseId') courseId: string,
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!courseId || !userId || !email) {
      throw new HttpException('courseId, userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId, email);
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
      // Pasa el raw body directamente al servicio
      const result = await this.paymentService.handleWebhookEvent(signature, req.body as Buffer);
      this.logger.log('Webhook procesado correctamente');
      res.status(200).send(result);
    } catch (error) {
      this.logger.error(`Error en Webhook: ${error.message}`);
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
        email: { type: 'string', description: 'Email del administrador de la empresa' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCompanySubscriptionCheckoutSession(
    @Body('empresaId') empresaId: string,
    @Body('subscriptionType') subscriptionType: 'ORO' | 'PLATA' | 'BRONCE',
    @Body('email') email: string,
  ) {
    if (!empresaId || !subscriptionType || !email) {
      throw new HttpException('empresaId, subscriptionType y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCompanySubscriptionCheckoutSession(
      empresaId,
      subscriptionType as SubscriptionType,
      email,
    );
    this.logger.log(
      `Sesión de checkout creada para empresaId: ${empresaId}, tipo: ${subscriptionType}, email: ${email}`,
    );
    return { url: session.url };
  }
}