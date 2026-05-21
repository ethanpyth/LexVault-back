import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      username: 'Jhon',
      password: 'Jhon',
    },
  ];
}
