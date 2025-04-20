import { Profession, ProfessionType } from '@prisma/client';
export declare class UpdateMedicoDto {
    userId: string;
    profession?: Profession;
    type?: ProfessionType;
    verification?: string;
}
