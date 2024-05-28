import { Feedback, Prisma } from '@prisma/client';

export interface FeedbackAdapter {
  handleEvent(event: any): Promise<void>;
  create(createFeedbackDto: Prisma.FeedbackCreateInput, prId: string): Promise<Feedback>;
  findOne(feedbackId: string): Promise<Feedback>;
  update(feedbackId: string, updatePrDto: Prisma.FeedbackUpdateInput): Promise<Feedback>;
  remove(feedbackId: string): Promise<Feedback>;
}
