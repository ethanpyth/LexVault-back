import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuditService } from './audit.service';
import type { Response } from 'express';
import { PaginationDto } from '../folder/dto/pagination.dto';
import { FilterDTO } from './dto/filter.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get('all')
  async getAll() {
    return this.service.getAll();
  }

  @Get('page')
  async getPerPage(@Query() dto: PaginationDto, @Query() filter: FilterDTO) {
    return this.service.getPerPage(dto, filter);
  }

  @Get('export/pdf')
  async exportPdf(@Res() res: Response) {
    return this.service.exportPdf(res);
  }
}
