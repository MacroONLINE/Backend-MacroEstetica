import { FeatureCode } from '@prisma/client';
export declare class UsageResponseDto {
    code: FeatureCode;
    limit: number | null;
    used: number;
    items: any[];
}
