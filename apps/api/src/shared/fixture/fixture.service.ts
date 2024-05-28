import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FixturesService {
  constructor(private readonly prismaService: PrismaService) {}

  async importFixtures(fixtures: any[]) {
    process.env.FIXTURE_ENV = 'true';
    for (const model of Prisma.dmmf.datamodel.models) {
      const prismaModel = this.prismaService[model.name];
      await prismaModel.deleteMany({});
    }

    for (const fixture of fixtures) {
      await fixture.load();
    }
  }
}
