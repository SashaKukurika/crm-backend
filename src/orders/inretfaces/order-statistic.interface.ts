import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';

import { CoursesStatusEnum } from '../../common/enums/courses-status.enum';

class Status {
  @ApiProperty({
    enum: Object.values(CoursesStatusEnum),
    description: 'Course status',
    required: false,
  })
  @IsEnum(CoursesStatusEnum)
  status: CoursesStatusEnum;

  @ApiProperty({
    type: Number,
    description: 'count of special status',
    example: 12,
  })
  @IsNumber()
  count: number;
}

export class IOrderStatistic {
  @ApiProperty({
    type: Number,
    description: 'number of all orders',
    example: 500,
  })
  @IsNumber()
  total: number;

  @ApiProperty({ type: [Status], description: 'status name and his count' })
  @IsArray()
  statuses: Status[];
}
