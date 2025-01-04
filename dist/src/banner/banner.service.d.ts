import { PrismaService } from 'src/prisma/prisma.service';
import { Banner, Prisma } from '@prisma/client';
export declare class BannerService {
    private prisma;
    constructor(prisma: PrismaService);
    createBanner(data: Prisma.BannerCreateInput): Promise<Banner>;
    getBannerById(id: string): Promise<Banner>;
    getRandomBanner(): Promise<Banner | null>;
}
