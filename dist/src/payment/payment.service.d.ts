import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentService {
    private readonly configService;
    private readonly prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCompanySubscriptionCheckoutSession(empresaId: string, subscriptionType: 'ORO' | 'PLATA' | 'BRONCE'): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    createCheckoutSession(courseId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    renewSubscriptions(): Promise<void>;
}
