import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { PaginationDto } from '../folder/dto/pagination.dto';
import { FilterDTO } from './dto/filter.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: CreateAuditDto) {
    await this.prisma.historiqueAction.create({
      data: {
        userId: dto.userId,
        action: dto.action,
        entite: dto.entite,
        entiteId: dto.entiteId,
        ancienneValeur: dto.ancienneValeur
          ? JSON.stringify(dto.ancienneValeur)
          : null,
        nouvelleValeur: dto.nouvelleValeur
          ? JSON.stringify(dto.nouvelleValeur)
          : null,
        adresseIP: dto.ip,
      },
    });
  }

  async getAll() {
    return await this.prisma.historiqueAction.findMany();
  }

  async getPerPage(dto: PaginationDto, filter: FilterDTO) {
    console.log(filter);
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 10;

    const skip = (page - 1) * pageSize;

    const today = new Date();

    const dayFrom = new Date();
    dayFrom.setDate(today.getDate() - Number(filter.period || 7));

    const where: any = {
      createdAt: {
        gte: dayFrom,
        lte: today,
      },
    };

    if (filter.typeAction) {
      where.action = filter.typeAction;
    }

    if (filter.userId) {
      where.userId = filter.userId;
    }

    const result = await this.prisma.historiqueAction.findMany({
      where,
      take: dto.pageSize,
      skip,
      orderBy: {
        dateAction: 'desc',
      },
      include: {
        user: true,
      },
    });

    const total = await this.prisma.historiqueAction.count({
      where,
    });

    console.log(result);

    return {
      data: result,
      meta: {
        page: dto.page,
        pageSize: dto.pageSize,
        pageCount: Math.ceil(total / pageSize),
        total: total,
      },
    };
  }

  async exportPdf(res: Response) {
    const audits = await this.prisma.historiqueAction.findMany({
      include: {
        user: true,
      },
      orderBy: { dateAction: 'desc' },
    });

    const doc: PDFKit.PDFDocument = new PDFDocument({
      margin: 50,
    });

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', 'attachments; filename=audits.pdf');

    doc.pipe(res);

    doc.fontSize(24).text('Rapport des audits LexVault', {
      align: 'center',
      underline: true,
    });

    doc.moveDown();

    audits.forEach((audit) => {
      doc
        .fontSize(12)
        .text(
          `${audit.dateAction.toISOString()} | ${audit.user.username} | ${audit.action} | ${audit.entite}`,
        );

      doc.moveDown(0.5);
    });

    doc.end();
  }
}
