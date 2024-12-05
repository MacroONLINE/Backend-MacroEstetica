import { Target } from '../enums/target.enum';
export declare class CreateCourseDto {
    title: string;
    bannerUrl: string;
    courseImageUrl?: string;
    description: string;
    categoryId: string;
    level: string;
    price: number;
    discountPercentage?: number;
    target?: Target;
    instructorId?: string;
    whatYouWillLearn?: string;
    isFeatured?: boolean;
}
