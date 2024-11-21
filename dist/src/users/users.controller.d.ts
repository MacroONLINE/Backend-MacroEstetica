import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import * as Multer from 'multer';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(userData: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    completeProfile(userData: UpdateUserDto, empresaData?: UpdateEmpresaDto): Promise<{
        message: string;
    }>;
    updateMedico(req: any, data: UpdateMedicoDto, file?: Multer.Field): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        verification: string;
    }>;
    getMedico(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        verification: string;
    }>;
    updateEmpresa(req: any, data: UpdateEmpresaDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string | null;
    }>;
    getEmpresa(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string | null;
    }>;
    updateInstructor(req: any, data: UpdateInstructorDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        profession: import(".prisma/client").$Enums.Profession;
    }>;
    getInstructor(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        profession: import(".prisma/client").$Enums.Profession;
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
