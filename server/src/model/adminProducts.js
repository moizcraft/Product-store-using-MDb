const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const AdminProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [3, 'Title must be at least 3 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    category: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (v) => !v || validator.isURL(v)
        }
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Admin ID is required']
    },
    adminName: {
        type: String,
        trim: true,
        required: [true, 'Admin name is required']
    }
}, {
    collection: 'adminProducts',
    timestamps: true
});

const AdminProduct = mongoose.model('AdminProduct', AdminProductSchema);

module.exports = {
    AdminProduct
};
