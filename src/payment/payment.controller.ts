import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('payment') 
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso que el usuario desea comprar' },
        userId: { type: 'string', description: 'ID del usuario que realiza la compra' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Falta el courseId o el userId.' })
  async createCheckoutSession(@Body() body: any) {
    // Log para inspeccionar el cuerpo recibido
    console.log('Cuerpo recibido:', body);

    const { courseId, userId } = body;

    // Validación específica para cada campo
    if (!courseId) {
      throw new HttpException('courseId is required', HttpStatus.BAD_REQUEST);
    }

    if (!userId) {
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const session = await this.paymentService.createCheckoutSession(courseId, userId);
      return { url: session.url };
    } catch (error) {
      console.error('Error al crear la sesión de Stripe:', error.message);
      throw new HttpException('Error al crear la sesión de Stripe', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones (webhooks) de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook se recibió correctamente.' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook.' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!signature) {
      console.error('Falta el header stripe-signature'); // Log de error
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      res.status(200).send(result);
    } catch (error) {
      console.error('Webhook Error:', error.message); // Log de error
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
