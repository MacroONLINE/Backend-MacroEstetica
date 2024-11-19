import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa, Instructor } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    updateUser(id: string, data: Prisma.UserUpdateInput, roleData?: {
        medicoData?: Omit<Prisma.MedicoUncheckedCreateInput, 'userId'>;
        empresaData?: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>;
        instructorData?: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>;
    }): Promise<User>;
    createOrUpdateMedico(userId: string, data: Omit<Prisma.MedicoUncheckedCreateInput, 'userId'>): Promise<Medico>;
    createOrUpdateEmpresa(userId: string, data: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>): Promise<Empresa>;
    createOrUpdateInstructor(userId: string, data: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>): Promise<Instructor>;
    updateMedico(userId: string, data: Prisma.MedicoUpdateInput): Promise<Medico>;
    updateEmpresa(userId: string, data: Prisma.EmpresaUpdateInput): Promise<Empresa>;
    updateInstructor(userId: string, data: Prisma.InstructorUpdateInput): Promise<Instructor>;
    getMedicoByUserId(userId: string): Promise<Medico | null>;
    getEmpresaByUserId(userId: string): Promise<Empresa | null>;
    getInstructorByUserId(userId: string): Promise<Instructor | null>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
}
