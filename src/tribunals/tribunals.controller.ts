import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TribunalsService } from './tribunals.service';
import { CreateTribunalDto } from './dto/create-tribunal.dto';

@Controller('tribunals')
export class TribunalsController {
  constructor(private readonly service: TribunalsService) {}

  @Post()
  create(@Body() dto: CreateTribunalDto) {
    return this.service.create(dto);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param() id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(id: string) {
    return this.service.remove(id);
  }
}
