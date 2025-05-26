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
exports.MinisiteService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let MinisiteService = class MinisiteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async quotas(empresaId) {
        const plan = await this.plan(empresaId);
        const limits = await this.prisma.planFeature.findMany({ where: { plan } });
        const out = [];
        for (const f of limits) {
            const { items, used } = await this.collect(empresaId, f.code);
            out.push({ code: f.code, limit: f.limit, used, items });
        }
        return out;
    }
    async quota(empresaId, code) {
        const plan = await this.plan(empresaId);
        const feature = await this.prisma.planFeature.findUnique({
            where: { plan_code: { plan, code } },
        });
        if (!feature)
            throw new common_1.BadRequestException('Límite no definido');
        const { items, used } = await this.collect(empresaId, code);
        return { code, limit: feature.limit, used, items };
    }
    async objects(empresaId) {
        const plan = await this.plan(empresaId);
        const codes = await this.prisma.planFeature.findMany({
            where: { plan },
            select: { code: true },
        });
        const obj = {};
        for (const { code } of codes) {
            obj[code] = (await this.collect(empresaId, code)).items;
        }
        return obj;
    }
    async objectsByCode(empresaId, code) {
        return (await this.collect(empresaId, code)).items;
    }
    async upsertProduct(empresaId, data) {
        await this.checkQuota(empresaId, client_1.FeatureCode.PRODUCTS_TOTAL, data.id ? 0 : 1);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.product.update({
                where: { id },
                data: upd,
            });
        }
        return this.prisma.product.create({
            data: { ...data, companyId: empresaId },
        });
    }
    async upsertBanner(empresaId, data) {
        const existing = await this.prisma.banner.findFirst({ where: { empresaId } });
        if (!data.id && existing)
            throw new common_1.BadRequestException('Ya existe un banner');
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.banner.update({
                where: { id },
                data: upd,
            });
        }
        return this.prisma.banner.create({
            data: { ...data, empresaId },
        });
    }
    async upsertFeatured(empresaId, data) {
        await this.checkQuota(empresaId, client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL, data.id ? 0 : 1);
        const minisiteId = await this.minisite(empresaId);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.minisiteFeaturedProduct.update({
                where: { id },
                data: { ...upd, minisiteId },
            });
        }
        return this.prisma.minisiteFeaturedProduct.create({
            data: { ...data, minisiteId },
        });
    }
    async upsertHighlight(empresaId, data) {
        const minisiteId = await this.minisite(empresaId);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.minisiteHighlightProduct.update({
                where: { id },
                data: { ...upd, minisiteId },
            });
        }
        return this.prisma.minisiteHighlightProduct.upsert({
            where: { minisiteId_productId: { minisiteId, productId: data.productId } },
            update: { ...data },
            create: { ...data, minisiteId },
        });
    }
    async upsertSlide(empresaId, payload) {
        await this.checkQuota(empresaId, client_1.FeatureCode.STATIC_IMAGES_TOTAL, payload.id ? 0 : 1);
        const minisiteId = await this.minisite(empresaId);
        if (payload.id) {
            const { id, ...upd } = payload;
            return this.prisma.minisiteSlide.update({
                where: { id },
                data: upd,
            });
        }
        const createData = {
            minisiteId,
            title: payload.title,
            description: payload.description ?? '',
            cta: payload.cta ?? '',
            imageSrc: payload.imageSrc ?? '',
            order: payload.order ?? 0,
        };
        return this.prisma.minisiteSlide.create({ data: createData });
    }
    async plan(empresaId) {
        const e = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { subscription: true },
        });
        if (!e?.subscription)
            throw new common_1.BadRequestException('Empresa sin plan');
        return e.subscription;
    }
    async minisite(empresaId) {
        const m = await this.prisma.minisite.findUnique({
            where: { empresaId },
            select: { id: true },
        });
        if (!m)
            throw new common_1.NotFoundException('Minisite no existe');
        return m.id;
    }
    async checkQuota(empresaId, code, increment = 1) {
        const feature = await this.prisma.planFeature.findUnique({
            where: {
                plan_code: { plan: await this.plan(empresaId), code },
            },
        });
        if (!feature || feature.limit === null)
            return;
        const used = (await this.collect(empresaId, code)).used;
        if (used + increment > feature.limit) {
            throw new common_1.BadRequestException(`Límite de ${code} excedido`);
        }
    }
    async collect(empresaId, code) {
        let items = [];
        switch (code) {
            case client_1.FeatureCode.PRODUCTS_TOTAL:
                items = await this.prisma.product.findMany({
                    where: { companyId: empresaId },
                    select: { id: true, name: true, createdAt: true },
                });
                break;
            case client_1.FeatureCode.CATEGORIES_TOTAL:
                items = await this.prisma.productCompanyCategory.findMany({
                    where: { companyId: empresaId },
                    select: { id: true, name: true },
                });
                break;
            case client_1.FeatureCode.BANNER_PRODUCT_SLOTS:
                items = await this.prisma.banner.findMany({
                    where: { empresaId },
                    select: { id: true, title: true, banner: true },
                });
                break;
            case client_1.FeatureCode.STATIC_IMAGES_TOTAL:
                items = await this.prisma.minisiteSlide.findMany({
                    where: { minisite: { empresaId } },
                    select: { id: true, title: true, imageSrc: true },
                });
                break;
            case client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL:
                items = await this.prisma.minisiteFeaturedProduct.findMany({
                    where: { minisite: { empresaId } },
                    select: { id: true, productId: true, order: true },
                });
                break;
            case client_1.FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
                items = await this.prisma.classroom.findMany({
                    where: { orators: { some: { empresaId } } },
                    select: { id: true, title: true, startDateTime: true },
                });
                break;
            default:
                throw new common_1.BadRequestException('Código no soportado');
        }
        return { items, used: items.length };
    }
};
exports.MinisiteService = MinisiteService;
exports.MinisiteService = MinisiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MinisiteService);
//# sourceMappingURL=minisite.service.js.map