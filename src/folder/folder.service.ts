import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCompleteFolderDto,
  CreateFolderDto,
} from './dto/create-folder.dto';

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

  async createCompleteFolder(dto: CreateCompleteFolderDto) {
    const numeroCasier = await this.generateUniqueFolderNumber();

    return this.prisma.$transaction(async (tx) => {
      const person = await tx.personne.create({
        data: {
          nom: dto.person.nom,
          prenom: dto.person.prenom,
          dateNaissance: dto.person.date_naissance,
          adresse: {
            create: {
              avenue: dto.person.avenue,
              ville: dto.person.ville,
              pays: dto.person.pays,
              commune: dto.person.commune,
            },
          },
        },
      });

      const { ...folderData } = dto.folder;

      const folder = await tx.casierJudiciaire.create({
        data: {
          ...folderData,
          numeroCasier,
          personneId: person.id,
        },
      });

      await tx.infraction.createMany({
        data: dto.infractions.map(({ ...infraction }) => ({
          ...infraction,
          casierId: folder.id,
        })),
      });

      const audience = await tx.audience.create({
        data: {
          ...dto.audiences,
          casierId: folder.id,
          tribunalId: dto.audiences.tribunalId,
        },
      });

      const { motif, ...decisionData } = dto.decisions;

      const decision = await tx.decisionJudiciaire.create({
        data: {
          ...decisionData,
          casierId: folder.id,
          audienceId: audience.id,
          motivation: motif,
        },
      });

      const sentence = await tx.sentence.create({
        data: {
          typeSentence: dto.sentences.typeSentence,
          dateSentence: dto.sentences.dateSentence,
          uniteDuree: dto.sentences.uniteDuree,
          duree: dto.sentences.duree,
          montantAmende: dto.sentences.montant,
          decisionId: decision.id,
        },
      });

      return {
        person,
        folder,
        audience,
        decision,
        sentence,
      };
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
