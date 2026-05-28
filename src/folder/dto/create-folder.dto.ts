import { IsString } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  personId!: string;
}
