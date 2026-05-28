import { Test, TestingModule } from '@nestjs/testing';
import { TribunalsService } from './tribunals.service';

describe('TribunalsService', () => {
  let service: TribunalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TribunalsService],
    }).compile();

    service = module.get<TribunalsService>(TribunalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
