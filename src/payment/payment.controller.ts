import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
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
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    if (!signature) {
      res.status(400).send('Missing stripe-signature header');
      return;
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
