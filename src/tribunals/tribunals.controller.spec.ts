import { Test, TestingModule } from '@nestjs/testing';
import { TribunalsController } from './tribunals.controller';

describe('TribunalsController', () => {
  let controller: TribunalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TribunalsController],
    }).compile();

    controller = module.get<TribunalsController>(TribunalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
