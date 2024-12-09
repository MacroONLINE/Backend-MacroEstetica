import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
export declare class PaymentService {
    private readonly prisma;
    private readonly configService;
    private stripe;
    constructor(prisma: PrismaService, configService: ConfigService);
    createCheckoutSession(courseId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
}
