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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductService = class ProductService {
    constructor(prisma, cloud) {
        this.prisma = prisma;
        this.cloud = cloud;
    }
    async create(dto) {
        return this.prisma.product.create({ data: dto });
    }
    async findAll(companyId, userId) {
        const products = await this.prisma.product.findMany({ where: { companyId } });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findByCategory(companyId, categoryId, userId) {
        const products = await this.prisma.product.findMany({
            where: { companyId, categoryId },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findFeaturedByCompany(companyId, userId) {
        const products = await this.prisma.product.findMany({
            where: { companyId, isFeatured: true },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findHighlightedByCompany(companyId, userId) {
        const rows = await this.prisma.minisiteHighlightProduct.findMany({
            where: { minisite: { empresaId: companyId } },
            select: { productId: true },
        });
        const ids = rows.map(r => r.productId);
        const products = await this.prisma.product.findMany({ where: { id: { in: ids } } });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findOfferByCompany(companyId, userId) {
        const rows = await this.prisma.minisiteProductOffer.findMany({
            where: { minisite: { empresaId: companyId } },
            select: { productId: true },
        });
        const ids = rows.map(r => r.productId);
        const products = await this.prisma.product.findMany({ where: { id: { in: ids } } });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findNormalByCompany(companyId, userId) {
        const featuredIds = (await this.prisma.product.findMany({
            where: { companyId, isFeatured: true },
            select: { id: true },
        })).map(p => p.id);
        const highlightedIds = (await this.prisma.minisiteHighlightProduct.findMany({
            where: { minisite: { empresaId: companyId } },
            select: { productId: true },
        })).map(r => r.productId);
        const offerIds = (await this.prisma.minisiteProductOffer.findMany({
            where: { minisite: { empresaId: companyId } },
            select: { productId: true },
        })).map(r => r.productId);
        const exclude = [...featuredIds, ...highlightedIds, ...offerIds];
        const products = await this.prisma.product.findMany({
            where: { companyId, id: { notIn: exclude } },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map(p => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findAllGroupedByType(companyId, userId) {
        const featured = await this.findFeaturedByCompany(companyId, userId);
        const highlighted = await this.findHighlightedByCompany(companyId, userId);
        const offer = await this.findOfferByCompany(companyId, userId);
        const normal = await this.findNormalByCompany(companyId, userId);
        return { FEATURED: featured, HIGHLIGHT: highlighted, OFFER: offer, NORMAL: normal };
    }
    async findById(id, userId) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        if (!userId)
            return product;
        const reaction = await this.prisma.productReaction.findUnique({
            where: { userId_productId: { userId, productId: id } },
        });
        return { ...product, liked: reaction?.type === client_1.ReactionType.LIKE };
    }
    toStrArr(v) {
        if (v === undefined)
            return undefined;
        if (Array.isArray(v))
            return v.map(String);
        if (typeof v === 'string') {
            try {
                return JSON.parse(v);
            }
            catch (_) {
                return v.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        return [String(v)];
    }
    toBool(v) {
        if (v === undefined)
            return undefined;
        if (typeof v === 'boolean')
            return v;
        return ['true', '1', 'yes', 'on'].includes(String(v).toLowerCase());
    }
    async updateWithImages(id, body, files) {
        const current = await this.prisma.product.findUnique({ where: { id } });
        if (!current)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        const metaKey = Object.keys(body).find(k => k.endsWith('_products') || k === 'products');
        if (metaKey) {
            try {
                Object.assign(body, JSON.parse(body[metaKey]));
                delete body[metaKey];
            }
            catch {
                throw new common_1.BadRequestException('JSON inválido en el campo products');
            }
        }
        let mainUrl = current.imageMain ?? '';
        const mainFile = files.find(f => f.fieldname === 'main');
        if (mainFile) {
            mainUrl = (await this.cloud.uploadImage(mainFile)).secure_url;
        }
        else if (body.imageMain?.trim()) {
            mainUrl = body.imageMain.trim();
        }
        const uploadedGallery = {};
        for (const f of files) {
            const m = /^gallery_(\d+)$/.exec(f.fieldname);
            if (m)
                uploadedGallery[+m[1]] = (await this.cloud.uploadImage(f)).secure_url;
        }
        const textGallery = {};
        Object.keys(body).forEach(k => {
            const m = /^gallery_(\d+)$/.exec(k);
            if (m && body[k]?.trim())
                textGallery[+m[1]] = body[k].trim();
        });
        const maxIdx = Math.max(current.imageGallery.length - 1, ...Object.keys(uploadedGallery).map(Number), ...Object.keys(textGallery).map(Number), 0);
        const finalGallery = [];
        for (let i = 0; i <= maxIdx; i++) {
            finalGallery[i] =
                uploadedGallery[i] ?? textGallery[i] ?? current.imageGallery[i] ?? '';
        }
        const data = {
            name: body.name ?? undefined,
            description: body.description ?? undefined,
            lab: body.lab ?? undefined,
            activeIngredients: this.toStrArr(body.activeIngredients),
            features: this.toStrArr(body.features),
            benefits: this.toStrArr(body.benefits),
            problemAddressed: body.problemAddressed ?? undefined,
            imageMain: mainUrl,
            imageGallery: finalGallery,
            isFeatured: this.toBool(body.isFeatured),
            isBestSeller: this.toBool(body.isBestSeller),
            isOnSale: this.toBool(body.isOnSale),
            category: body.categoryId ? { connect: { id: Number(body.categoryId) } } : undefined,
            company: body.companyId ? { connect: { id: body.companyId } } : undefined,
        };
        const updated = await this.prisma.product.update({ where: { id }, data });
        const branch = (body.type ?? 'NORMAL').toUpperCase();
        const minisiteIdRow = await this.prisma.minisite.findFirst({
            where: { empresaId: updated.companyId },
            select: { id: true },
        });
        if (!minisiteIdRow)
            return updated;
        const minisiteId = minisiteIdRow.id;
        if (branch === 'FEATURED') {
            await this.prisma.minisiteFeaturedProduct.upsert({
                where: { productId: id },
                update: {
                    minisiteId,
                    order: body.order ? Number(body.order) : 0,
                    tagline: body.tagline ?? '',
                },
                create: {
                    minisiteId,
                    productId: id,
                    order: body.order ? Number(body.order) : 0,
                    tagline: body.tagline ?? '',
                },
            });
            await this.prisma.minisiteHighlightProduct.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.minisiteProductOffer.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.product.update({
                where: { id },
                data: { isFeatured: true },
            });
        }
        else if (branch === 'HIGHLIGHT') {
            await this.prisma.minisiteHighlightProduct.upsert({
                where: { minisiteId_productId: { minisiteId, productId: id } },
                update: {
                    highlightFeatures: this.toStrArr(body.highlightFeatures) ?? [],
                    highlightDescription: body.highlightDescription ?? '',
                },
                create: {
                    minisiteId,
                    productId: id,
                    highlightFeatures: this.toStrArr(body.highlightFeatures) ?? [],
                    highlightDescription: body.highlightDescription ?? '',
                },
            });
            await this.prisma.minisiteFeaturedProduct.deleteMany({ where: { productId: id } });
            await this.prisma.minisiteProductOffer.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.product.update({
                where: { id },
                data: { isFeatured: false },
            });
        }
        else if (branch === 'OFFER') {
            await this.prisma.minisiteProductOffer.upsert({
                where: { minisiteId_productId: { minisiteId, productId: id } },
                update: { title: body.title ?? updated.name, description: body.offerDescription ?? '' },
                create: {
                    minisiteId,
                    productId: id,
                    title: body.title ?? updated.name,
                    description: body.offerDescription ?? '',
                },
            });
            await this.prisma.minisiteFeaturedProduct.deleteMany({ where: { productId: id } });
            await this.prisma.minisiteHighlightProduct.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.product.update({
                where: { id },
                data: { isFeatured: false },
            });
        }
        else {
            await this.prisma.minisiteFeaturedProduct.deleteMany({ where: { productId: id } });
            await this.prisma.minisiteHighlightProduct.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.minisiteProductOffer.deleteMany({
                where: { productId: id, minisiteId },
            });
            await this.prisma.product.update({
                where: { id },
                data: { isFeatured: false },
            });
        }
        return updated;
    }
    async remove(id) {
        const deleted = await this.prisma.product.delete({ where: { id } });
        if (!deleted)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        return { message: 'Producto eliminado correctamente' };
    }
    async toggleProductReaction(userId, productId, type = client_1.ReactionType.LIKE) {
        const existing = await this.prisma.productReaction.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing) {
            if (existing.type === type) {
                await this.prisma.productReaction.delete({ where: { id: existing.id } });
                return { userId, productId, reacted: false };
            }
            await this.prisma.productReaction.update({
                where: { id: existing.id },
                data: { type },
            });
            return { userId, productId, reacted: true, type };
        }
        await this.prisma.productReaction.create({
            data: { userId, productId, type },
        });
        return { userId, productId, reacted: true, type };
    }
    async getLikedProducts(userId) {
        const liked = await this.prisma.product.findMany({
            where: { reactions: { some: { userId, type: client_1.ReactionType.LIKE } } },
        });
        return liked.map(p => ({ ...p, liked: true }));
    }
    async getLikedProductIds(userId) {
        const reactions = await this.prisma.productReaction.findMany({
            where: { userId, type: client_1.ReactionType.LIKE },
            select: { productId: true },
        });
        return reactions.map(r => r.productId);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductService);
//# sourceMappingURL=products.service.js.map