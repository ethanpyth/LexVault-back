import { Test, TestingModule } from '@nestjs/testing';
import { InfractionsController } from './infractions.controller';

describe('InfractionsController', () => {
  let controller: InfractionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfractionsController],
    }).compile();

    controller = module.get<InfractionsController>(InfractionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
