import IPayment from './IPayment';

export default interface PaymentMethod {
  doPayment(payment: IPayment): any;
}
