import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OrderFieldEnum } from '../enums/order-field.enum';

export class OrderQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  page: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(OrderFieldEnum)
  field: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  fieldOrder: 'ASC' | 'DESC';

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
  course: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;
}
