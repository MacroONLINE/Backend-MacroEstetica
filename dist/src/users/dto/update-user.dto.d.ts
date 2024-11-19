import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    province?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    zipCode?: string;
    verification?: string;
    dni?: string;
    bio?: string;
    newsletter?: boolean;
    role?: Role;
}
