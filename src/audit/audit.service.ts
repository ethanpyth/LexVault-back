import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { Response } from 'express';
import PDFDocument from 'pdfkit';

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
