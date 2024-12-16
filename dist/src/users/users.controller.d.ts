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
    checkUserByEmail(email: string): Promise<{
        exists: boolean;
        user?: Partial<import(".prisma/client").User>;
        debugInfo?: any;
    }>;
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
        profession: import(".prisma/client").$Enums.Profession;
        type: import(".prisma/client").$Enums.ProfessionType;
        verification: string;
        userId: string;
    }>;
    getMedico(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        profession: import(".prisma/client").$Enums.Profession;
        type: import(".prisma/client").$Enums.ProfessionType;
        verification: string;
        userId: string;
    }>;
    updateEmpresa(data: UpdateEmpresaDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        giro: import(".prisma/client").$Enums.Giro;
    }>;
    getEmpresa(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        giro: import(".prisma/client").$Enums.Giro;
    }>;
    updateInstructor(data: UpdateInstructorDto): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        profession: import(".prisma/client").$Enums.Profession;
        type: import(".prisma/client").$Enums.ProfessionType;
        userId: string;
        description: string;
        experienceYears: number;
        certificationsUrl: string;
        companyId: string | null;
    }>;
    getInstructor(req: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        profession: import(".prisma/client").$Enums.Profession;
        type: import(".prisma/client").$Enums.ProfessionType;
        userId: string;
        description: string;
        experienceYears: number;
        certificationsUrl: string;
        companyId: string | null;
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
