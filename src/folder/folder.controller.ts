import { Body, Controller, Get, Post } from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  CreateCompleteFolderDto,
  CreateFolderDto,
} from './dto/create-folder.dto';

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
  findAll() {
    return this.service.getFolders();
  }

  @Get(':id')
  getById(id: string) {
    return this.service.getFolderById(id);
  }
}
