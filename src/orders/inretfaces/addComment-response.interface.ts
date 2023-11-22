import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../users/entitys/user.entity';

export class IAddCommentResponse {
  @ApiProperty({
    type: String,
    description: 'Comment text',
    required: true,
    example: 'some text',
    maxLength: 100,
    minLength: 1,
  })
  text: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({
    type: Number,
    description: 'Comment id',
    required: true,
    example: 3,
    uniqueItems: true,
  })
  id: number;

  @ApiProperty({
    type: Date,
    description: 'When was created',
    required: true,
    example: '2023-11-13 15:24:51.834873',
  })
  created_at: Date;

  @ApiProperty({
    type: Number,
    description: 'Order id',
    required: true,
    example: 3,
    uniqueItems: true,
  })
  orderId: number;
}
