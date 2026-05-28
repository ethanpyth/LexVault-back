import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';

@Injectable()
export class SentencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSentenceDto) {
    return this.prisma.sentence.create({
      data: {
        typeSentence: dto.typeSentence,
        duree: dto.duree,
        montantAmende: dto.montant,
        uniteDuree: dto.uniteDuree,
        dateSentence: new Date(dto.dateSentence),
        decisionId: dto.decisionId,
      },
    });
  }

  async findAll() {
    return this.prisma.sentence.findMany({
      include: {
        decision: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.sentence.findUnique({
      where: { id },
      include: {
        decision: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.sentence.delete({ where: { id } });
  }

  async getByDecisionId(decisionId: string) {
    return this.prisma.sentence.findMany({
      where: { decisionId },
      include: {
        decision: true,
      },
    });
  }

  async getByFolderId(folderId: string) {
    return this.prisma.sentence.findMany({
      where: {
        decision: {
          casierId: folderId,
        },
      },
      include: {
        decision: true,
      },
    });
  }
}
