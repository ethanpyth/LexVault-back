import { Controller } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';

@Controller('sentences')
export class SentencesController {
  constructor(private readonly service: SentencesService) {}

  async create(dto: CreateSentenceDto) {
    return this.service.create(dto);
  }

  async findAll() {
    return this.service.findAll();
  }

  async findOne(id: string) {
    return this.service.findOne(id);
  }

  async delete(id: string) {
    return this.service.delete(id);
  }
}
