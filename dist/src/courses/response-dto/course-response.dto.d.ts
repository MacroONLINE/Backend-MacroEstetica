export declare class CourseResponseDto {
    id: string;
    title: string;
    description: string;
    aboutDescription?: string;
    totalHours: number;
    price: number;
    discountPercentage?: number;
    level: string;
    target: string;
    participantsCount: number;
    rating: number;
    isFeatured: boolean;
    bannerUrl: string;
    courseImageUrl: string;
    whatYouWillLearn?: any;
    requirements?: any;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    instructorName: string;
    instructorExperience: number;
    instructorCertificationsUrl: string;
    instructorStatus: string;
    totalResources: number;
    resources: {
        id: string;
        url: string;
    }[];
    totalModules: number;
    modules: ModuleResponseDto[];
}
export declare class ModuleResponseDto {
    id: string;
    description: string;
    classes: ClassResponseDto[];
}
export declare class ClassResponseDto {
    id: string;
    description: string;
}
