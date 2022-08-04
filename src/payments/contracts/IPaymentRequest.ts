export default interface IPaymentRequest {
  amount: number;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
  };
  transactionId: string;
  description: string;
}
