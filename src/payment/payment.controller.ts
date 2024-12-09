import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('payment') // Esto agrupa los endpoints en la sección "payment" de Swagger
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({ schema: { 
    properties: {
      courseId: { type: 'string' },
      userId: { type: 'string' }
    }
  }})
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  async createCheckoutSession(
    @Body('courseId') courseId: string,
    @Body('userId') userId: string,
  ) {
    if (!courseId || !userId) {
      throw new HttpException('courseId and userId are required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId);
    return { url: session.url };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones (webhooks) de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook se recibió correctamente.' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      res.status(200).send(result);
    } catch (error) {
      console.error('Webhook Error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
