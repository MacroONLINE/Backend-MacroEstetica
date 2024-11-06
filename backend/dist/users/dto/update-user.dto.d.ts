import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
}
