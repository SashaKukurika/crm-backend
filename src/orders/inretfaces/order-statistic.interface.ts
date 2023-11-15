import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';

import { CoursesStatusEnum } from '../../common/enums/courses-status.enum';

export class IOrderStatistic {
  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsArray()
  statuses: Status[];
}

class Status {
  @ApiProperty()
  @IsEnum(CoursesStatusEnum)
  status: CoursesStatusEnum;

  @ApiProperty()
  @IsNumber()
  count: number;
}
