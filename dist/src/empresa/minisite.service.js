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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let MinisiteService = class MinisiteService {
    constructor(prisma, cloud) {
        this.prisma = prisma;
        this.cloud = cloud;
        this.log = new common_1.Logger('MinisiteService');
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
        const feature = await this.prisma.planFeature.findUnique({ where: { plan_code: { plan, code } } });
        if (!feature)
            throw new common_1.BadRequestException('Límite no definido');
        const { items, used } = await this.collect(empresaId, code);
        return { code, limit: feature.limit, used, items };
    }
    async objects(empresaId) {
        const plan = await this.plan(empresaId);
        const codes = await this.prisma.planFeature.findMany({ where: { plan }, select: { code: true } });
        const obj = {};
        for (const { code } of codes)
            obj[code] = (await this.collect(empresaId, code)).items;
        return obj;
    }
    async objectsByCode(empresaId, code) {
        return (await this.collect(empresaId, code)).items;
    }
    async upsertProduct(empresaId, data) {
        await this.checkQuota(empresaId, client_1.FeatureCode.PRODUCTS_TOTAL, data.id ? 0 : 1);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.product.update({ where: { id }, data: upd });
        }
        return this.prisma.product.create({ data: { ...data, companyId: empresaId } });
    }
    async upsertBanner(empresaId, data) {
        const existing = await this.prisma.banner.findFirst({ where: { empresaId } });
        if (!data.id && existing)
            throw new common_1.BadRequestException('Ya existe un banner');
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.banner.update({ where: { id }, data: upd });
        }
        return this.prisma.banner.create({ data: { ...data, empresaId } });
    }
    async upsertFeatured(empresaId, data) {
        await this.checkQuota(empresaId, client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL, data.id ? 0 : 1);
        const minisiteId = await this.minisite(empresaId);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.minisiteFeaturedProduct.update({ where: { id }, data: { ...upd, minisiteId } });
        }
        return this.prisma.minisiteFeaturedProduct.create({ data: { ...data, minisiteId } });
    }
    async upsertHighlight(empresaId, data) {
        const minisiteId = await this.minisite(empresaId);
        if (data.id) {
            const { id, ...upd } = data;
            return this.prisma.minisiteHighlightProduct.update({ where: { id }, data: { ...upd, minisiteId } });
        }
        return this.prisma.minisiteHighlightProduct.upsert({
            where: { minisiteId_productId: { minisiteId, productId: data.productId } },
            update: { ...data },
            create: { ...data, minisiteId },
        });
    }
    async getMinisiteSetup(empresaId) {
        const plan = await this.plan(empresaId);
        const slotLimit = await this.prisma.planFeature.findUnique({
            where: { plan_code: { plan, code: client_1.FeatureCode.BANNER_PRODUCT_SLOTS } },
            select: { limit: true },
        });
        const company = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
            select: {
                name: true,
                location: true,
                title: true,
                giro: true,
                profileImage: true,
                minisite: { select: { minisiteColor: true, slogan: true } },
            },
        });
        if (!company)
            throw new common_1.NotFoundException('Empresa no encontrada');
        const slides = await this.prisma.minisiteSlide.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true, description: true, cta: true, imageSrc: true, order: true },
        });
        const banners = await this.prisma.banner.findMany({ where: { empresaId } });
        return {
            company,
            minisiteColor: company.minisite?.minisiteColor ?? null,
            slides,
            slideUsage: { used: slides.length, limit: slotLimit?.limit ?? null },
            banners,
        };
    }
    async setupMinisite(empresaId, body, files) {
        let logoUrl;
        if (files.logo) {
            const res = await this.cloud.uploadImage(files.logo);
            logoUrl = res.secure_url;
        }
        await this.prisma.empresa.update({
            where: { id: empresaId },
            data: {
                name: body.name,
                profileImage: logoUrl,
                title: body.slogan,
                location: body.description,
                giro: body.giro,
            },
        });
        await this.prisma.minisite.update({
            where: { empresaId },
            data: {
                minisiteColor: body.minisiteColor ?? undefined,
                slogan: body.slogan,
            },
        });
        const newSlides = files.slides ?? [];
        if (newSlides.length) {
            const plan = await this.plan(empresaId);
            const limitRow = await this.prisma.planFeature.findUnique({
                where: { plan_code: { plan, code: client_1.FeatureCode.BANNER_PRODUCT_SLOTS } },
            });
            if (limitRow?.limit != null && newSlides.length > limitRow.limit) {
                throw new common_1.BadRequestException(`Máximo ${limitRow.limit} slides permitidos`);
            }
        }
        const minisiteId = await this.minisite(empresaId);
        const existingCount = await this.prisma.minisiteSlide.count({ where: { minisiteId } });
        await this.prisma.$transaction(async (tx) => {
            if (newSlides.length) {
                if (existingCount) {
                    await tx.minisiteSlide.deleteMany({ where: { minisiteId } });
                }
                const uploads = await Promise.all(newSlides.map((f) => this.cloud.uploadImage(f)));
                const data = uploads.map((u, idx) => ({
                    minisiteId,
                    imageSrc: u.secure_url,
                    title: body.slidesMeta[idx]?.title ?? '',
                    description: body.slidesMeta[idx]?.description ?? '',
                    cta: body.slidesMeta[idx]?.cta ?? '',
                    order: body.slidesMeta[idx]?.order ?? idx,
                }));
                await tx.minisiteSlide.createMany({ data });
                await tx.companyUsage.upsert({
                    where: { companyId_code: { companyId: empresaId, code: client_1.FeatureCode.BANNER_PRODUCT_SLOTS } },
                    update: { used: newSlides.length },
                    create: { companyId: empresaId, code: client_1.FeatureCode.BANNER_PRODUCT_SLOTS, used: newSlides.length },
                });
            }
        });
        return { ok: true };
    }
    async bulkUpsertProductsIndexed(empresaId, meta, files) {
        const minisiteId = await this.minisite(empresaId);
        const prepared = await Promise.all(meta.map(async (m, idx) => {
            const bucket = files[idx] ?? { gallery: [] };
            if (!bucket.main)
                throw new common_1.BadRequestException(`main_${idx} es obligatorio`);
            const mainUrl = (await this.cloud.uploadImage(bucket.main)).secure_url;
            const galleryUrls = await Promise.all(bucket.gallery.map((g) => this.cloud.uploadImage(g).then((r) => r.secure_url)));
            return { meta: m, mainUrl, galleryUrls };
        }));
        return this.prisma.$transaction(async (tx) => {
            const toCreate = prepared.filter((p) => !p.meta.id).length;
            await this.checkQuota(empresaId, client_1.FeatureCode.PRODUCTS_TOTAL, toCreate);
            const delta = {
                [client_1.FeatureCode.PRODUCTS_TOTAL]: 0,
                [client_1.FeatureCode.CATEGORIES_TOTAL]: 0,
                [client_1.FeatureCode.BANNER_PRODUCT_SLOTS]: 0,
                [client_1.FeatureCode.STATIC_IMAGES_TOTAL]: 0,
                [client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL]: 0,
                [client_1.FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]: 0,
                [client_1.FeatureCode.OFFER_PRODUCTS_TOTAL]: 0,
                [client_1.FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL]: 0,
                [client_1.FeatureCode.SPECIALITY_IMAGES_TOTAL]: 0,
            };
            const out = [];
            for (const { meta: m, mainUrl, galleryUrls } of prepared) {
                if (!m.id && m.categoryId != null) {
                    const current = await tx.product.count({ where: { companyId: empresaId, categoryId: m.categoryId } });
                    if (current >= 12)
                        throw new common_1.BadRequestException(`Categoría #${m.categoryId} ya tiene 12 productos`);
                }
                const presentationsArr = typeof m.presentations === 'string'
                    ? m.presentations.split(',').map((s) => s.trim()).filter(Boolean)
                    : m.presentations ?? [];
                const productData = {
                    name: m.name,
                    description: m.description,
                    companyId: empresaId,
                    categoryId: m.categoryId ?? null,
                    activeIngredients: m.activeIngredients ?? [],
                    benefits: m.benefits ?? [],
                    features: m.features ?? [],
                    presentations: presentationsArr,
                    isFeatured: m.isFeatured,
                    isBestSeller: m.isBestSeller,
                    isOnSale: m.isOnSale,
                    lab: m.lab,
                    problemAddressed: m.problemAddressed,
                    imageMain: mainUrl,
                    imageGallery: galleryUrls,
                };
                const product = m.id
                    ? await tx.product.update({ where: { id: m.id }, data: productData })
                    : await tx.product.create({ data: productData });
                if (!m.id)
                    delta[client_1.FeatureCode.PRODUCTS_TOTAL]++;
                const type = (m.type ?? 'NORMAL').toUpperCase();
                if (type === 'FEATURED') {
                    await this.checkQuota(empresaId, client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL, m.id ? 0 : 1);
                    await tx.minisiteFeaturedProduct.upsert({
                        where: { productId: product.id },
                        update: { minisiteId, order: m.order ?? 0, tagline: m.tagline ?? '' },
                        create: { minisiteId, productId: product.id, order: m.order ?? 0, tagline: m.tagline ?? '' },
                    });
                    if (!m.id)
                        delta[client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL]++;
                }
                else if (type === 'HIGHLIGHT') {
                    await this.checkQuota(empresaId, client_1.FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL, m.id ? 0 : 1);
                    await tx.minisiteHighlightProduct.upsert({
                        where: { minisiteId_productId: { minisiteId, productId: product.id } },
                        update: { highlightFeatures: m.highlightFeatures ?? [], highlightDescription: m.highlightDescription ?? '' },
                        create: { minisiteId, productId: product.id, highlightFeatures: m.highlightFeatures ?? [], highlightDescription: m.highlightDescription ?? '' },
                    });
                    if (!m.id)
                        delta[client_1.FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL]++;
                }
                else if (type === 'OFFER') {
                    await this.checkQuota(empresaId, client_1.FeatureCode.OFFER_PRODUCTS_TOTAL, m.id ? 0 : 1);
                    await tx.minisiteProductOffer.upsert({
                        where: { minisiteId_productId: { minisiteId, productId: product.id } },
                        update: { title: m.title ?? product.name, description: m.offerDescription ?? '' },
                        create: { minisiteId, productId: product.id, title: m.title ?? product.name, description: m.offerDescription ?? '' },
                    });
                    if (!m.id)
                        delta[client_1.FeatureCode.OFFER_PRODUCTS_TOTAL]++;
                }
                out.push({ productId: product.id, type });
            }
            for (const [code, inc] of Object.entries(delta)) {
                if (inc === 0)
                    continue;
                await tx.companyUsage.upsert({
                    where: { companyId_code: { companyId: empresaId, code } },
                    update: { used: { increment: inc } },
                    create: { companyId: empresaId, code, used: inc },
                });
            }
            return out;
        }, { maxWait: 10_000, timeout: 120_000 });
    }
    async getSpecialities(empresaId) {
        return this.prisma.minisiteSpeciality.findMany({
            where: { minisite: { empresaId } },
            select: { id: true, title: true, imageUrl: true },
        });
    }
    async registerSpecialities(empresaId, body, files) {
        const metas = JSON.parse(body.specialitiesMeta || '[]');
        const count = metas.length;
        await this.checkQuota(empresaId, client_1.FeatureCode.SPECIALITY_IMAGES_TOTAL, count);
        const minisiteId = await this.minisite(empresaId);
        const uploads = await Promise.all(files.map(f => this.cloud.uploadImage(f)));
        return this.prisma.$transaction(async (tx) => {
            await tx.minisiteSpeciality.deleteMany({ where: { minisiteId } });
            const data = metas.map((m, idx) => ({
                minisiteId,
                title: m.title,
                imageUrl: uploads[idx]?.secure_url ?? '',
            }));
            await tx.minisiteSpeciality.createMany({ data });
            await tx.companyUsage.upsert({
                where: { companyId_code: { companyId: empresaId, code: client_1.FeatureCode.SPECIALITY_IMAGES_TOTAL } },
                update: { used: count },
                create: { companyId: empresaId, code: client_1.FeatureCode.SPECIALITY_IMAGES_TOTAL, used: count },
            });
            return tx.minisiteSpeciality.findMany({
                where: { minisiteId },
                select: { id: true, title: true, imageUrl: true },
            });
        });
    }
    async plan(empresaId) {
        const e = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { subscription: true } });
        if (!e?.subscription)
            throw new common_1.BadRequestException('Empresa sin plan');
        return e.subscription;
    }
    async minisite(empresaId) {
        const m = await this.prisma.minisite.findUnique({ where: { empresaId }, select: { id: true } });
        if (!m)
            throw new common_1.NotFoundException('Minisite no existe');
        return m.id;
    }
    async checkQuota(empresaId, code, increment = 1) {
        const feature = await this.prisma.planFeature.findUnique({
            where: { plan_code: { plan: await this.plan(empresaId), code } },
        });
        if (!feature || feature.limit === null)
            return;
        const usedNow = await this.prisma.companyUsage.findUnique({
            where: { companyId_code: { companyId: empresaId, code } },
        });
        if ((usedNow?.used ?? 0) + increment > feature.limit)
            throw new common_1.BadRequestException(`Límite de ${code} excedido`);
    }
    async collect(empresaId, code) {
        const usageRow = await this.prisma.companyUsage.findUnique({
            where: { companyId_code: { companyId: empresaId, code } },
        });
        const used = usageRow?.used ?? 0;
        switch (code) {
            case client_1.FeatureCode.PRODUCTS_TOTAL:
                return {
                    items: await this.prisma.product.findMany({ where: { companyId: empresaId }, select: { id: true, name: true } }),
                    used,
                };
            case client_1.FeatureCode.CATEGORIES_TOTAL:
                return {
                    items: await this.prisma.productCompanyCategory.findMany({
                        where: { companyId: empresaId },
                        select: { id: true, name: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.BANNER_PRODUCT_SLOTS:
                return {
                    items: await this.prisma.minisiteSlide.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, title: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.STATIC_IMAGES_TOTAL:
                return {
                    items: await this.prisma.minisiteSlide.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, title: true, imageSrc: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.FEATURED_PRODUCTS_TOTAL:
                return {
                    items: await this.prisma.minisiteFeaturedProduct.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, productId: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.HIGHLIGHT_PRODUCTS_TOTAL:
                return {
                    items: await this.prisma.minisiteHighlightProduct.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, productId: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.OFFER_PRODUCTS_TOTAL:
                return {
                    items: await this.prisma.minisiteProductOffer.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, productId: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.CLASSROOM_TRANSMISSIONS_TOTAL:
                return {
                    items: await this.prisma.classroom.findMany({
                        select: { id: true, title: true },
                    }),
                    used,
                };
            case client_1.FeatureCode.SPECIALITY_IMAGES_TOTAL:
                return {
                    items: await this.prisma.minisiteSpeciality.findMany({
                        where: { minisite: { empresaId } },
                        select: { id: true, title: true, imageUrl: true },
                    }),
                    used,
                };
            default:
                throw new common_1.BadRequestException('Código no soportado');
        }
    }
    async upsertMinisiteVideo(empresaId, file) {
        if (!file)
            throw new common_1.BadRequestException('El archivo «video» es obligatorio');
        const uploaded = await this.cloud.uploadVideo(file);
        await this.prisma.minisite.update({
            where: { empresaId },
            data: { videoUrl: uploaded.secure_url },
        });
        return { videoUrl: uploaded.secure_url };
    }
};
exports.MinisiteService = MinisiteService;
exports.MinisiteService = MinisiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cloudinary_service_1.CloudinaryService])
], MinisiteService);
//# sourceMappingURL=minisite.service.js.map