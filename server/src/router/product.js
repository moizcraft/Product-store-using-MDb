const express = require("express");
const { User } = require("../model/auth");
const bcrypt = require('bcrypt');
const { AuthMiddleware } = require("../middleware/auth");
const { Product } = require("../model/products");
const productRouter = express.Router();


productRouter.get("/getAllProducts", async (req, res) => {
    try {
        const products = await Product.find({});

        res.send({ message: "Product data fetched successfully", products });

    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

// Get products for the authenticated seller
productRouter.get("/getSellerProducts", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        
        // Check if it's a seller
        const isSeller = user.role === 'seller' || (user.role && ['admin', 'super-admin', 'seller'].includes(user.role));
        
        if (!isSeller) {
            return res.status(403).send({ message: "Only sellers can access their products" });
        }

        const products = await Product.find({ sellerId: user._id });

        res.send({ message: "Seller products fetched successfully", products });

    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

productRouter.get("/getProduct/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            throw new Error("Product not found");
        }

        res.send({ message: "Product fetched successfully", product });

    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });

    }
})

productRouter.post("/addProduct", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;

        // Check if it's a seller (either from User collection or Admin collection)
        const isSeller = user.role === 'seller' || (user.role && ['admin', 'super-admin', 'seller'].includes(user.role));
        
        if (!isSeller) {
            return res.status(403).send({ message: "Only sellers can add products" });
        }

        const { name, description, price, category, imageUrl, stock } = req.body;

        const product = new Product({
            name,
            description,
            price: Number(price),
            category,
            imageUrl,
            stock: stock || 0,
            inStock: (stock || 0) > 0,
            sellerId: user._id,
            sellerStoreName: user.storeName || user.name
        });

        await product.save();
        res.status(201).send({ message: "Product added successfully", product });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

productRouter.delete('/deleteProduct/:id', AuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        // Check if it's a seller
        const isSeller = user.role === 'seller' || (user.role && ['admin', 'super-admin', 'seller'].includes(user.role));
        
        if (!isSeller) {
            return res.status(403).send({ message: "Only sellers can delete products" });
        }

        const product = await Product.findById(id);

        if (!product) {
            throw new Error("Product not found");
        }

        // Seller can only delete their own products
        if (product.sellerId.toString() !== user._id.toString()) {
            return res.status(403).send({ message: "You can only delete your own products" });
        }

        await Product.findByIdAndDelete(id);
        res.send({ message: "Product deleted successfully", product });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
})

productRouter.patch('/updateProduct/:id', AuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const data = req.body;

        // Check if it's a seller
        const isSeller = user.role === 'seller' || (user.role && ['admin', 'super-admin', 'seller'].includes(user.role));
        
        if (!isSeller) {
            return res.status(403).send({ message: "Only sellers can update products" });
        }

        const product = await Product.findById(id);

        if (!product) {
            throw new Error("Product not found");
        }

        // Seller can only update their own products
        if (product.sellerId.toString() !== user._id.toString()) {
            return res.status(403).send({ message: "You can only update your own products" });
        }

        // Update stock and inStock
        if (data.stock !== undefined) {
            data.inStock = data.stock > 0;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        res.send({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
})

module.exports = {
    productRouter
}




