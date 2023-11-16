import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtTokensInterface {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Access token',
    example: 'ssdKHGkhglihbILGbilhBl',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Refresh token',
    example: 'ssdKHGkhglihbILGbilhBl',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
