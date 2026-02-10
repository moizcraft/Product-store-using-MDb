const mongoose = require('mongoose');

const {Schema} = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
  name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true
        // Removed lowercase: true to preserve name capitalization
    },

    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,



        validate(value){        
           if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address")
           }
        }
     
    },

    password:{
        type: String,
        required: true,

        // Password is hashed before saving via pre-save middleware
        // Original requirements:
        // 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    },

    gender: {
        type: String,
        required: true,
        lowercase: true,

        validate(value){
            if(!['male', 'female', 'other'].includes(value)){
                throw new Error("Gender must be male, female or other")
        }}
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        max: 50,
    },

    role: {
        type: String,
        enum: ['buyer', 'customer', 'user'],
        default: 'buyer',
        lowercase: true
    },

    about: {
        type: String,
        trim: true,
        lowercase: true,
        default : "This is About field !"
    },

    skills : {
        type : [String]

    },

    photoUrl : {
        type: String,
        default: "https://www.example.com/default-photo.jpg",

        

        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL for photo")
            }
        }

    },

    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }]

}, {
    collection: 'users',
    timestamps: true
})

// Hash password before saving
// Using modern Mongoose pattern - async function without next parameter
userSchema.pre('save', async function() {
    const user = this;
    
    // Only hash if password has been modified or is new
    if (!user.isModified('password')) {
        return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
})

userSchema.methods.getJwt = async function(){
    const user = this;
    const token = await jwt.sign({id: user._id}, process.env.SECRET_KEY, {
        expiresIn: '7d'
    });

    return token;
}


userSchema.methods.validatePassword = async function(password){
    const user = this;
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch;
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};