import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        success: boolean;
    }>;
    register(data: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            email: string;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
        };
    }>;
}
