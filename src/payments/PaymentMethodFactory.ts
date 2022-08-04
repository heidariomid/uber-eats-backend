import PaymentMethod from './contracts/PaymentMethod';
import OnlinePayment from './methods/OnlinePayment';

export default class PaymentMethodFactory {
  private methods: Map<string, PaymentMethod> = new Map<
    string,
    PaymentMethod
  >();
  constructor() {
    this.methods.set('online', new OnlinePayment());
  }
  public make(method: string): PaymentMethod {
    if (!this.methods.has(method)) {
      throw new Error('روش پرداخت نامعتبر می باشد');
    }
    return this.methods.get(method) as PaymentMethod;
  }
}
