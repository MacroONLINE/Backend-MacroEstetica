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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
let CategoryService = class CategoryService {
    constructor(prisma, cloud) {
        this.prisma = prisma;
        this.cloud = cloud;
    }
    async create(dto, banner, minisite) {
        const existing = await this.prisma.productCompanyCategory.findUnique({
            where: {
                name_companyId: {
                    name: dto.name,
                    companyId: dto.companyId,
                },
            },
            include: { company: { select: { logo: true } } },
        });
        const bannerUrl = banner
            ? (await this.cloud.uploadImage(banner)).secure_url
            : existing?.bannerImageUrl ?? '';
        const minisiteUrl = minisite
            ? (await this.cloud.uploadImage(minisite)).secure_url
            : existing?.miniSiteImageUrl ?? '';
        if (existing) {
            return this.prisma.productCompanyCategory.update({
                where: { id: existing.id },
                data: {
                    bannerImageUrl: bannerUrl,
                    miniSiteImageUrl: minisiteUrl,
                },
                include: { company: { select: { logo: true } } },
            });
        }
        await this.checkQuota(dto.companyId, client_1.FeatureCode.CATEGORIES_TOTAL, 1);
        const created = await this.prisma.productCompanyCategory.create({
            data: {
                name: dto.name,
                bannerImageUrl: bannerUrl,
                miniSiteImageUrl: minisiteUrl,
                companyId: dto.companyId,
            },
            include: { company: { select: { logo: true } } },
        });
        await this.prisma.companyUsage.upsert({
            where: {
                companyId_code: {
                    companyId: dto.companyId,
                    code: client_1.FeatureCode.CATEGORIES_TOTAL,
                },
            },
            update: { used: { increment: 1 } },
            create: {
                companyId: dto.companyId,
                code: client_1.FeatureCode.CATEGORIES_TOTAL,
                used: 1,
            },
        });
        return created;
    }
    async findAll() {
        return this.prisma.productCompanyCategory.findMany({
            include: { company: { select: { logo: true } } },
        });
    }
    async findOne(id) {
        const cat = await this.prisma.productCompanyCategory.findUnique({
            where: { id },
            include: { company: { select: { logo: true } } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async update(id, patch, banner, minisite) {
        const current = await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } });
        const bannerUrl = banner
            ? (await this.cloud.uploadImage(banner)).secure_url
            : current.bannerImageUrl;
        const minisiteUrl = minisite
            ? (await this.cloud.uploadImage(minisite)).secure_url
            : current.miniSiteImageUrl;
        return this.prisma.productCompanyCategory.update({
            where: { id },
            data: {
                ...patch,
                bannerImageUrl: bannerUrl,
                miniSiteImageUrl: minisiteUrl,
            },
            include: { company: { select: { logo: true } } },
        });
    }
    async remove(id) {
        const category = await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } });
        await this.prisma.productCompanyCategory.delete({ where: { id } });
        await this.prisma.companyUsage.upsert({
            where: {
                companyId_code: {
                    companyId: category.companyId,
                    code: client_1.FeatureCode.CATEGORIES_TOTAL,
                },
            },
            update: { used: { decrement: 1 } },
            create: {
                companyId: category.companyId,
                code: client_1.FeatureCode.CATEGORIES_TOTAL,
                used: 0,
            },
        });
        return category;
    }
    async findAllByEmpresa(empresaId) {
        return this.prisma.productCompanyCategory.findMany({
            where: { companyId: empresaId },
            include: {
                products: { select: { id: true, name: true } },
                company: { select: { logo: true } },
            },
        });
    }
    async findCategoriesByEmpresa(empresaId) {
        return this.prisma.productCompanyCategory.findMany({
            where: { companyId: empresaId },
            select: {
                id: true,
                name: true,
                bannerImageUrl: true,
                miniSiteImageUrl: true,
            },
        });
    }
    async plan(empresaId) {
        const e = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { subscription: true },
        });
        if (!e?.subscription)
            throw new common_1.BadRequestException('Empresa without subscription');
        return e.subscription;
    }
    async checkQuota(empresaId, code, increment = 1) {
        const plan = await this.plan(empresaId);
        const feature = await this.prisma.planFeature.findUnique({
            where: { plan_code: { plan, code } },
        });
        if (!feature || feature.limit === null)
            return;
        const usage = await this.prisma.companyUsage.findUnique({
            where: { companyId_code: { companyId: empresaId, code } },
        });
        if ((usage?.used ?? 0) + increment > feature.limit) {
            throw new common_1.BadRequestException(`Quota for ${code} exceeded`);
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], CategoryService);
//# sourceMappingURL=category.service.js.map