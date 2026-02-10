// src/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { Product } = require('./model/products');

// Load .env from server folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: check if env variables are loaded correctly
console.log("DB USER:", process.env.DbUserName);
console.log("DB PASS:", process.env.DbPassword);
console.log("DB NAME:", process.env.DbName);

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DbUserName}:${process.env.DbPassword}@cluster3.m0d4qqk.mongodb.net/${process.env.DbName}`
    );
    console.log("MongoDB Connected for Seeding");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};

// const dummyProducts = [
//   {
//     name: "Handcrafted Peshawari Chappal",
//     description:
//       "Authentic leather sandals from Peshawar, renowned for their comfort and durability. Featuring a classic double-strap design and durable tire sole.",
//     price: 3500,
//     category: "Footwear",
//     imageUrl:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: true,
//   },
//   {
//     name: "Sindhi Ajrak Shawl Premium",
//     description:
//       "A symbol of Sindhi culture, this block-printed shawl features geometric patterns in deep red and indigo blue. Made from soft, breathable cotton.",
//     price: 2200,
//     category: "Clothing",
//     imageUrl:
//       "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: true,
//   },
//   {
//     name: "Multani Blue Pottery Vase",
//     description:
//       "Exquisite hand-painted ceramic vase featuring the signature blue and white floral motifs of Multan. Perfect for adding a touch of tradition to your home decor.",
//     price: 4500,
//     category: "Home Decor",
//     imageUrl:
//       "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: true,
//   },
//   {
//     name: "Truck Art Decorative Tray",
//     description:
//       "Vibrant serving tray inspired by Pakistan's famous truck art. Hand-painted with bright colors, floral patterns, and poetic verses.",
//     price: 1800,
//     category: "Home Decor",
//     imageUrl:
//       "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: false,
//   },
//   {
//     name: "Pure Pashmina Shawl",
//     description:
//       "Luxurious Cashmere wool shawl, hand-woven by artisans in Kashmir. Incredibly soft, warm, and lightweight. A timeless elegance.",
//     price: 12000,
//     category: "Clothing",
//     imageUrl:
//       "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: true,
//   },
//   {
//     name: "Brass Heritage Lamp",
//     description:
//       "Antique-style brass oil lamp with intricate engravings. Adds a warm, nostalgic glow to any room. Handcrafted in Lahore.",
//     price: 5500,
//     category: "Home Decor",
//     imageUrl:
//       "https://images.unsplash.com/photo-1540932296774-3ed466885b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     inStock: true,
//   },
// ];

const seedData = async () => {
  await connectDB();

  try {
    await Product.deleteMany({});
    console.log("Existing products removed.");

    const insertedProducts = await Product.insertMany(dummyProducts);
    console.log(`Successfully added ${insertedProducts.length} products.`);

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
