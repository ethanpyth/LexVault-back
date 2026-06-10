import { IsString } from 'class-validator';

export class FilterDto {
  @IsString()
  firstName: string = '';

  @IsString()
  lastName: string = '';

  @IsString()
  nin: string = '';

  @IsString()
  birthday: string = '';
}
