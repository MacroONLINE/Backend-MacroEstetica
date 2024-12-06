import { ConfigService } from '@nestjs/config';
import { CoursesService } from '../courses/courses.service';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
export declare class PaymentService {
    private readonly configService;
    private readonly coursesService;
    private readonly prisma;
    private stripe;
    constructor(configService: ConfigService, coursesService: CoursesService, prisma: PrismaService);
    createCheckoutSession(courseId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhookEvent(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
}
