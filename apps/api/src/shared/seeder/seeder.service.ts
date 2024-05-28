import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederService {
  async runSeeder(seeders: any[]) {
    for (const seeder of seeders) {
      await seeder.seed();
    }
  }
}