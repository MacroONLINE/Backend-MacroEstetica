import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    register(userData: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    completeProfile(userData: UpdateUserDto): Promise<{
        message: string;
    }>;
    updateMedico(file: Express.Multer.File, data: UpdateMedicoDto): Promise<{
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
    updateEmpresa(data: UpdateEmpresaDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string | null;
    }>;
    getEmpresa(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string | null;
    }>;
    updateInstructor(data: UpdateInstructorDto): Promise<{
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
