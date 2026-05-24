import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsNotEmpty()
  prenom!: string;

  @IsString()
  @IsNotEmpty()
  nationalite!: string;

  @Type(() => Date)
  @IsDate()
  date_naissance!: Date;

  @IsString()
  @IsNotEmpty()
  avenue!: string;

  @IsString()
  @IsNotEmpty()
  ville!: string;

  @IsString()
  @IsNotEmpty()
  pays!: string;

  @IsString()
  @IsNotEmpty()
  commune!: string;
}
