import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionType } from '@prisma/client';
export declare class PaymentService {
    private readonly configService;
    private readonly prisma;
    private readonly stripe;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckoutSession(courseId: string, userId: string, email: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createCompanySubscriptionCheckoutSession(empresaId: string, userId: string, subscriptionType: SubscriptionType, email: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createUserUpgradeCheckoutSession(userId: string, email: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createEventCheckoutSession(eventId: string, userId: string, email: string): Promise<Stripe.Checkout.Session>;
    createWorkshopCheckoutSession(workshopId: string, userId: string, email: string): Promise<Stripe.Checkout.Session>;
    createClassroomCheckoutSession(classroomId: string, userId: string, email: string): Promise<Stripe.Checkout.Session>;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private processTransaction;
    private isValidCompanySubscription;
    private createEmpresaSubscription;
    private cancelEmpresaSubscription;
    private enrollUserInCourse;
    private enrollUserInEvent;
    private enrollUserInWorkshop;
    private enrollUserInClassroom;
    private upgradeUserSubscription;
    private downgradeUserSubscription;
    renewSubscriptions(): Promise<void>;
    private validateSubscriptionType;
    private getSubscriptionPrice;
}
