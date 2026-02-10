const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address");
      }
    }
  },

  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!['male', 'female', 'other'].includes(value)) {
        throw new Error("Gender must be male, female or other");
      }
    }
  },

  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },

  role: {
    type: String,
    enum: ['seller', 'admin', 'super-admin'],
    default: 'seller',
    lowercase: true
  },

  storeName: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 100,
    required: true
  },

  category: {
    type: String,
    trim: true,
    enum: ['Men Accessories', 'Women Accessories', 'Shoes', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food & Beverages'],
    required: true
  },

  about: {
    type: String,
    trim: true,
    default: "This is About field!"
  },

  skills: {
    type: [String],
    default: []
  },

  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    validate(value) {
      if (value && !validator.isMobilePhone(value, 'any', { strictMode: false })) {
        throw new Error("Invalid Phone Number");
      }
    }
  },

  address: {
    type: String,
    trim: true,
    default: ""
  },

  photoUrl: {
    type: String,
    default: "https://www.example.com/default-photo.jpg",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL for photo");
      }
    }
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  totalSales: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }

}, {
  collection: 'admin',
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function() {
  const admin = this;

  if (!admin.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
});

adminSchema.methods.getJwt = async function() {
  const admin = this;
  const token = await jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
    expiresIn: '7d'
  });

  return token;
};

adminSchema.methods.validatePassword = async function(password) {
  const admin = this;
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  return isPasswordMatch;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
  Admin
};
