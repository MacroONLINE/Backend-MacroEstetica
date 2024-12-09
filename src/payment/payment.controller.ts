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
        courseId: { type: 'string', description: 'ID del curso que el usuario desea comprar' },
        userId: { type: 'string', description: 'ID del usuario que realiza la compra' },
      },
      required: ['courseId', 'userId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Falta el courseId o el userId.' })
  async createCheckoutSession(@Body() body: { courseId: string; userId: string }) {
    const { courseId, userId } = body;

    console.log('Cuerpo recibido:', body);

    // Validar campos requeridos
    if (!courseId) {
      throw new HttpException('courseId es requerido', HttpStatus.BAD_REQUEST);
    }
    if (!userId) {
      throw new HttpException('userId es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      // Llamar al servicio para crear la sesión
      const session = await this.paymentService.createCheckoutSession(courseId, userId);
      return { url: session.url };
    } catch (error) {
      console.error('Error en createCheckoutSession:', error.message);
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
    console.log('Webhook recibido con firma:', signature);

    if (!signature) {
      return res.status(400).send('Falta el header stripe-signature');
    }

    try {
      // Llamar al servicio para manejar el webhook
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error en el webhook:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
