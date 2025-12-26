import razorpay from './razorpay.client.js';
import crypto from 'crypto';

class RazorpayService {

    async createOrder({ amount, receipt, notes = {} }) {
        return razorpay.orders.create({
            amount: amount * 100, // INR → paise
            currency: 'INR',
            receipt,
            notes,
            payment_capture: 1
        });
    }

    verifySignature({ orderId, paymentId, signature }) {
        const body = `${orderId}|${paymentId}`;
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        return expected === signature;
    }

    handleWebhook = async (req, res) => {
        const event = req.body.event;

        if (event === 'payment.captured') {
            const payment = req.body.payload.payment.entity;
            // backup save
        }

        res.json({ status: 'ok' });
    };


}

export default new RazorpayService();
