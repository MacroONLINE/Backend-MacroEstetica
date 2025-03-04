import { Test, TestingModule } from '@nestjs/testing';
import { AgoraChatService } from './agora-chat.service';

describe('AgoraChatService', () => {
  let service: AgoraChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgoraChatService],
    }).compile();

    service = module.get<AgoraChatService>(AgoraChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
