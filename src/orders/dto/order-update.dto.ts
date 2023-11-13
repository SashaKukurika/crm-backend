import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
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
  @MinLength(1)
  @MaxLength(25)
  @Matches(/^[a-zA-Zа-яА-Я\s]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Matches(/^[a-zA-Zа-яА-Я\s]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^(\+?380\d{9})|(0\d{9})|(\d{9})$/, {
    message:
      'Invalid phone format. Example: 380932922314/+380932922314/0932922314',
  })
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(16)
  @Max(90)
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
  @Min(1)
  @Max(1_000_000)
  sum: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1_000_000)
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
  group: string;

  @ApiProperty()
  @IsOptional()
  user: User;
}
