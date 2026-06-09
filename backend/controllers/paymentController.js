import Payment from '../models/Payment.js';

// @desc    Get all payments for a user
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
    try {
        let payments;
        if (req.user.role === 'admin') {
            payments = await Payment.find({}).populate('user', 'name email');
        } else {
            payments = await Payment.find({ user: req.user._id });
        }
        res.json(payments);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
    try {
        const { amount, plan } = req.body;

        const payment = new Payment({
            user: req.user._id,
            amount,
            plan,
        });

        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    } catch (error) {
        next(error);
    }
};

export { getPayments, createPayment };
