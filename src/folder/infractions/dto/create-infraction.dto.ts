import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateInfractionDto {
  @IsString()
  @IsNotEmpty()
  qualification!: string;

  @IsString()
  @IsNotEmpty()
  articleViole!: string;

  @IsString()
  @IsNotEmpty()
  gravite!: string;

  @IsDateString()
  dateInfraction!: Date;

  @IsString()
  @IsNotEmpty()
  folderId!: string;
}
