"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const agora_controller_1 = require("./agora.controller");
describe('AgoraController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [agora_controller_1.AgoraController],
        }).compile();
        controller = module.get(agora_controller_1.AgoraController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=agora.controller.spec%202.js.map