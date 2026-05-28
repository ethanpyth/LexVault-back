import { Controller, Post, Get, Delete } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';

@Controller('sentences')
export class SentencesController {
  constructor(private readonly service: SentencesService) {}

  @Post()
  async create(dto: CreateSentenceDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  async delete(id: string) {
    return this.service.delete(id);
  }

  @Get('decision/:decisionId')
  async getByDecisionId(decisionId: string) {
    return this.service.getByDecisionId(decisionId);
  }

  @Get('folder/:folderId')
  async getByFolderId(folderId: string) {
    return this.service.getByFolderId(folderId);
  }
}
