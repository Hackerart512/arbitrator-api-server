import pool from '../../common/config/db.js';

const createCasePaymentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS case_payments  (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
            payment_id VARCHAR(100), -- Razorpay/Cashfree payment ID
            amount NUMERIC(15,2),
            gst_invoice TEXT,
            method VARCHAR(50),
            paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
   `;

    await pool.query(query);

    console.log('createCasePaymentTable  table ready');
};

export default createCasePaymentTable;
