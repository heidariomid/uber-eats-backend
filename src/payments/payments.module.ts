import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payments.entity';
import { PaymentsController } from './payments.controller';
import { Order } from 'src/orders/entities/orders.entity';
import PaymentMethodFactory from './PaymentMethodFactory';
import OnlineGatewayFactory from './OnlineGatewayFactory';

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [
    PaymentsService,
    PaymentsResolver,
    PaymentMethodFactory,
    OnlineGatewayFactory,
  ],
})
export class PaymentsModule {}
