import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCheckoutSession(body: any): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
