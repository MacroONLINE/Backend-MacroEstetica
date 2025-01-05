import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    private readonly logger;
    constructor(paymentService: PaymentService);
    createCheckoutSession(courseId: string, userId: string, email: string): Promise<{
        url: string;
    }>;
    createCompanySubscriptionCheckoutSession(empresaId: string, userId: string, subscriptionType: 'BASIC' | 'INTERMIDIATE' | 'PREMIUM', email: string): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createUserUpgradeCheckoutSession(userId: string, email: string): Promise<{
        url: string;
    }>;
}
