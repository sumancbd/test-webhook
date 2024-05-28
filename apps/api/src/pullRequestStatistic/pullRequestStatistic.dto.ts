import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const dateRangeSchema = Joi.object({
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required()
});

export class DateRangeDto {
  @ApiProperty({
    description: 'The start date of the range',
    example: '2024-05-21',
  })
  startDate: string;

  @ApiProperty({
    description: 'The end date of the range',
    example: '2024-06-21',
  })
  endDate: string;
}
