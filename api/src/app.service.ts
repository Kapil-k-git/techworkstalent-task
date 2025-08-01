import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerStatus() {
    return { message: 'Server is up and running!' };
  }
}