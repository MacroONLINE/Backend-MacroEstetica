import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    findUserById(id: string): Promise<User | null>;
    getMedicoByUserId(userId: string): Promise<Medico | null>;
    updateMedico(userId: string, data: Prisma.MedicoUpdateInput): Promise<Medico>;
    getEmpresaByUserId(userId: string): Promise<Empresa | null>;
    updateEmpresa(userId: string, data: Prisma.EmpresaUpdateInput): Promise<Empresa>;
}
