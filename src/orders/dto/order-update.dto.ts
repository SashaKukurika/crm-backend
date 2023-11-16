import { ApiProperty } from '@nestjs/swagger';
import {
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
import { CoursesStatusEnum } from '../../common/enums/courses-status.enum';
import { CoursesTypeEnum } from '../../common/enums/courses-type.enum';
import { User } from '../../users/entitys/user.entity';

export class OrderUpdateDto {
  @ApiProperty({
    type: String,
    pattern: '^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$',
    description: 'Client name',
    minLength: 1,
    maxLength: 25,
    required: false,
    example: 'kokos',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @ApiProperty({
    type: String,
    pattern: '^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$',
    description: 'Client surname',
    minLength: 1,
    maxLength: 25,
    required: false,
    example: 'kokosovich',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Surname must not contain special characters or digits',
  })
  surname: string;

  @ApiProperty({
    type: String,
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
    description: 'Client email',
    minLength: 1,
    maxLength: 100,
    uniqueItems: true,
    required: false,
    example: 'email@gmail.com',
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  @Matches(/[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty({
    type: String,
    pattern: '^380\\d{9}$',
    description: 'Client phone',
    example: '380932922314',
  })
  @IsOptional()
  @IsString()
  @Matches(/^380\d{9}$/, {
    message: 'Invalid phone format. Example: 380932922314',
  })
  phone: string;

  @ApiProperty({
    type: Number,
    required: false,
    minimum: 16,
    maximum: 90,
    description: 'Client age',
    example: 18,
  })
  @IsOptional()
  @IsNumber()
  @Min(16)
  @Max(90)
  age: number;

  @ApiProperty({
    enum: Object.values(CoursesEnum),
    description: 'Course name',
    required: false,
  })
  @IsOptional()
  @IsEnum(CoursesEnum)
  course: CoursesEnum;

  @ApiProperty({
    enum: Object.values(CoursesFormatEnum),
    description: 'Course format',
    required: false,
  })
  @IsOptional()
  @IsEnum(CoursesFormatEnum)
  course_format: CoursesFormatEnum;

  @ApiProperty({
    enum: Object.values(CoursesTypeEnum),
    description: 'Course type',
    required: false,
  })
  @IsOptional()
  @IsEnum(CoursesTypeEnum)
  course_type: CoursesTypeEnum;

  @ApiProperty({
    type: Number,
    required: false,
    minimum: 1,
    maximum: 1_000_000,
    description: 'Course cost',
    example: 30_000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1_000_000)
  sum: number;

  @ApiProperty({
    type: Number,
    required: false,
    minimum: 1,
    maximum: 1_000_000,
    description: 'Course cost',
    example: 30_000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1_000_000)
  alreadyPaid: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'UTM',
  })
  @IsOptional()
  @IsString()
  utm: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Message from client',
    example: 'want start next mouth',
  })
  @IsOptional()
  @IsString()
  msg: string;

  @ApiProperty({
    enum: Object.values(CoursesStatusEnum),
    description: 'Status',
    required: false,
  })
  @IsOptional()
  @IsEnum(CoursesStatusEnum)
  status: CoursesStatusEnum;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Group name',
    example: 'first',
  })
  @IsOptional()
  @IsString()
  group: string;

  @ApiProperty({
    type: () => User,
  })
  @IsOptional()
  user: User;
}
