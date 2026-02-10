const express = require("express");
const { User } = require("../model/auth");
const { Admin } = require("../model/admin");
const bcrypt = require('bcrypt');
const { validateLogin, validateSignup } = require("../lib/utils");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // STEP 1: Normalize and validate input data
        const { name, email, password, age, gender, role, storeName, category } = req.body;

        // Normalize data before validation
        const normalizedData = {
            name: name ? name.trim() : '',
            email: email ? email.toLowerCase().trim() : '',
            password: password || '',
            age: typeof age === 'string' ? parseInt(age, 10) : Number(age),
            gender: gender ? gender.toLowerCase().trim() : '',
            role: role ? role.toLowerCase().trim() : 'customer'
        };

        // Add seller-specific fields to normalized data if role is seller
        if (normalizedData.role === 'seller') {
            normalizedData.storeName = storeName ? storeName.trim() : '';
            normalizedData.category = category ? category.trim() : '';
        }

        // Validate normalized data
        validateSignup(normalizedData);

        // STEP 2: Check if user/admin already exists
        const existingUser = await User.findOne({ email: normalizedData.email });
        const existingAdmin = await Admin.findOne({ email: normalizedData.email });

        if (existingUser || existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // STEP 3: Create User or Admin based on role
        if (normalizedData.role === 'seller') {
            // Save seller in Admin collection
            const adminData = {
                name: normalizedData.name,
                email: normalizedData.email,
                password: normalizedData.password,
                age: normalizedData.age,
                gender: normalizedData.gender,
                role: 'seller',
                storeName: normalizedData.storeName,
                category: normalizedData.category
            };

            const newAdmin = new Admin(adminData);
            await newAdmin.save();

            // Generate JWT Token
            const token = await newAdmin.getJwt();

            // Remove password from response
            const adminResponse = newAdmin.toObject();
            delete adminResponse.password;

            // Set cookie
            res.cookie('token', token, {
                expires: new Date(Date.now() + 7 * 24 * 3600000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            res.status(201).json({
                success: true,
                message: "Seller account created successfully",
                token,
                admin: adminResponse
            });
        } else {
            // Save customer in User collection
            const userData = {
                name: normalizedData.name,
                email: normalizedData.email,
                password: normalizedData.password,
                age: normalizedData.age,
                gender: normalizedData.gender,
                role: normalizedData.role || 'customer'
            };

            const newUser = new User(userData);
            await newUser.save();

            // Generate JWT Token
            const token = await newUser.getJwt();

            // Remove password from response
            const userResponse = newUser.toObject();
            delete userResponse.password;

            // Set cookie
            res.cookie('token', token, {
                expires: new Date(Date.now() + 7 * 24 * 3600000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            res.status(201).json({
                success: true,
                message: "User created successfully",
                token,
                user: userResponse
            });
        }

    } catch (error) {
        console.error("Signup error:", error);
        const status = error && error.message && /required|must|invalid/i.test(error.message) ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error.message || "Signup failed"
        });
    }
})


authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Normalize data before validation
        const normalizedData = {
            email: email ? email.toLowerCase().trim() : '',
            password: password || ''
        };

        // STEP 1: Validate the incoming data
        validateLogin(normalizedData);

        const normalizedEmail = normalizedData.email;

        // STEP 2: Check Admin collection first (for sellers)
        let user = await Admin.findOne({ email: normalizedEmail });
        let isAdmin = false;

        if (user) {
            isAdmin = true;
        } else {
            // STEP 3: Check User collection (for customers)
            user = await User.findOne({ email: normalizedEmail });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // STEP 4: Verify password
        const isPasswordMatch = await user.validatePassword(normalizedData.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // STEP 5: Generate JWT Token
        const token = await user.getJwt();

        console.log("Generated Token:", token);

        // STEP 6: Set cookie and respond
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 3600000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: isAdmin ? "Seller logged in successfully" : "User logged in successfully",
            token,
            [isAdmin ? 'admin' : 'user']: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        const status = error && error.message && /required|invalid|password/i.test(error.message) ? 401 : 500;
        res.status(status).json({
            success: false,
            message: error.message || "Login failed"
        })
    }
})


authRouter.post('/logout', (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })

        res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Logout failed"
        })
    }
})

// Get current user from cookie/token
const { AuthMiddleware } = require('../middleware/auth');

authRouter.get('/me', AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Error('User not found');

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ success: true, user: userResponse });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
    }
});


module.exports = {
    authRouter
}