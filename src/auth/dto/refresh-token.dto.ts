import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
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
