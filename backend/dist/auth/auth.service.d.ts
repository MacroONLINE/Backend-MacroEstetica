import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
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
}
