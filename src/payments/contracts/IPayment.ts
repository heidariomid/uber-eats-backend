import { Order } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entities/users.entity';

export default interface IPayment {
  user: User;
  order: Order;
  payment_amount?: number;
  payment_method: string;
  transactionId: string;
  // reference:string
  createdAt?: Date;
  updatedAt?: Date;
}
