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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopsController = void 0;
const common_1 = require("@nestjs/common");
const workshops_service_1 = require("./workshops.service");
let WorkshopsController = class WorkshopsController {
    constructor(workshopsService) {
        this.workshopsService = workshopsService;
    }
    async createWorkshop(body) {
        return this.workshopsService.createWorkshop(body);
    }
    async getWorkshop(id) {
        const workshop = await this.workshopsService.getWorkshopById(id);
        if (!workshop)
            throw new common_1.NotFoundException('Workshop no encontrado');
        return workshop;
    }
    async updateWorkshop(id, data) {
        return this.workshopsService.updateWorkshop(id, data);
    }
    async deleteWorkshop(id) {
        return this.workshopsService.deleteWorkshop(id);
    }
    async getWorkshopByChannel(channelName) {
        const workshop = await this.workshopsService.getWorkshopByChannel(channelName);
        if (!workshop)
            throw new common_1.NotFoundException('Workshop no encontrado');
        return workshop;
    }
};
exports.WorkshopsController = WorkshopsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "createWorkshop", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getWorkshop", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "updateWorkshop", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "deleteWorkshop", null);
__decorate([
    (0, common_1.Get)('channel/:channelName'),
    __param(0, (0, common_1.Param)('channelName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getWorkshopByChannel", null);
exports.WorkshopsController = WorkshopsController = __decorate([
    (0, common_1.Controller)('workshops'),
    __metadata("design:paramtypes", [workshops_service_1.WorkshopsService])
], WorkshopsController);
//# sourceMappingURL=workshops.controller.js.map