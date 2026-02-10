const express = require("express");
const { AuthMiddleware } = require("../middleware/auth");
const { User } = require("../model/auth");
const { Product } = require("../model/products");
const cartRouter = express.Router();

// Get cart items for authenticated user
cartRouter.get("/getCart", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;

        const userData = await User.findById(user._id).populate('cart.productId');
        
        if (!userData) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ 
            message: "Cart fetched successfully", 
            cartItems: userData.cart || [],
            cartCount: userData.cart ? userData.cart.length : 0
        });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

// Add item to cart
cartRouter.post("/addToCart", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).send({ message: "Not enough stock available" });
        }

        const userData = await User.findById(user._id);

        // Check if item already in cart
        const existingItem = userData.cart.find(item => 
            item.productId.toString() === productId
        );

        if (existingItem) {
            // Update quantity if item already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to cart
            userData.cart.push({
                productId,
                quantity
            });
        }

        await userData.save();

        // Populate product details before sending response
        await userData.populate('cart.productId');

        res.status(201).send({ 
            message: "Item added to cart successfully", 
            cartItems: userData.cart,
            cartCount: userData.cart.length
        });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

// Remove item from cart
cartRouter.delete("/removeFromCart/:productId", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        const { productId } = req.params;

        const userData = await User.findById(user._id);

        // Remove item from cart
        userData.cart = userData.cart.filter(item => 
            item.productId.toString() !== productId
        );

        await userData.save();
        await userData.populate('cart.productId');

        res.send({ 
            message: "Item removed from cart successfully", 
            cartItems: userData.cart,
            cartCount: userData.cart.length
        });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

// Update item quantity in cart
cartRouter.put("/updateCartQuantity/:productId", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).send({ message: "Quantity must be at least 1" });
        }

        // Check if product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).send({ message: "Not enough stock available" });
        }

        const userData = await User.findById(user._id);

        // Update quantity
        const cartItem = userData.cart.find(item => 
            item.productId.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).send({ message: "Item not found in cart" });
        }

        cartItem.quantity = quantity;
        await userData.save();
        await userData.populate('cart.productId');

        res.send({ 
            message: "Cart quantity updated successfully", 
            cartItems: userData.cart,
            cartCount: userData.cart.length
        });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

// Clear entire cart
cartRouter.delete("/clearCart", AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;

        const userData = await User.findById(user._id);
        userData.cart = [];
        await userData.save();

        res.send({ 
            message: "Cart cleared successfully", 
            cartItems: [],
            cartCount: 0
        });
    } catch (error) {
        res.status(400).send({ message: "BAD REQUEST", error: error.message });
    }
});

module.exports = cartRouter;
