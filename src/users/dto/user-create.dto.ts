import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Surname must not contain special characters or digits',
  })
  surname: string;
}
