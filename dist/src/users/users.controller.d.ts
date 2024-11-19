import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(userData: CreateUserDto): Promise<{
        message: string;
    }>;
    completeProfile(userData: UpdateUserDto): Promise<{
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
    getProfile(req: any): Promise<{
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
    }>;
    updateMedico(req: any, data: UpdateMedicoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verification: string;
        userId: string;
    }>;
    getMedico(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verification: string;
        userId: string;
    }>;
    updateEmpresa(req: any, data: UpdateEmpresaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
    }>;
    getEmpresa(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
    }>;
    updateInstructor(req: any, data: UpdateInstructorDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
    }>;
    getInstructor(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bio: string | null;
    }>;
    findUserById(id: string): Promise<{
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
    }>;
}
