import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionType } from '@prisma/client';
export declare class PaymentService {
    private readonly configService;
    private readonly prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCompanySubscriptionCheckoutSession(empresaId: string, subscriptionType: SubscriptionType): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    private validateSubscriptionType;
    private getSubscriptionPrice;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    createCheckoutSession(courseId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    renewSubscriptions(): Promise<void>;
}
