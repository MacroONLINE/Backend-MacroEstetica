import { Profession, ProfessionType } from '@prisma/client';
export declare class CreateInstructorDto {
    profession: Profession;
    type: ProfessionType;
    description?: string;
    experienceYears?: number;
    certificationsUrl?: string;
    status: string;
    userId: string;
    empresaId?: string;
    categoryId?: string;
}
