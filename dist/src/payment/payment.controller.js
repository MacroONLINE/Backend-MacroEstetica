const { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiBody, ApiResponse } = require('@nestjs/swagger');
const PaymentService = require('./payment.service');

@ApiTags('payment')
@Controller('payment')
class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({
    description: 'Información necesaria para crear la sesión de Stripe',
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso que el usuario desea comprar' },
        userId: { type: 'string', description: 'ID del usuario que realiza la compra' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Los parámetros courseId y userId son obligatorios.' })
  async createCheckoutSession(@Body() body) {
    const { courseId, userId } = body;

    if (!courseId || !userId) {
      throw new HttpException('courseId and userId are required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId);
    return { url: session.url };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones (webhooks) de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook se recibió correctamente.' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook.' })
  async handleWebhook(@Headers('stripe-signature') signature, @Req() req, @Res() res) {
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

module.exports = PaymentController;
