const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');

const ProductSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Product name is required'],
        trim: true,
        minLength: [5, 'Product name must be at least 5 characters'],
        maxLength: [50, 'Product name must be at most 100 characters']
    },
    description: {
        type: String,
        require: [true, 'Product description is required'],
        trim: true,
        minLength: [20, 'Product description must be at least 20 characters'],
        maxLength: [500, 'Product description must be at most 500 characters']
    },
    price: {
        type: Number,
        require: [true, 'Product price is required'],
    },
    category: {
        type: String,
        require: [true, 'Product category is required'],
        trim: true,
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        require: [true, 'Product stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    imageUrl: {
        type: String,
        require: [true, 'Product image URL is required'],
        validate: {
            validator: (value) => {
                // Allow both URLs and base64 encoded images
                const isBase64 = value.startsWith('data:image/');
                const isURL = validator.isURL(value);
                return isBase64 || isURL;
            },
            message: 'Image must be a valid URL or base64 encoded image'
        }
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'Seller ID is required']
    },
    sellerStoreName: {
        type: String,
        require: [true, 'Seller Store Name is required'],
        trim: true
    }


}, {
    collection: 'products',
    timestamps: true
})

// Auto-update inStock based on stock quantity
ProductSchema.pre('save', function () {
    this.inStock = this.stock > 0;
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = {
    Product
};