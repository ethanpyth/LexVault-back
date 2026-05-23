import { Role } from '@prisma/client';

export interface AuthUser {
  userId: string;
  username: string;
  role: Role;
}
