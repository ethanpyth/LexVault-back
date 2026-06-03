import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { CreatePersonDto } from '../../persons/dto/create-person.dto';

export class CreateFolderDto {
  @IsString()
  personId!: string;
}

export class CreateCompleteFolderDto {
  @IsObject()
  person!: CreatePersonDto;

  @IsObject()
  @IsNotEmpty()
  sentences!: {
    typeSentence: 'PRISON' | 'SURSIS' | 'AMENDE' | 'TRAVAUX';
    duree: number;
    montant: number;
    uniteDuree: string;
    dateSentence: string;
  };

  @IsNotEmpty()
  infractions!: {
    qualification: string;
    articleViole: string;
    gravite: string;
    dateInfraction: string | Date;
  }[];

  @IsObject()
  @IsNotEmpty()
  audiences!: {
    dateAudience: string;
    statut: 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE';
    tribunalId: string;
    jugeId: string;
  };

  @IsObject()
  decisions!: {
    reference: string;
    dateDecision: string;
    contenu: string;
    typeDecision: string;
    verdict: string;
    motif: string;
  };
}
