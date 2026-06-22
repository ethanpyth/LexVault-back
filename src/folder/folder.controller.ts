import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  CreateCompleteFolderDto,
  CreateFolderDto,
} from './dto/create-folder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterDto } from './dto/filter.dto';
import { CurrentUser } from '../auth/interfaces/auth-user.interface';

@Controller('folder')
export class FolderController {
  constructor(private readonly service: FolderService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.service.createFolder(createFolderDto);
  }

  @Post('all')
  createAll(@Body() dto: CreateCompleteFolderDto) {
    return this.service.createCompleteFolder(dto);
  }

  @Get()
  findAll(
    @Query() dto: PaginationDto,
    @Query() filters: FilterDto,
    @CurrentUser() user: any,
  ) {
    return this.service.getFolders(dto, filters, user);
  }

  @Get('id/:id')
  getById(@Param('id') id: string) {
    return this.service.getFolderById(id);
  }

  @Get(':cjNumber')
  getByCJNumber(@Param('cjNumber') cjNumber: string) {
    return this.service.getFolderByCJNumber(cjNumber);
  }
}
