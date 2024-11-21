import { Target } from '@prisma/client';
export declare class UpdateEmpresaDto {
    dni: string;
    name: string;
    target: Target;
    categoryId?: string;
}
