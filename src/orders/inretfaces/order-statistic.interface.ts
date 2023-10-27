import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';

import { StatusEnum } from '../../common/enums/status.enum';

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
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty()
  @IsNumber()
  count: number;
}
