import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    private readonly logger;
    constructor(paymentService: PaymentService);
    createCheckoutSession(courseId: string, userId: string): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createCompanySubscription(empresaId: string, subscriptionType: 'ORO' | 'PLATA' | 'BRONCE'): Promise<{
        message: string;
        subscription: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            empresaId: string;
            subscriptionId: string;
            startDate: Date;
            endDate: Date;
        };
    }>;
    createSubscriptionSession(empresaId: string, subscriptionType: 'ORO' | 'PLATA' | 'BRONCE'): Promise<{
        url: string;
    }>;
}
