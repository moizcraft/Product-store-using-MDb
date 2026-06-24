const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('MONGODB_URI:', process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
}

module.exports = connectDB;