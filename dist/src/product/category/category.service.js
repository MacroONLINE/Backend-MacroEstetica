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
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        await this.checkQuota(data.companyId, 1);
        const created = await this.prisma.productCompanyCategory.create({
            data: {
                name: data.name,
                bannerImageUrl: data.bannerImageUrl,
                miniSiteImageUrl: data.miniSiteImageUrl,
                company: { connect: { id: data.companyId } },
            },
            include: { company: { select: { logo: true } } },
        });
        await this.prisma.companyUsage.upsert({
            where: { companyId_code: { companyId: data.companyId, code: client_1.FeatureCode.CATEGORIES_TOTAL } },
            update: { used: { increment: 1 } },
            create: { companyId: data.companyId, code: client_1.FeatureCode.CATEGORIES_TOTAL, used: 1 },
        });
        return created;
    }
    async findAll() {
        return this.prisma.productCompanyCategory.findMany({
            include: { company: { select: { logo: true } } },
        });
    }
    async findOne(id) {
        return this.prisma.productCompanyCategory.findUnique({
            where: { id },
            include: { company: { select: { logo: true } } },
        });
    }
    async update(id, data) {
        return this.prisma.productCompanyCategory.update({
            where: { id },
            data,
            include: { company: { select: { logo: true } } },
        });
    }
    async remove(id) {
        const removed = await this.prisma.productCompanyCategory.delete({
            where: { id },
            include: { company: { select: { id: true, logo: true } } },
        });
        await this.prisma.companyUsage.updateMany({
            where: { companyId: removed.company.id, code: client_1.FeatureCode.CATEGORIES_TOTAL },
            data: { used: { decrement: 1 } },
        });
        return removed;
    }
    async findAllByEmpresa(empresaId) {
        return this.prisma.productCompanyCategory.findMany({
            where: { companyId: empresaId },
            include: {
                products: true,
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
    async plan(companyId) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: companyId },
            select: { subscription: true },
        });
        if (!empresa?.subscription)
            throw new common_1.BadRequestException('Empresa sin plan');
        return empresa.subscription;
    }
    async checkQuota(companyId, increment = 1) {
        const feature = await this.prisma.planFeature.findUnique({
            where: {
                plan_code: {
                    plan: await this.plan(companyId),
                    code: client_1.FeatureCode.CATEGORIES_TOTAL,
                },
            },
        });
        if (!feature || feature.limit === null)
            return;
        const usage = await this.prisma.companyUsage.findUnique({
            where: { companyId_code: { companyId, code: client_1.FeatureCode.CATEGORIES_TOTAL } },
        });
        if ((usage?.used ?? 0) + increment > feature.limit) {
            throw new common_1.BadRequestException('Límite de categorías excedido');
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map