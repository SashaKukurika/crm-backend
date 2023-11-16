import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    pattern: '[w-.]+@([w-]+.)+[w-]{2,4}$',
    description: 'User email',
    maxLength: 254,
    uniqueItems: true,
    required: true,
    example: 'email@gmail.com',
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  @Matches(/[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    required: true,
    maxLength: 30,
    example: 'Pa$$w0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  password: string;
}
