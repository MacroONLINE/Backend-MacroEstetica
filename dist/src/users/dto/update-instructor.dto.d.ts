import { Profession, ProfessionType, Gender } from '@prisma/client';
export declare class UpdateInstructorDto {
    userId: string;
    profession?: Profession;
    type?: ProfessionType;
    description?: string;
    experienceYears?: number;
    certificationsUrl?: string;
    status?: string;
    empresaId?: string;
    categoryId?: string;
    title?: string;
    bannerImage?: string;
    followers?: number;
    gender?: Gender;
    validated?: boolean;
}
