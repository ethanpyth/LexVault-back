import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;

  @IsNotEmpty()
  nom!: string;

  @IsNotEmpty()
  prenom!: string;

  @IsNotEmpty()
  nationalite!: string;

  @Type(() => Date)
  @IsDate()
  date_naissance!: Date;

  @IsNotEmpty()
  avenue!: string;

  @IsNotEmpty()
  ville!: string;

  @IsNotEmpty()
  pays!: string;

  @IsNotEmpty()
  commune!: string;
}
