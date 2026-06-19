import { IsString } from 'class-validator';

export class FilterDTO {
  @IsString()
  userId: string = '';

  @IsString()
  period: string = '';

  @IsString()
  typeAction: string = '';
}
