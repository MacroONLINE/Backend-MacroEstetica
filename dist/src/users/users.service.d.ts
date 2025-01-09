import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa, Instructor } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    createOrUpdateMedico(userId: string, data: Partial<Prisma.MedicoUncheckedCreateInput>): Promise<Medico>;
    createOrUpdateEmpresa(userId: string, data: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>): Promise<Empresa>;
    createOrUpdateInstructor(userId: string, data: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>): Promise<Instructor>;
    getMedicoByUserId(userId: string): Promise<Medico | null>;
    getEmpresaByUserId(userId: string): Promise<Empresa | null>;
    getInstructorByUserId(userId: string): Promise<Instructor | null>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    checkUserExistsByEmail(email: string): Promise<{
        exists: boolean;
        user?: Partial<User>;
        debugInfo?: any;
    }>;
    checkEmail(email: string): Promise<{
        id: string;
        phone: string | null;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string | null;
        lastName: string | null;
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
        newsletter: boolean;
        userSubscription: string | null;
    }>;
}
