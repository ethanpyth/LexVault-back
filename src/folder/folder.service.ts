import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FolderService {
  constructor(private readonly prisma: PrismaService) {}

  private formatFolderNumber(year: number, counter: number) {
    return `CJ-${year}-${String(counter).padStart(6, '0')}`;
  }

  async generateUniqueFolderNumber(): Promise<string> {
    const year = new Date().getFullYear();

    let counter = await this.prisma.casierCounter.findFirst({
      where: { year },
    });

    if (counter) {
      counter = await this.prisma.casierCounter.update({
        where: { id: counter.id },
        data: { value: { increment: 1 } },
      });
    } else {
      counter = await this.prisma.casierCounter.create({
        data: { year, value: 1 },
      });
    }

    return this.formatFolderNumber(year, counter.value);
  }

  async createFolder(dto: CreateFolderDto) {
    const numeroCasier = await this.generateUniqueFolderNumber();

    return this.prisma.casierJudiciaire.create({
      data: {
        numeroCasier,
        personne: {
          connect: {
            id: dto.personId,
          },
        },
        statut: 'ACTIF',
      },
      include: {
        personne: true,
      },
    });
  }

  async getFolders() {
    return this.prisma.casierJudiciaire.findMany({
      include: {
        personne: true,
      },
    });
  }

  async getFolderById(id: string) {
    return this.prisma.casierJudiciaire.findUnique({
      where: { id },
      include: { personne: true },
    });
  }

  async suspend(id: string) {
    return this.prisma.casierJudiciaire.update({
      where: { id },
      data: {
        statut: 'SUSPENDU',
      },
    });
  }

  async archive(id: string) {
    return this.prisma.casierJudiciaire.update({
      where: { id },
      data: {
        statut: 'ARCHIVE',
      },
    });
  }
}
