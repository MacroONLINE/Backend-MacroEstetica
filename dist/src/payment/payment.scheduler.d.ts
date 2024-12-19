import { PaymentService } from './payment.service';
export declare class PaymentScheduler {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleSubscriptionRenewals(): Promise<void>;
}
