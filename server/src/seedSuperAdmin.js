const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Admin } = require('./model/admin');
const connectDB = require('./config/database');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists:");
      console.log("Email:", existingSuperAdmin.email);
      console.log("Name:", existingSuperAdmin.name);
      process.exit(0);
    }

    // Create Super Admin
    const superAdminData = {
      name: "Super Admin",
      email: "moizxcraft@gmail.com",
      password: "moiz@123",
      gender: "Male",
      age: 20,
      role: "super-admin",
      storeName: "VibeWear Owner",
      category: "Fashion",
      about: "Super Administrator with full system access",
      isVerified: true
    };

    const superAdmin = new Admin(superAdminData);
    await superAdmin.save();

    console.log("\n✅ Super Admin created successfully!");
    console.log("==========================================");
    console.log("Email:", superAdminData.email);
    console.log("Password:", superAdminData.password);
    console.log("Role:", superAdminData.role);
    console.log("==========================================");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("\nYou can now login with these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
