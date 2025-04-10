import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment')
  async createPayment(
    @Body() paymentDto: PaymentDto
  ) 
  {
    return this.paymentsService.createPayment(paymentDto);
  }

  @Get('success')
  async successPayment() {
    return {
      ok: true,
      message: 'Payment success'
    }
  }

  @Get('cancel')
  async cancelPayment() {
    return {
      ok: true,
      message: 'Payment cancel'
    }
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
