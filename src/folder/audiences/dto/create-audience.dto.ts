import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateAudienceDto {
  @IsDateString()
  dateAudience!: string;

  @IsEnum(['EN_COURS', 'TERMINE', 'EN_ATTENTE'])
  statut!: 'EN_COURS' | 'TERMINE';

  @IsString()
  folderId!: string;

  @IsString()
  tribunalId!: string;

  @IsString()
  jugeId!: string;
}
