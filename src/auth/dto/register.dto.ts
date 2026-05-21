import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  username!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
