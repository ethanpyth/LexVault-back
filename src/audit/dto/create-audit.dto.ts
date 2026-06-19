import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  action!: string;

  @IsNotEmpty()
  @IsString()
  entite!: string;

  @IsString()
  entiteId?: string;

  ancienneValeur?: unknown;

  nouvelleValeur?: unknown;

  @IsString()
  ip?: string;
}
