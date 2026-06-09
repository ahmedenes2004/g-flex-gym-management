import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('Kullanıcı zaten mevcut');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'member',
            profile: { height: 0, weight: 0, targetWeight: 0 }
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Geçersiz kullanıcı verisi');
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Sabit Admin Girişi ve Otomatik Seed logic
        if (email === 'admin@gflex.com' && password === 'admin123') {
            let adminUser = await User.findOne({ email: 'admin@gflex.com' });
            if (!adminUser) {
                adminUser = await User.create({
                    name: 'G-Flex Admin',
                    email: 'admin@gflex.com',
                    password: 'admin123',
                    role: 'admin',
                    profile: { height: 180, weight: 85, targetWeight: 80 }
                });
            }
            return res.json({
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                profile: adminUser.profile,
                token: generateToken(adminUser._id),
            });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Geçersiz e-posta veya şifre');
        }
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            });
        } else {
            res.status(404);
            throw new Error('Kullanıcı bulunamadı');
        }
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.profile.height = req.body.height || user.profile.height;
            user.profile.weight = req.body.weight || user.profile.weight;
            user.profile.targetWeight = req.body.targetWeight || user.profile.targetWeight;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404);
            throw new Error('Kullanıcı bulunamadı');
        }
    } catch (error) {
        next(error);
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
