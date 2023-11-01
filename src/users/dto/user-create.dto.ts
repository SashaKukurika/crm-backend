import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  name: string;

  @ApiProperty()
  @MinLength(1, { message: 'Surname must be at least 1 character long' })
  surname: string;
}
