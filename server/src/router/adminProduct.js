const express = require('express');
const { AuthMiddleware } = require('../middleware/auth');
const { AdminProduct } = require('../model/adminProducts');

const adminProductRouter = express.Router();

// Get all admin products (public)
adminProductRouter.get('/getAll', async (req, res) => {
    try {
        const items = await AdminProduct.find({});
        res.send({ message: 'Admin products fetched', products: items });
    } catch (error) {
        res.status(400).send({ message: 'BAD REQUEST', error: error.message });
    }
});

adminProductRouter.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await AdminProduct.findById(id);
        if (!product) throw new Error('Product not found');
        res.send({ message: 'Product fetched', product });
    } catch (error) {
        res.status(400).send({ message: 'BAD REQUEST', error: error.message });
    }
});

// Add admin product - only admin or super-admin
adminProductRouter.post('/add', AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        if (!user || !['admin', 'super-admin'].includes(user.role)) {
            return res.status(403).send({ message: 'Only admins can add admin products' });
        }

        const { title, description, price, category, imageUrl } = req.body;

        const product = new AdminProduct({
            title,
            description,
            price,
            category,
            imageUrl,
            adminId: user._id,
            adminName: user.name
        });

        await product.save();
        res.send({ message: 'Admin product added', product });
    } catch (error) {
        res.status(400).send({ message: 'BAD REQUEST', error: error.message });
    }
});

// Update admin product - only owning admin or super-admin
adminProductRouter.patch('/update/:id', AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;
        const data = req.body;

        if (!user || !['admin', 'super-admin'].includes(user.role)) {
            return res.status(403).send({ message: 'Only admins can update admin products' });
        }

        const product = await AdminProduct.findById(id);
        if (!product) throw new Error('Product not found');

        // If not super-admin, ensure owner
        if (user.role !== 'super-admin' && product.adminId.toString() !== user._id.toString()) {
            return res.status(403).send({ message: 'You can only update your own admin products' });
        }

        const updated = await AdminProduct.findByIdAndUpdate(id, data, { new: true });
        res.send({ message: 'Admin product updated', product: updated });
    } catch (error) {
        res.status(400).send({ message: 'BAD REQUEST', error: error.message });
    }
});

// Delete admin product - only owning admin or super-admin
adminProductRouter.delete('/delete/:id', AuthMiddleware, async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        if (!user || !['admin', 'super-admin'].includes(user.role)) {
            return res.status(403).send({ message: 'Only admins can delete admin products' });
        }

        const product = await AdminProduct.findById(id);
        if (!product) throw new Error('Product not found');

        if (user.role !== 'super-admin' && product.adminId.toString() !== user._id.toString()) {
            return res.status(403).send({ message: 'You can only delete your own admin products' });
        }

        await AdminProduct.findByIdAndDelete(id);
        res.send({ message: 'Admin product deleted', product });
    } catch (error) {
        res.status(400).send({ message: 'BAD REQUEST', error: error.message });
    }
});

module.exports = {
    adminProductRouter
};
