import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { CreatePersonDto } from '../../persons/dto/create-person.dto';
import { CreateSentenceDto } from '../sentences/dto/create-sentence.dto';
import { CreateInfractionDto } from '../infractions/dto/create-infraction.dto';
import { CreateAudienceDto } from '../audiences/dto/create-audience.dto';
import { CreateDecisionsDto } from '../decisions/dto/create-decisions.dto';

export class CreateFolderDto {
  @IsString()
  personId!: string;
}

export class CreateCompleteFolderDto {
  @IsObject()
  person!: CreatePersonDto;

  @IsObject()
  sentences!: CreateSentenceDto;

  @IsObject()
  folder!: CreateFolderDto;

  @IsNotEmpty()
  infractions!: CreateInfractionDto[];

  @IsObject()
  audiences!: CreateAudienceDto;

  @IsObject()
  decisions!: CreateDecisionsDto;
}
