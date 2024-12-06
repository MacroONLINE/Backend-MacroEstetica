import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCheckoutSession(courseId: string, userId: string): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, req: Request, res: Response): Promise<void>;
}
