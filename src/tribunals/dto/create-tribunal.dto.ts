import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTribunalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  typeTribunal!: string;

  @IsString()
  @IsNotEmpty()
  ville!: string;
}
