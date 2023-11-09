import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { CoursesEnum } from '../../common/enums/courses.enum';
import { CoursesFormatEnum } from '../../common/enums/courses-format.enum';
import { CoursesTypeEnum } from '../../common/enums/courses-type.enum';
import { StatusEnum } from '../../common/enums/status.enum';
import { User } from '../../users/entitys/user.entity';

export class OrderUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(20, { message: 'Name must not be longer than 25 characters' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CoursesEnum)
  course: CoursesEnum;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CoursesFormatEnum)
  course_format: CoursesFormatEnum;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CoursesTypeEnum)
  course_type: CoursesTypeEnum;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sum: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  alreadyPaid: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  utm: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  msg: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsEnum(Groups)
  group: string;

  @ApiProperty()
  @IsOptional()
  user: User;
}
