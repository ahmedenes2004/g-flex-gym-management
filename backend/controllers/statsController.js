import User from '../models/User.js';
import GymClass from '../models/GymClass.js';
import Payment from '../models/Payment.js';

const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalClasses = await GymClass.countDocuments({});
        const payments = await Payment.find({});
        
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        const classes = await GymClass.find({});
        const classPopularity = classes.map(c => ({
            name: c.name,
            enrolled: c.enrolledMembers.length
        }));

        res.json({
            totalUsers,
            totalClasses,
            totalRevenue,
            classPopularity
        });
    } catch (error) {
        next(error);
    }
};

export { getStats };
