import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
    description: 'User email',
    minLength: 1,
    maxLength: 254,
    uniqueItems: true,
    required: true,
    example: 'email@gmail.com',
  })
  @IsNotEmpty()
  @MaxLength(254)
  @MinLength(1)
  @Matches(/[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty({
    type: String,
    pattern: '^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$',
    description: 'User name',
    minLength: 1,
    maxLength: 25,
    required: true,
    example: 'kokos',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Name must not contain special characters or digits',
  })
  name: string;

  @ApiProperty({
    type: String,
    pattern: '^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$',
    description: 'User surname',
    minLength: 1,
    maxLength: 30,
    required: true,
    example: 'kokosovich',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Matches(/^[a-zA-ZА-ЩЬЮЯҐЄІЇа-щьюяґєії]*$/, {
    message: 'Surname must not contain special characters or digits',
  })
  surname: string;
}
