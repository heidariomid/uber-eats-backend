import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post()
  processPaddlePayment(@Body() body) {
    console.log('Payment received', body);
    return { ok: true };
  }
}
