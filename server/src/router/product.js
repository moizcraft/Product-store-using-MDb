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
        console.log('=== ADD PRODUCT REQUEST ===');
        console.log('User:', req.user);
        console.log('Request body:', req.body);
        
        const { user } = req;

        // Check if it's a seller (either from User collection or Admin collection)
        const isSeller = user.role === 'seller' || (user.role && ['admin', 'super-admin', 'seller'].includes(user.role));
        
        console.log('User role:', user.role);
        console.log('Is seller:', isSeller);
        
        if (!isSeller) {
            console.log('Access denied - not a seller');
            return res.status(403).send({ message: "Only sellers can add products" });
        }

        const { name, description, price, category, imageUrl, stock } = req.body;
        
        // Validate required fields
        if (!name || name.trim().length < 5) {
            console.log('Validation failed: name');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Product name must be at least 5 characters" 
            });
        }
        
        if (!description || description.trim().length < 20) {
            console.log('Validation failed: description');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Description must be at least 20 characters" 
            });
        }
        
        if (!price || isNaN(price) || price <= 0) {
            console.log('Validation failed: price');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Price must be a valid number greater than 0" 
            });
        }
        
        if (!category || !category.trim()) {
            console.log('Validation failed: category');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Category is required" 
            });
        }
        
        if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
            console.log('Validation failed: stock');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Stock must be a valid number (0 or greater)" 
            });
        }
        
        if (!imageUrl || !imageUrl.trim()) {
            console.log('Validation failed: imageUrl');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Image URL is required" 
            });
        }
        
        // Validate imageUrl format (URL or base64)
        const isBase64 = imageUrl.trim().startsWith('data:image/');
        const isValidUrl = imageUrl.trim().startsWith('http://') || imageUrl.trim().startsWith('https://');
        
        if (!isBase64 && !isValidUrl) {
            console.log('Validation failed: imageUrl format');
            return res.status(400).send({ 
                message: "BAD REQUEST", 
                error: "Image must be a valid URL or base64 encoded image" 
            });
        }

        const product = new Product({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            imageUrl: imageUrl.trim(),
            stock: Number(stock),
            inStock: Number(stock) > 0,
            sellerId: user._id,
            sellerStoreName: user.storeName || user.name || 'Unknown Store'
        });

        console.log('Creating product:', product);
        await product.save();
        console.log('Product saved successfully');
        
        res.status(201).send({ message: "Product added successfully", product });
    } catch (error) {
        console.error('=== ERROR IN ADD PRODUCT ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        res.status(400).send({ 
            message: "BAD REQUEST", 
            error: error.message 
        });
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




