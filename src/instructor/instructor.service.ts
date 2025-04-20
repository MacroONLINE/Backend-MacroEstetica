import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) {}

  async createInstructor(data: CreateInstructorDto) {
    let computedTitle = data.title;
    if (!computedTitle) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { firstName: true, lastName: true },
      });
      if (user) {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        computedTitle = `${firstName} ${lastName}`.trim();
      }
    }
    return this.prisma.instructor.create({
      data: {
        profession: data.profession,
        type: data.type,
        description: data.description,
        experienceYears: data.experienceYears ?? 0,
        certificationsUrl: data.certificationsUrl,
        status: data.status,
        userId: data.userId,
        empresaId: data.empresaId,
        categoryId: data.categoryId,
        bannerImage: data.bannerImage,
        followers: data.followers ?? 0,
        title: computedTitle,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async getAllInstructors() {
    return this.prisma.instructor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async getInstructorById(id: string) {
    return this.prisma.instructor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async getInstructorsByCategory(categoryId: string) {
    return this.prisma.instructor.findMany({
      where: { categoryId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async getInstructorsByEmpresa(empresaId: string) {
    return this.prisma.instructor.findMany({
      where: { empresaId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async updateInstructor(id: string, dto: UpdateInstructorDto) {
    let computedTitle = dto.title;
    if (!computedTitle && dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        select: { firstName: true, lastName: true },
      });
      if (user) {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        computedTitle = `${firstName} ${lastName}`.trim();
      }
    }

    const updateData: Prisma.InstructorUncheckedUpdateInput = {};

    if (dto.profession !== undefined) {
      updateData.profession = dto.profession;
    }
    if (dto.type !== undefined) {
      updateData.type = dto.type;
    }
    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }
    if (dto.experienceYears !== undefined) {
      updateData.experienceYears = dto.experienceYears;
    }
    if (dto.certificationsUrl !== undefined) {
      updateData.certificationsUrl = dto.certificationsUrl;
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }
    if (dto.userId !== undefined) {
      updateData.userId = dto.userId;
    }
    if (dto.empresaId !== undefined) {
      updateData.empresaId = dto.empresaId;
    }
    if (dto.categoryId !== undefined) {
      updateData.categoryId = dto.categoryId;
    }
    if (dto.bannerImage !== undefined) {
      updateData.bannerImage = dto.bannerImage;
    }
    if (dto.followers !== undefined) {
      updateData.followers = dto.followers;
    }
    if (computedTitle !== undefined) {
      updateData.title = computedTitle;
    }
    if (dto.gender !== undefined) {
      updateData.genero = dto.gender;
    }
    if (dto.validated !== undefined) {
      updateData.validated = dto.validated;
    }

    return this.prisma.instructor.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }

  async deleteInstructor(id: string) {
    return this.prisma.instructor.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
      },
    });
  }
}
