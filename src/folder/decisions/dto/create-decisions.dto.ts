import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDecisionsDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsDateString()
  @IsNotEmpty()
  dateDecision!: string;

  @IsString()
  @IsNotEmpty()
  contenu!: string;

  @IsString()
  @IsNotEmpty()
  typeDecision!: string;

  @IsString()
  @IsNotEmpty()
  verdict!: string;

  @IsString()
  @IsNotEmpty()
  motif!: string;

  @IsString()
  @IsNotEmpty()
  folderId!: string;

  @IsString()
  @IsNotEmpty()
  audienceId!: string;
}
