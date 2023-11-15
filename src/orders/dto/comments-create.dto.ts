import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CommentsCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
