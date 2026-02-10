const express = require("express");
const { User } = require("../model/auth");
const { Admin } = require("../model/admin");
const { validateSuperAdmin } = require("../middleware/auth");

const superAdminRouter = express.Router();

// Get all users (customers)
superAdminRouter.get("/users", validateSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users"
    });
  }
});

// Get all admins/sellers
superAdminRouter.get("/admins", validateSuperAdmin, async (req, res) => {
  try {
    // Exclude super-admin from the list
    const admins = await Admin.find(
      { role: { $ne: 'super-admin' } }, 
      '-password'
    ).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admins"
    });
  }
});

// Delete a user (customer)
superAdminRouter.delete("/users/:userId", validateSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user"
    });
  }
});

// Delete an admin/seller
superAdminRouter.delete("/admins/:adminId", validateSuperAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin/Seller not found"
      });
    }

    // Prevent deleting another super admin
    if (admin.role === 'super-admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete another Super Admin"
      });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({
      success: true,
      message: "Admin/Seller deleted successfully",
      deletedAdmin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete admin"
    });
  }
});

// Get dashboard stats
superAdminRouter.get("/stats", validateSuperAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments({ role: { $ne: 'super-admin' } });
    const totalSellers = await Admin.countDocuments({ role: 'seller' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalSellers,
        totalAccounts: totalUsers + totalAdmins
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stats"
    });
  }
});

// Update user details
superAdminRouter.put("/users/:userId", validateSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, age, gender, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (role) user.role = role;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user"
    });
  }
});

// Update admin details
superAdminRouter.put("/admins/:adminId", validateSuperAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, age, gender, storeName, category, role } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Prevent editing super admin
    if (admin.role === 'super-admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot edit Super Admin"
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (age) admin.age = age;
    if (gender) admin.gender = gender;
    if (storeName) admin.storeName = storeName;
    if (category) admin.category = category;
    if (role && role !== 'super-admin') admin.role = role;

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: adminResponse
    });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update admin"
    });
  }
});

// Get all products (from all sellers)
superAdminRouter.get("/products", validateSuperAdmin, async (req, res) => {
  try {
    const { Product } = require("../model/products");
    
    const products = await Product.find()
      .populate('sellerId', 'name email storeName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products"
    });
  }
});

// Delete any product
superAdminRouter.delete("/products/:productId", validateSuperAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { Product } = require("../model/products");

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: {
        id: product._id,
        name: product.name,
        price: product.price
      }
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product"
    });
  }
});

// Update any product
superAdminRouter.put("/products/:productId", validateSuperAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, stock, imageUrl } = req.body;
    const { Product } = require("../model/products");

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product"
    });
  }
});

module.exports = {
  superAdminRouter
};
