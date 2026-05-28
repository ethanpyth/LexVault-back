import { Body, Controller, Post, Get } from '@nestjs/common';
import { DecisionsService } from './decisions.service';
import { CreateDecisionsDto } from './dto/create-decisions.dto';

@Controller('decisions')
export class DecisionsController {
  constructor(private readonly service: DecisionsService) {}

  @Post()
  create(@Body() dto: CreateDecisionsDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(id: string) {
    return this.service.findOne(id);
  }

  @Get('folder/:folderId')
  findByFolderId(folderId: string) {
    return this.service.getByFolderId(folderId);
  }

  @Get('audience/:audienceId')
  findByAudienceId(audienceId: string) {
    return this.service.getByAudienceId(audienceId);
  }
}
