"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const agora_service_1 = require("./agora.service");
describe('AgoraService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [agora_service_1.AgoraService],
        }).compile();
        service = module.get(agora_service_1.AgoraService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=agora.service.spec%202.js.map