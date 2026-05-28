import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTribunalDto } from './dto/create-tribunal.dto';

@Injectable()
export class TribunalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTribunalDto) {
    return this.prisma.tribunal.create({
      data: {
        nom: dto.name,
        typeTribunal: dto.typeTribunal,
        ville: dto.ville,
      },
    });
  }

  async findAll() {
    return this.prisma.tribunal.findMany();
  }

  async findOne(id: string) {
    return this.prisma.tribunal.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return this.prisma.tribunal.delete({ where: { id } });
  }
}
