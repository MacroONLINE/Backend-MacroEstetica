import { Profession, ProfessionType } from '@prisma/client';
export declare class UpdateInstructorDto {
    profession: Profession;
    type: ProfessionType;
    description: string;
    experienceYears: number;
    certificationsUrl: string;
    status: string;
    userId: string;
}
