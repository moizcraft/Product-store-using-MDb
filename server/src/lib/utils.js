const validator = require('validator');
const { cloudinary } = require('./cloudinary');
const streamifier = require("streamifier");

function validateSignup(data) {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid signup data");
    }

    const {
        name,
        email,
        password,
        age,
        gender
    } = data;

    // Name validation
    if (!name || typeof name !== 'string') {
        throw new Error("Name is required");
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
        throw new Error("Name must be at least 3 characters");
    }
    if (trimmedName.length > 50) {
        throw new Error("Name must be at most 50 characters");
    }

    // Email validation
    if (!email || typeof email !== 'string') {
        throw new Error("Email is required");
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!validator.isEmail(normalizedEmail)) {
        throw new Error("Invalid Email Address!");
    }

    // Password validation - strong password (uppercase, lowercase, number, special char)
    if (!password || typeof password !== 'string') {
        throw new Error("Password is required");
    }
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
    }

    // Age validation - handle both number and string
    if (age === undefined || age === null || age === '') {
        throw new Error("Age is required");
    }
    const numericAge = typeof age === 'string' ? parseInt(age, 10) : Number(age);
    if (isNaN(numericAge) || !Number.isInteger(numericAge) || numericAge < 18 || numericAge > 50) {
        throw new Error("Age must be an integer between 18 and 50");
    }

    // Gender validation - normalize to lowercase
    if (!gender || typeof gender !== 'string') {
        throw new Error("Gender is required");
    }
    const normalizedGender = gender.toLowerCase().trim();
    if (!['male', 'female', 'other'].includes(normalizedGender)) {
        throw new Error("Gender must be male, female, or other");
    }

    // Role validation
    const role = data.role ? data.role.toLowerCase().trim() : 'user';
    if (!['user', 'seller', 'admin', 'customer'].includes(role)) {
        throw new Error("Invalid role");
    }

    // Seller fields validation
    if (role === 'seller') {
        if (!data.storeName || typeof data.storeName !== 'string' || data.storeName.trim().length < 3) {
            throw new Error("Store Name is required and must be at least 3 characters");
        }
        // Check for either 'category' (new Admin model) or 'storeCategory' (legacy)
        const category = data.category || data.storeCategory;
        if (!category || !['Men Accessories', 'Women Accessories', 'Shoes', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food & Beverages'].includes(category)) {
            throw new Error("Valid Store Category is required");
        }
    }
}


function validateLogin(data) {
    if (!data || typeof data !== 'object') {
        throw new Error("Invalid login data");
    }

    const { email, password } = data;

    // Email validation
    if (!email || typeof email !== 'string') {
        throw new Error("Email is required");
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!validator.isEmail(normalizedEmail)) {
        throw new Error("Invalid Email Address!");
    }

    // Password validation - just check if it exists, don't require strong password for login
    if (!password || typeof password !== 'string') {
        throw new Error("Password is required");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
}


const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "uploads" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};




module.exports = {
    validateSignup,
    validateLogin,
    uploadToCloudinary
}