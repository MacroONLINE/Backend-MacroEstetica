import { Role } from '@prisma/client';
export declare class CreateUserDto {
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: Role;
    phone?: string;
    address?: string;
    province?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    zipCode?: string;
    verificacion?: string;
    dni?: string;
    newsletter?: boolean;
}
