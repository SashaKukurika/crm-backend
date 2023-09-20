import { ApiProperty } from '@nestjs/swagger';

export class JwtTokensInterface {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
