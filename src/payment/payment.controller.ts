import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
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
    if (!signature) {
      return res.status(400).send('Falta el encabezado stripe-signature');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error en Webhook:', error.message);
      res.status(400).send(`Error en Webhook: ${error.message}`);
    }
  }

  @Post('company-subscription')
  @ApiOperation({ summary: 'Crea una suscripción para una empresa' })
  @ApiBody({
    schema: {
      properties: {
        empresaId: { type: 'string', description: 'ID de la empresa' },
        subscriptionType: { type: 'string', description: 'Tipo de suscripción (ORO, PLATA, BRONCE)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Suscripción creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al crear la suscripción.' })
  async createCompanySubscription(
    @Body('empresaId') empresaId: string,
    @Body('subscriptionType') subscriptionType: 'ORO' | 'PLATA' | 'BRONCE',
  ) {
    if (!empresaId || !subscriptionType) {
      throw new HttpException('empresaId y subscriptionType son requeridos', HttpStatus.BAD_REQUEST);
    }

    const subscription = await this.paymentService.createCompanySubscription(empresaId, subscriptionType);
    return { message: 'Suscripción creada exitosamente', subscription };
  }

  @Post('subscription-session')
  @ApiOperation({ summary: 'Crea una sesión de Stripe para suscripciones empresariales' })
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
  async createSubscriptionSession(
    @Body('empresaId') empresaId: string,
    @Body('subscriptionType') subscriptionType: 'ORO' | 'PLATA' | 'BRONCE',
  ) {
    if (!empresaId || !subscriptionType) {
      throw new HttpException('empresaId y subscriptionType son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createSubscriptionSession(empresaId, subscriptionType);
    return { url: session.url };
  }
}
