import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  titre!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}
