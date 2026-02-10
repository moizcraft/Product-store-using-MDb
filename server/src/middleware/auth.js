const jwt = require('jsonwebtoken');
const { User } = require('../model/auth');
const { Admin } = require('../model/admin');

const AuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Unauthorized Access ! Please login first.");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const {id} = decoded;

        // First, try to find in User collection
        let user = await User.findById(id);
        if (user) {
            req.user = user;
            return next();
        }

        // If not found in User collection, try Admin collection
        let admin = await Admin.findById(id);
        if (admin) {
            // Set as req.user for compatibility with existing code
            req.user = admin;
            req.admin = admin;
            return next();
        }

        throw new Error("User not found");

    } catch (error) {
        return res.status(401).send({ message: "Unauthorized", error: error.message });
    }
}

// Middleware for Admin/Seller authentication
const validateAdminToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Unauthorized Access ! Please login first.");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = decoded;

        const admin = await Admin.findById(id);

        if (!admin) {
            throw new Error("Admin/Seller not found");
        }

        req.admin = admin;
        next();

    } catch (error) {
        return res.status(401).send({ message: "Unauthorized", error: error.message });
    }
}

// Middleware for Super Admin only
const validateSuperAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Unauthorized Access! Please login first.");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = decoded;

        const admin = await Admin.findById(id);

        if (!admin) {
            throw new Error("Admin not found");
        }

        // Check if user has super-admin role
        if (admin.role !== 'super-admin') {
            throw new Error("Access denied. Super Admin privileges required.");
        }

        req.admin = admin;
        req.superAdmin = admin;
        next();

    } catch (error) {
        return res.status(403).send({ 
            success: false,
            message: "Forbidden", 
            error: error.message 
        });
    }
}


module.exports = {
    AuthMiddleware,
    validateAdminToken,
    validateSuperAdmin
};