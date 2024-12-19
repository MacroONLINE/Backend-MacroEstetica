import { Target } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    bannerUrl: string;
    courseImageUrl?: string;
    description: string;
    aboutDescription?: string;
    totalHours?: number;
    categoryId: string;
    level: string;
    price: number;
    discountPercentage?: number;
    target?: Target;
    instructorId?: string;
    whatYouWillLearn?: string;
    requirements?: string;
    isFeatured?: boolean;
}
