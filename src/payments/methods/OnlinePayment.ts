import IPayment from '../contracts/IPayment';
import IPaymentRequest from '../contracts/IPaymentRequest';
import IPaymentVerify from '../contracts/IPaymentVerify';
import PaymentMethod from '../contracts/PaymentMethod';
import OnlineGatewayFactory from '../OnlineGatewayFactory';

export default class OnlinePayment implements PaymentMethod {
  private gateway = '';
  private readonly onlineGatewayFactory: OnlineGatewayFactory;
  constructor() {
    this.onlineGatewayFactory = new OnlineGatewayFactory();
  }
  public async doPayment(payment: IPayment): Promise<any> {
    const onlineGateway = this.onlineGatewayFactory.make(this.gateway);
    const paymentReqeust: IPaymentRequest = {
      amount: payment.payment_amount,
      description: `بابت پرداخت آنلاین سفارش به شماره ${payment.order.id}`,
      transactionId: payment.transactionId,
    };
    return onlineGateway.paymentRequest(paymentReqeust);
  }
  public setGateway(gateway: string) {
    this.gateway = gateway;
  }

  public async verifyPayment(
    clientPaymentData: any,
  ): Promise<{ success: boolean; refID?: string }> {
    const onlineGateway = this.onlineGatewayFactory.make(this.gateway);
    const paymentVerifyData: IPaymentVerify = {
      amount: clientPaymentData.amount,
      refID: clientPaymentData.autority,
    };
    return onlineGateway.paymentVerify(paymentVerifyData);
  }
}
