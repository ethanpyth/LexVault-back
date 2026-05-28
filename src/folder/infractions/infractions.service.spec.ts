import { Test, TestingModule } from '@nestjs/testing';
import { InfractionsService } from './infractions.service';

describe('InfractionsService', () => {
  let service: InfractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfractionsService],
    }).compile();

    service = module.get<InfractionsService>(InfractionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
