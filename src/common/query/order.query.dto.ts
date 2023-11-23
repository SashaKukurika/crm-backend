import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CoursesEnum } from '../enums/courses.enum';
import { CoursesFormatEnum } from '../enums/courses-format.enum';
import { CoursesStatusEnum } from '../enums/courses-status.enum';
import { CoursesTypeEnum } from '../enums/courses-type.enum';
import { OrderFieldEnum } from '../enums/order-field.enum';

export class OrderQueryDto {
  @ApiProperty({
    type: String,
    description: 'Page number',
    required: false,
    example: '1',
  })
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty({
    required: false,
    enum: Object.values(OrderFieldEnum),
    description: 'example: "id" asc or "-id" desc',
  })
  @IsString()
  @IsOptional()
  @IsEnum(OrderFieldEnum)
  order: OrderFieldEnum;

  @ApiProperty({
    type: String,
    description: 'part or full name',
    required: false,
    example: 'kok',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    description: 'part or full surname',
    required: false,
    example: 'sovi',
  })
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty({
    type: String,
    description: 'part or full email',
    required: false,
    example: 'ema',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    description: 'part or full phone',
    required: false,
    example: '38057',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'full age',
    required: false,
    example: '34',
  })
  @IsString()
  @IsOptional()
  age: string;

  @ApiProperty({
    enum: Object.values(CoursesEnum),
    description: 'Course name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(CoursesEnum)
  course: CoursesEnum;

  @ApiProperty({
    enum: Object.values(CoursesFormatEnum),
    description: 'Course name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(CoursesFormatEnum)
  course_format: CoursesFormatEnum;

  @ApiProperty({
    enum: Object.values(CoursesTypeEnum),
    description: 'Course name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(CoursesTypeEnum)
  course_type: CoursesTypeEnum;

  @ApiProperty({
    enum: Object.values(CoursesStatusEnum),
    description: 'Course name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(CoursesStatusEnum)
  status: CoursesStatusEnum;

  @ApiProperty({
    type: String,
    description: 'part or full group name',
    required: false,
    example: 'first',
  })
  @IsString()
  @IsOptional()
  group: string;

  @ApiProperty({
    type: String,
    description: 'user id',
    required: false,
    example: '2',
  })
  @IsString()
  @IsOptional()
  user: string;

  @ApiProperty({
    type: String,
    description: 'from which date',
    required: false,
    example: '2023-11-09',
  })
  @IsString()
  @IsOptional()
  start_date: string;

  @ApiProperty({
    type: String,
    description: 'by which date',
    required: false,
    example: '2023-12-09',
  })
  @IsString()
  @IsOptional()
  end_date: string;
}
