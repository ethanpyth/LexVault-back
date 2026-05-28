import { Injectable } from '@nestjs/common';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AudiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAudienceDto) {
    return this.prisma.audience.create({
      data: {
        dateAudience: new Date(dto.dateAudience),
        statut: dto.statut,
        casierId: dto.folderId,
        tribunalId: dto.tribunalId,
        jugeId: dto.jugeId,
      },
    });
  }

  async getAll() {
    return this.prisma.audience.findMany();
  }

  async getById(id: string) {
    return this.prisma.audience.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return this.prisma.audience.delete({ where: { id } });
  }

  async getByFolderId(folderId: string) {
    return this.prisma.audience.findMany({ where: { casierId: folderId } });
  }
}
