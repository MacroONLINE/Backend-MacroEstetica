import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentScheduler {
  constructor(private readonly paymentService: PaymentService) {}

  @Cron('0 0 1 * *') 
  async handleSubscriptionRenewals() {
    await this.paymentService.renewSubscriptions();
    console.log('Renovaciones de suscripciones completadas.');
  }
}
