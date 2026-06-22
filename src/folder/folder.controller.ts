import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  CreateCompleteFolderDto,
  CreateFolderDto,
} from './dto/create-folder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterDto } from './dto/filter.dto';
import { CurrentUser } from '../auth/interfaces/auth-user.interface';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('folder')
export class FolderController {
  constructor(private readonly service: FolderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GREFFIER)
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
