import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDecisionsDto } from './dto/create-decisions.dto';

@Injectable()
export class DecisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDecisionsDto) {
    return this.prisma.decisionJudiciaire.create({
      data: {
        reference: dto.reference,
        dateDecision: new Date(dto.dateDecision),
        typeDecision: dto.typeDecision,
        contenu: dto.contenu,
        verdict: dto.verdict,
        motivation: dto.motif,
        casierId: dto.folderId,
        audienceId: dto.audienceId,
      },
    });
  }

  async findAll() {
    return this.prisma.decisionJudiciaire.findMany();
  }

  async findOne(id: string) {
    return this.prisma.decisionJudiciaire.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return this.prisma.decisionJudiciaire.delete({ where: { id } });
  }

  async getByFolderId(folderId: string) {
    return this.prisma.decisionJudiciaire.findMany({
      where: { casierId: folderId },
    });
  }

  async getByAudienceId(audienceId: string) {
    return this.prisma.decisionJudiciaire.findMany({
      where: { audienceId },
    });
  }
}
