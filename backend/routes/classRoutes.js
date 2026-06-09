import express from 'express';
import { getClasses, createClass, enrollClass, deleteClass } from '../controllers/classController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const adminOrTrainer = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'trainer')) {
        next();
    } else {
        res.status(403);
        next(new Error('Yetkisiz işlem: Admin veya Eğitmen değilsiniz'));
    }
};

router.route('/')
    .get(getClasses)
    .post(protect, adminOrTrainer, createClass);

router.route('/:id').delete(protect, adminOrTrainer, deleteClass);
router.route('/:id/enroll').put(protect, enrollClass);

export default router;
