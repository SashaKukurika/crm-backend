import { User } from '../../users/entitys/user.entity';

export interface IAddCommentResponse {
  text: string;
  user: User;
  id: number;
  created_at: Date;
  orderId: number;
}
