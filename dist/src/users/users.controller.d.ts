import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(userData: CreateUserDto): Promise<{
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
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
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
    getUserByEmail(email: string): Promise<{
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
        password: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        newsletter: boolean;
    }>;
    getUserById(id: string): Promise<{
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
        password: string;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        newsletter: boolean;
    }>;
    getMedicoByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verificacion: string;
        userId: string;
    }>;
    updateMedico(userId: string, data: UpdateMedicoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verificacion: string;
        userId: string;
    }>;
    getEmpresaByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
    }>;
    updateEmpresa(userId: string, data: UpdateEmpresaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
    }>;
}
