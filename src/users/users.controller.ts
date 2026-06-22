import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../folder/dto/pagination.dto';
import { CurrentUser } from '../auth/interfaces/auth-user.interface';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('current')
  getCurrent(@CurrentUser() user: any) {
    return this.usersService.getCurrentUser(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('page')
  findPaginated(@Query() dto: PaginationDto) {
    return this.usersService.findUsersPerPage(dto);
  }
}
