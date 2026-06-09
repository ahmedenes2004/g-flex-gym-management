import mongoose from 'mongoose';

const gymClassSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a class name'],
    },
    description: {
        type: String,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    schedule: {
        type: Date,
        required: [true, 'Please add a schedule date and time'],
    },
    capacity: {
        type: Number,
        required: [true, 'Please add a class capacity'],
        default: 20
    },
    enrolledMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const GymClass = mongoose.model('GymClass', gymClassSchema);

export default GymClass;
