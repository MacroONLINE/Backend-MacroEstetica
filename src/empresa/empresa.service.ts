import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Giro, Target } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EmpresaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllByCategory(category: Giro) {
    return this.prisma.empresa.findMany({
      where: {
        giro: category,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByGiro(giro: Giro) {
    return this.prisma.empresa.findMany({
      where: {
        giro,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByTarget(target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        user: {
          role: target,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByGiroAndTarget(giro: Giro, target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        giro,
        user: {
          role: target,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getEmpresaConMinisite(empresaId: string) {
    return this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        instructores: true,
        productos: true,
        banners: true,
        categorias: {
          include: {
            products: true,
          },
        },
        minisite: {
          include: {
            slides: true,
            benefits: true,
            offers: {
              include: {
                products: true,
              },
            },
            featuredProducts: {
              include: {
                product: true,
              },
            },
            highlightProducts: {
              include: {
                product: true,
              },
            },
            specialities: true,
          },
        },
      },
    });
  }

  // -----------------------------------------------
  // NUEVO MÉTODO PARA SUBIR EL PDF A CLOUDINARY
  // Y GUARDAR EL URL EN 'catalogueUrl' DE MINISITE
  // -----------------------------------------------
  async uploadCatalogue(empresaId: string, file: Express.Multer.File) {
    // Verificamos que exista la Empresa y el Minisite
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: { minisite: true },
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    if (!empresa.minisite) {
      throw new HttpException('La Empresa no tiene Minisite asignado', HttpStatus.NOT_FOUND);
    }

    // Subimos el archivo a Cloudinary
    let uploadResult;
    try {
      uploadResult = await this.cloudinaryService.uploadImage(file);
    } catch (error) {
      throw new HttpException(
        'Error al subir el catálogo a Cloudinary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Actualizamos el campo catalogueUrl en Minisite
    try {
      const updatedMinisite = await this.prisma.minisite.update({
        where: { empresaId: empresa.id },
        data: {
          catalogueUrl: uploadResult.secure_url,
        },
      });
      return {
        message: 'Catálogo subido correctamente',
        catalogueUrl: updatedMinisite.catalogueUrl,
      };
    } catch (error) {
      throw new HttpException(
        'Error al actualizar la URL del catálogo en el Minisite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPlanByUserId(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { userId },
      include: {
        empresaSubscriptions: {
          where   : { status: 'active' },
          include : { subscription: true },
          orderBy : { startDate: 'desc' },
          take    : 1,
        },
      },
    });
  
    if (!empresa || empresa.empresaSubscriptions.length === 0) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }
  
    const sub = empresa.empresaSubscriptions[0];
    return {
      plan       : sub.subscription,     
      interval   : sub.interval,         
      billingEnd : sub.endDate,          
    };
  }
  

}
