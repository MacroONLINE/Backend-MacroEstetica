import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Banner, Prisma } from '@prisma/client';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  // Crear un banner
  async createBanner(data: Prisma.BannerCreateInput): Promise<Banner> {
    return this.prisma.banner.create({
      data,
    });
  }

  // Obtener banner por ID
  async getBannerById(id: string): Promise<Banner> {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });
    return banner;
  }

  // Obtener un banner aleatorio
  async getRandomBanner(): Promise<Banner | null> {
    // Contar cuántos banners existen
    const count = await this.prisma.banner.count();
    if (count === 0) {
      return null;
    }

    // Escoger un número al azar entre 0 y (count - 1)
    const randomIndex = Math.floor(Math.random() * count);

    // Obtener un banner con skip= randomIndex, take=1
    const banners = await this.prisma.banner.findMany({
      skip: randomIndex,
      take: 1,
    });
    return banners[0];
  }
}
