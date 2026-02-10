const express = require("express");
const { Cart } = require("../model/cart");
const { Product } = require("../model/products");
const { AuthMiddleware } = require("../middleware/auth");

const cartRouter = express.Router();

// Add product to cart or update quantity
cartRouter.post("/add", AuthMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity, addedAt: new Date() }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity, addedAt: new Date() });
      }
    }

    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.productId',
      select: 'name price imageUrl category stock inStock'
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
      cartCount: cart.items.length
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add product to cart"
    });
  }
});

// Get user's cart
cartRouter.get("/", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name price imageUrl category stock inStock'
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [] },
        cartCount: 0
      });
    }

    res.status(200).json({
      success: true,
      cart,
      cartCount: cart.items.length
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart"
    });
  }
});

// Update item quantity in cart
cartRouter.put("/update", AuthMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.productId',
      select: 'name price imageUrl category stock inStock'
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
      cartCount: cart.items.length
    });

  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart"
    });
  }
});

// Remove product from cart
cartRouter.delete("/:productId", AuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Filter out the product
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: 'items.productId',
      select: 'name price imageUrl category stock inStock'
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
      cartCount: cart.items.length
    });

  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove product from cart"
    });
  }
});

// Clear entire cart
cartRouter.delete("/clear/all", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: { items: [] },
      cartCount: 0
    });

  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart"
    });
  }
});

module.exports = {
  cartRouter
};
