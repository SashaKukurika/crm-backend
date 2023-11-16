import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GroupsCreateDto {
  @ApiProperty({
    type: String,
    uniqueItems: true,
    required: true,
    minLength: 1,
    maxLength: 30,
    description: 'Group name',
    example: 'first',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;
}
