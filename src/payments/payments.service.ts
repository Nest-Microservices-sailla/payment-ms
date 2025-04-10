import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentDto } from './dto/payment.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(envs.stripeSecret)

    async createPayment(paymentDto: PaymentDto) {

        const { currency, items, orderId } = paymentDto

        const line_items = items.map(item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100), //equivale a 25,00
                },
                quantity: item.quantity,
            }
        })

        const session = await this.stripe.checkout.sessions.create({
            //Id de la orden
            payment_intent_data: {
                metadata: {
                    orderId: orderId,
                }
            },
            line_items: line_items,
            mode: 'payment',
            success_url: envs.successUrl,
            cancel_url: envs.cancelUrl,
        })

        return session
    }

    async stripeWebhook(req: Request, res: Response) {
        
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        // Real
        const endpointSecret = envs.endpointSecret

        try {
            event = this.stripe.webhooks.constructEvent(
                req['rawBody'],
                sig as string,
                endpointSecret,
            );
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                // TODO: llamar nuestro microservicio
                console.log({
                    metadata: chargeSucceeded.metadata,
                    orderId: chargeSucceeded.metadata.orderId,
                });
                break;

            default:
                console.log(`Event ${event.type} not handled`);
        }

        return res.status(200).json({ sig });
    }


}
