import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInfractionDto } from './dto/create-infraction.dto';

@Injectable()
export class InfractionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInfractionDto) {
    return this.prisma.infraction.create({
      data: {
        qualification: dto.qualification,
        articleViole: dto.articleViole,
        gravite: dto.gravite,
        dateInfraction: dto.dateInfraction,
        casierId: dto.folderId,
      },
    });
  }

  async getByFolderId(folderId: string) {
    return this.prisma.infraction.findMany({
      where: { casierId: folderId },
    });
  }

  async delete(id: string) {
    return this.prisma.infraction.delete({
      where: { id },
    });
  }

  async getAll() {
    return this.prisma.infraction.findMany();
  }

  async getById(id: string) {
    return this.prisma.infraction.findUnique({
      where: { id },
    });
  }
}
