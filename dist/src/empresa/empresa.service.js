"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let EmpresaService = class EmpresaService {
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async getAllByCategory(category) {
        return this.prisma.empresa.findMany({
            where: {
                giro: category,
            },
            include: {
                user: true,
            },
        });
    }
    async getAllByGiro(giro) {
        return this.prisma.empresa.findMany({
            where: {
                giro,
            },
            include: {
                user: true,
            },
        });
    }
    async getAllByTarget(target) {
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
    async getAllByGiroAndTarget(giro, target) {
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
    async getEmpresaConMinisite(empresaId) {
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
    async uploadCatalogue(empresaId, file) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
            include: { minisite: true },
        });
        if (!empresa) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (!empresa.minisite) {
            throw new common_1.HttpException('La Empresa no tiene Minisite asignado', common_1.HttpStatus.NOT_FOUND);
        }
        let uploadResult;
        try {
            uploadResult = await this.cloudinaryService.uploadImage(file);
        }
        catch (error) {
            throw new common_1.HttpException('Error al subir el catálogo a Cloudinary', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar la URL del catálogo en el Minisite', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPlanByUserId(userId) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { userId },
            include: {
                empresaSubscriptions: {
                    include: { subscription: true },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                },
            },
        });
        if (!empresa || empresa.empresaSubscriptions.length === 0) {
            throw new common_1.HttpException('Plan no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const sub = empresa.empresaSubscriptions[0];
        const today = new Date();
        const active = today <= sub.endDate;
        return {
            plan: sub.subscription,
            interval: sub.interval,
            billingEnd: sub.endDate,
            active,
        };
    }
    async verifyEmpresa(empresaId) {
        try {
            return await this.prisma.empresa.update({
                where: { id: empresaId },
                data: { verified: true },
                select: { id: true, name: true, verified: true },
            });
        }
        catch (_err) {
            throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map