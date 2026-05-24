import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PersonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    return this.prisma.personne.create({
      data: {
        nom: createPersonDto.nom,
        prenom: createPersonDto.prenom,
        nationalite: createPersonDto.nationalite,
        dateNaissance: createPersonDto.date_naissance,
        adresse: {
          create: {
            avenue: createPersonDto.avenue,
            ville: createPersonDto.ville,
            pays: createPersonDto.pays,
            commune: createPersonDto.commune,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.personne.findMany({
      include: {
        adresse: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.personne.findUnique({
      where: {
        id,
      },
      include: {
        adresse: true,
      },
    });
  }

  async update(id: string, updatePersonDto: CreatePersonDto) {
    return this.prisma.personne.update({
      where: {
        id,
      },
      data: {
        nom: updatePersonDto.nom,
        prenom: updatePersonDto.prenom,
        nationalite: updatePersonDto.nationalite,
        dateNaissance: updatePersonDto.date_naissance,
        adresse: {
          update: {
            avenue: updatePersonDto.avenue,
            ville: updatePersonDto.ville,
            pays: updatePersonDto.pays,
            commune: updatePersonDto.commune,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.personne.delete({
      where: {
        id,
      },
    });
  }
}
