import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CommentsCreateDto {
  @ApiProperty({
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
    description: 'Comment text',
    example: "it's my comment",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  text: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID of the user who created the comment',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
