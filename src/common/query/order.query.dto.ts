import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CoursesEnum } from '../enums/courses.enum';
import { CoursesFormatEnum } from '../enums/courses-format.enum';
import { CoursesTypeEnum } from '../enums/courses-type.enum';
import { OrderFieldEnum } from '../enums/order-field.enum';
import { StatusEnum } from '../enums/status.enum';

export class OrderQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(OrderFieldEnum)
  order: OrderFieldEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age: string;

  // todo add enum to other
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(CoursesEnum)
  course: CoursesEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(CoursesFormatEnum)
  course_format: CoursesFormatEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(CoursesTypeEnum)
  course_type: CoursesTypeEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manager: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  end_date: string;
}
