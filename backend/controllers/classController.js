import GymClass from '../models/GymClass.js';

const getClasses = async (req, res, next) => {
    try {
        const classes = await GymClass.find({}).populate('trainer', 'name email');
        res.json(classes);
    } catch (error) {
        next(error);
    }
};

const createClass = async (req, res, next) => {
    try {
        const { name, description, schedule, capacity } = req.body;

        const gymClass = new GymClass({
            name,
            description,
            schedule,
            capacity,
            trainer: req.user._id, // the creator becomes the trainer by default
        });

        const createdClass = await gymClass.save();
        res.status(201).json(createdClass);
    } catch (error) {
        next(error);
    }
};

const enrollClass = async (req, res, next) => {
    try {
        const gymClass = await GymClass.findById(req.params.id);

        if (!gymClass) {
            res.status(404);
            throw new Error('Ders bulunamadı');
        }

        if (gymClass.enrolledMembers.includes(req.user._id)) {
            res.status(400);
            throw new Error('Zaten bu derse kayıtlısınız');
        }

        if (gymClass.enrolledMembers.length >= gymClass.capacity) {
            res.status(400);
            throw new Error('Ders kontenjanı dolu');
        }

        gymClass.enrolledMembers.push(req.user._id);
        await gymClass.save();

        res.json({ message: 'Başarıyla kayıt olundu' });
    } catch (error) {
        next(error);
    }
};

const deleteClass = async (req, res, next) => {
    try {
        const gymClass = await GymClass.findById(req.params.id);

        if (gymClass) {
            if (req.user.role === 'admin' || (req.user.role === 'trainer' && gymClass.trainer.toString() === req.user._id.toString())) {
                await gymClass.deleteOne();
                res.json({ message: 'Ders başarıyla silindi' });
            } else {
                res.status(403);
                throw new Error('Bu dersi silmek için yetkiniz yok');
            }
        } else {
            res.status(404);
            throw new Error('Ders bulunamadı');
        }
    } catch (error) {
        next(error);
    }
};

export { getClasses, createClass, enrollClass, deleteClass };
