import { Controller, Get, Res } from '@nestjs/common';
import { AuditService } from './audit.service';
import type { Response } from 'express';

@Controller('audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get('export/pdf')
  async exportPdf(@Res() res: Response) {
    return this.service.exportPdf(res);
  }
}
