import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // todo add custom decorator IsUnique
  name: string;
}
