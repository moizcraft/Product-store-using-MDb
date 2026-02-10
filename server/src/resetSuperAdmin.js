const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Admin } = require('./model/admin');
const connectDB = require('./config/database');

dotenv.config();

const resetSuperAdmin = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Delete existing super admin
    const deleted = await Admin.deleteMany({ role: 'super-admin' });
    console.log(`\n🗑️  Deleted ${deleted.deletedCount} existing Super Admin(s)`);

    // Create new Super Admin
    const superAdminData = {
      name: "Super Admin",
      email: "moizxcraft@gmail.com",
      password: "moiz@123",
      gender: "male",
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
    console.log("\n🎉 You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("Error resetting Super Admin:", error);
    process.exit(1);
  }
};

resetSuperAdmin();
