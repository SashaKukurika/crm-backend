import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GroupsCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;
}
