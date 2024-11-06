import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(data: CreateUserDto): Promise<{
        id: string;
        username: string;
        firstName: string | null;
        lastName: string | null;
        dni: string;
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
        userType: string;
        password: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
    }>;
}
