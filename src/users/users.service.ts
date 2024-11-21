import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa, Instructor } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create user with email and password (Step 1)
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  // Update user profile (Step 2)
  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
    roleData?: {
      medicoData?: Omit<Prisma.MedicoUncheckedCreateInput, 'userId'>;
      empresaData?: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>;
      instructorData?: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>;
    },
  ): Promise<User> {
    const { medicoData, empresaData, instructorData } = roleData || {};

    // Update the user profile
    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });

    // Handle role-specific data
    if (medicoData) {
      await this.createOrUpdateMedico(id, medicoData);
    } else if (empresaData) {
      await this.createOrUpdateEmpresa(id, empresaData);
    } else if (instructorData) {
      await this.createOrUpdateInstructor(id, instructorData);
    }

    return user;
  }

  // Create or update Medico information
  async createOrUpdateMedico(
    userId: string,
    data: Partial<Prisma.MedicoUncheckedCreateInput>, // Allow partial inputs
  ): Promise<Medico> {
    const createData: Prisma.MedicoUncheckedCreateInput = {
      userId, // Required field
      verification: data.verification || '', // Provide a default if undefined
    };
  
    return this.prisma.medico.upsert({
      where: { userId },
      update: {
        ...data,
      }, // Update with provided fields
      create: createData, // Create a new record if not found
    });
  }
  

  // Create or update Empresa information
  async createOrUpdateEmpresa(
    userId: string,
    data: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>,
  ): Promise<Empresa> {
    return this.prisma.empresa.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  // Create or update Instructor information
  async createOrUpdateInstructor(
    userId: string,
    data: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>,
  ): Promise<Instructor> {
    return this.prisma.instructor.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  // Get Medico by user ID
  async getMedicoByUserId(userId: string): Promise<Medico | null> {
    return this.prisma.medico.findUnique({
      where: { userId },
    });
  }

  // Get Empresa by user ID
  async getEmpresaByUserId(userId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({
      where: { userId },
    });
  }

  // Get Instructor by user ID
  async getInstructorByUserId(userId: string): Promise<Instructor | null> {
    return this.prisma.instructor.findUnique({
      where: { userId },
    });
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }
}
