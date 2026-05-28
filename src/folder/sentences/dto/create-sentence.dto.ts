import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSentenceDto {
  @IsEnum(['PRISON', 'SURSIS', 'AMENDE'])
  @IsNotEmpty()
  typeSentence!: 'PRISON' | 'SURSIS' | 'AMENDE';

  @IsInt()
  @IsNotEmpty()
  duree!: number;

  @IsInt()
  @IsNotEmpty()
  montant!: number;

  @IsString()
  @IsNotEmpty()
  uniteDuree!: string;

  @IsDateString()
  @IsNotEmpty()
  dateSentence!: string;

  @IsString()
  @IsNotEmpty()
  decisionId!: string;
}
