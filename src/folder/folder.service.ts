import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCompleteFolderDto,
  CreateFolderDto,
} from './dto/create-folder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FolderService {
  constructor(private readonly prisma: PrismaService) {}

  private formatFolderNumber(year: number, counter: number) {
    return `CJ-${year}-${String(counter).padStart(6, '0')}`;
  }

  async generateUniqueFolderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let counter;

    console.log('BEFORE QUERY');
    try {
      counter = await this.prisma.casierCounter.findFirst({
        where: { year },
      });
    } catch (error) {
      console.error('DATABASE ERROR', error);
    }

    console.log('AFTER QUERY');

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

    const folderNumber = this.formatFolderNumber(year, counter.value);

    console.log('Generated folder number:', folderNumber);

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

      const folder = await tx.casierJudiciaire.create({
        data: {
          numeroCasier,
          personneId: person.id,
        },
      });

      await tx.infraction.createMany({
        data: dto.infractions.map(({ dateInfraction, ...infraction }) => ({
          ...infraction,
          ...(dateInfraction && { dateInfraction: new Date(dateInfraction) }),
          casierId: folder.id,
        })),
      });

      const audience = await tx.audience.create({
        data: {
          ...dto.audiences,
          dateAudience: new Date(dto.audiences.dateAudience),
          casierId: folder.id,
          tribunalId: dto.audiences.tribunalId,
        },
      });

      const { motif, dateDecision, ...decisionData } = dto.decisions;

      const decision = await tx.decisionJudiciaire.create({
        data: {
          ...decisionData,
          dateDecision: new Date(dateDecision),
          casierId: folder.id,
          audienceId: audience.id,
          motivation: motif,
        },
      });

      const sentence = await tx.sentence.create({
        data: {
          typeSentence: dto.sentences.typeSentence,
          dateSentence: new Date(dto.sentences.dateSentence),
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

  async getFolders(dto: PaginationDto, filters: Filters) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 10;

    const skip = (page - 1) * pageSize;

    const where: Prisma.PersonneWhereInput = {};

    if (filters.firstName?.trim()) {
      where.nom = {
        contains: filters.firstName,
        mode: 'insensitive',
      };
    }

    if (filters.lastName?.trim()) {
      where.prenom = {
        contains: filters.lastName,
        mode: 'insensitive',
      };
    }

    if (filters.nin?.trim()) {
      where.nin = {
        contains: filters.nin,
      };
    }

    if (filters.birthday?.trim()) {
      where.dateNaissance = new Date(filters.birthday);
    }

    const cjWhere: Prisma.CasierJudiciaireWhereInput = {};

    if (Object.keys(where).length > 0) {
      cjWhere.personne = where;
    }

    const data = await this.prisma.casierJudiciaire.findMany({
      where: cjWhere,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        personne: true,
      },
    });

    const total = await this.prisma.casierJudiciaire.count({
      where: cjWhere,
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrevious: page > 1,
      },
    };
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

type Filters = {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  nin?: string;
};
