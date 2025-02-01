import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  private async salt() {
    return await bcrypt.genSalt();
  }
  async generate(password: string): Promise<string> {
    const salt = await this.salt();
    return await bcrypt.hash(password, salt);
  }
  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
