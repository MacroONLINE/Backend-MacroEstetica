import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentController {
    private readonly paymentService;
    private readonly prisma;
    constructor(paymentService: PaymentService, prisma: PrismaService);
    createCheckoutSession(courseId: string, userId: string): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    enrollUser(courseId: string, userId: string): Promise<{
        message: string;
        enrollment: {
            id: string;
            userId: string;
            courseId: string;
            enrolledAt: Date;
        };
    }>;
}
