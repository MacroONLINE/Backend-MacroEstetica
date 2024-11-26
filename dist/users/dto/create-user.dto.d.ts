import { Role } from '@prisma/client';
export declare class CreateUserDto {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: Role;
}
