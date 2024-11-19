import { CourseLevel } from '@prisma/client';
export declare class CreateCourseDto {
    name: string;
    description?: string;
    cost: number;
    discount?: number;
    level: CourseLevel;
    featured?: boolean;
}
