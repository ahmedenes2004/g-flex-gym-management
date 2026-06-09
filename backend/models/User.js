import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lütfen bir isim girin'],
    },
    email: {
        type: String,
        required: [true, 'Lütfen bir e-posta adresi girin'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Lütfen bir şifre belirleyin'],
    },
    role: {
        type: String,
        enum: ['member', 'trainer', 'admin'],
        default: 'member',
    },
    profile: {
        height: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
        targetWeight: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Şifreyi kaydetmeden önce hashle
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
