import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from '../courses/courses.service';
import Stripe from 'stripe';
export declare class PaymentService {
    private readonly configService;
    private readonly prisma;
    private readonly coursesService;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService, coursesService: CoursesService);
    createCheckoutSession(courseId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
}
