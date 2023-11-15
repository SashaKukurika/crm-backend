import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ActivateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'/, {
    message:
      'Weak password. Use both upper and lower case letters, numbers, and special characters',
  })
  password: string;
}
