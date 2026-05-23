import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username Already Exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash: hash,
        role: dto.role,
        personne: {
          create: {
            nom: dto.nom,
            prenom: dto.prenom,
            nationalite: dto.nationalite,
            dateNaissance: dto.date_naissance,
            adresse: {
              create: {
                avenue: dto.avenue,
                ville: dto.ville,
                pays: dto.pays,
                commune: dto.commune,
              },
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        personne: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        personne: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
