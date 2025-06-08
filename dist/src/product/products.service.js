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
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.product.create({ data: dto });
    }
    async findAll(companyId, userId) {
        const products = await this.prisma.product.findMany({
            where: { companyId },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map((p) => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findByCategory(companyId, categoryId, userId) {
        const products = await this.prisma.product.findMany({
            where: { companyId, categoryId },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map((p) => ({ ...p, liked: liked.includes(p.id) }));
    }
    async findFeaturedByCompany(companyId, userId) {
        const products = await this.prisma.product.findMany({
            where: { companyId, isFeatured: true },
        });
        if (!userId)
            return products;
        const liked = await this.getLikedProductIds(userId);
        return products.map((p) => ({ ...p, liked: liked.includes(p.id) }));
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
    async update(id, dto) {
        const product = await this.prisma.product.update({
            where: { id },
            data: dto,
        });
        if (!product)
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
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
        return liked.map((p) => ({ ...p, liked: true }));
    }
    async getLikedProductIds(userId) {
        const reactions = await this.prisma.productReaction.findMany({
            where: { userId, type: client_1.ReactionType.LIKE },
            select: { productId: true },
        });
        return reactions.map((r) => r.productId);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=products.service.js.map