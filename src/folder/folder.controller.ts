import { Body, Controller, Get, Post } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.folderService.createFolder(createFolderDto);
  }

  @Get()
  findAll() {
    return this.folderService.getFolders();
  }

  @Get(':id')
  getById(id: string) {
    return this.folderService.getFolderById(id);
  }
}
