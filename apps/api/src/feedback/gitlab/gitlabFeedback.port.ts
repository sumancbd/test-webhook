import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Feedback, Prisma } from '@prisma/client';
import { FeedbackAdapter } from '../feedback.adapter';

@Injectable()
export class GitlabFeedbackPort implements FeedbackAdapter {
  constructor(private _prisma: PrismaService) {}

  async handleEvent(_event: any) {
    throw new Error('Method not implemented.');
  }

  async create(_createFeedbackDto: Prisma.FeedbackCreateInput, prId: string): Promise<Feedback> {
    throw new Error('Method not implemented.');
  }

  async update(
    _feedbackId: string,
    _updateFeedbackDto: Prisma.FeedbackUpdateInput
  ): Promise<Feedback> {
    throw new Error('Method not implemented.');
  }

  async remove(_feedbackId: string): Promise<Feedback> {
    throw new Error('Method not implemented.');
  }

  async findOne(_feedbackId: string): Promise<Feedback> {
    throw new Error('Method not implemented.');
  }
}
