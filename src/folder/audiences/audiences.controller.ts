import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { CreateAudienceDto } from './dto/create-audience.dto';

@Controller('audiences')
export class AudiencesController {
  constructor(private audiencesService: AudiencesService) {}

  @Post()
  create(@Body() dto: CreateAudienceDto) {
    return this.audiencesService.create(dto);
  }

  @Get()
  getAll() {
    return this.audiencesService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.audiencesService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.audiencesService.delete(id);
  }

  @Get('folder/:folderId')
  getByFolderId(@Param('folderId') folderId: string) {
    return this.audiencesService.getByFolderId(folderId);
  }
}
