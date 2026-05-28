import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { InfractionsService } from './infractions.service';
import { CreateInfractionDto } from './dto/create-infraction.dto';

@Controller('infractions')
export class InfractionsController {
  constructor(private infractionsService: InfractionsService) {}

  @Post()
  create(@Body() dto: CreateInfractionDto) {
    return this.infractionsService.create(dto);
  }

  @Get('folder/:folderId')
  getByFolderId(@Param('folderId') folderId: string) {
    return this.infractionsService.getByFolderId(folderId);
  }

  @Get()
  getAll() {
    return this.infractionsService.getAll();
  }
}
