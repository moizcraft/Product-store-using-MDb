const express = require("express");
const { Admin } = require("../model/admin");
const bcrypt = require('bcrypt');
const { validateLogin, validateSignup } = require("../lib/utils");

const adminAuthRouter = express.Router();

adminAuthRouter.post("/signup", async (req, res) => {
    try {
        // STEP 1: Normalize and validate input data
        const { name, email, password, age, gender, role, storeName, category, phoneNumber, address } = req.body;

        // Normalize data before validation
        const normalizedData = {
            name: name ? name.trim() : '',
            email: email ? email.toLowerCase().trim() : '',
            password: password || '',
            age: typeof age === 'string' ? parseInt(age, 10) : Number(age),
            gender: gender ? gender.toLowerCase().trim() : '',
            role: role ? role.toLowerCase().trim() : 'seller',
            storeName: storeName ? storeName.trim() : '',
            category: category || '',
            phoneNumber: phoneNumber ? phoneNumber.trim() : '',
            address: address ? address.trim() : ''
        };

        // Validate normalized data
        validateSignup(normalizedData);

        // STEP 2: Check if admin/seller already exists
        const existingAdmin = await Admin.findOne({ email: normalizedData.email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Seller account already exists with this email"
            });
        }

        // Check if email already exists in User collection (prevent duplicate)
        const { User } = require("../model/auth");
        const existingUser = await User.findOne({ email: normalizedData.email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered as a customer. Please use a different email for seller account."
            });
        }

        // STEP 3: Create Admin/Seller (password will be hashed by pre-save middleware)
        const adminData = {
            name: normalizedData.name,
            email: normalizedData.email,
            password: normalizedData.password,
            age: normalizedData.age,
            gender: normalizedData.gender,
            role: normalizedData.role || 'seller',
            storeName: normalizedData.storeName,
            category: normalizedData.category,
            phoneNumber: normalizedData.phoneNumber || undefined,
            address: normalizedData.address || undefined
        };

        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        // Generate JWT Token for the new admin
        const token = await newAdmin.getJwt();

        // Remove password from response
        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        // Set cookie (httpOnly). For local development use sameSite 'lax'.
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days (matches JWT expiry)
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

    } catch (error) {
        console.error("Admin signup error:", error);
        const status = error && error.message && /required|must|invalid/i.test(error.message) ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error.message || "Signup failed"
        });
    }
});

adminAuthRouter.post('/login', async (req, res) => {
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

        // STEP 2: Check if the admin exists in the database
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // STEP 3: Verify password
        const isPasswordMatch = await admin.validatePassword(normalizedData.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // STEP 4: Generate JWT Token
        const token = await admin.getJwt();

        console.log("Generated Admin Token:", token);

        // STEP 5: Set cookie and respond
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days (matches JWT expiry)
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(200).json({
            success: true,
            message: "Seller logged in successfully",
            token,
            admin: adminResponse
        });

    } catch (error) {
        console.error("Admin login error:", error);
        const status = error && error.message && /required|invalid|password/i.test(error.message) ? 401 : 500;
        res.status(status).json({
            success: false,
            message: error.message || "Login failed"
        });
    }
});

adminAuthRouter.post('/logout', (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Logout failed"
        });
    }
});

// Get current admin/seller from token
const { validateAdminToken } = require('../middleware/auth');

adminAuthRouter.get('/me', validateAdminToken, async (req, res) => {
    try {
        const { admin } = req;
        if (!admin) throw new Error('Admin not found');

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(200).json({ success: true, admin: adminResponse });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
    }
});

module.exports = {
    adminAuthRouter
};
