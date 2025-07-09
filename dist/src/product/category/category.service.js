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
        await this.checkQuota(data.companyId, client_1.FeatureCode.CATEGORIES_TOTAL, 1);
        const created = await this.prisma.productCompanyCategory.create({
            data: {
                name: data.name,
                bannerImageUrl: data.bannerImageUrl,
                miniSiteImageUrl: data.miniSiteImageUrl,
                company: { connect: { id: data.companyId } },
            },
            include: {
                company: { select: { logo: true } },
            },
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
            include: {
                company: { select: { logo: true } },
            },
        });
    }
    async findOne(id) {
        const category = await this.prisma.productCompanyCategory.findUnique({
            where: { id },
            include: {
                company: { select: { logo: true } },
            },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async update(id, data) {
        await this.prisma.productCompanyCategory.findUniqueOrThrow({ where: { id } });
        return this.prisma.productCompanyCategory.update({
            where: { id },
            data,
            include: {
                company: { select: { logo: true } },
            },
        });
    }
    async remove(id) {
        const category = await this.prisma.productCompanyCategory.findUniqueOrThrow({
            where: { id },
            include: { company: { select: { logo: true } } },
        });
        await this.prisma.productCompanyCategory.delete({ where: { id } });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map