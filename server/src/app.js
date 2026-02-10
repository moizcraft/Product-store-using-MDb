const express = require('express');

const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const connectDB = require('./config/database');

const { authRouter } = require('./router/auth.js');

const { productRouter } = require('./router/product.js');

const { adminProductRouter } = require('./router/adminProduct.js');

const cors = require('cors');

const { AuthMiddleware } = require('./middleware/auth.js');

const { fileRouter } = require('./router/files.js');

const { cartRouter } = require('./router/cartNew.js');

const { superAdminRouter } = require('./router/superAdmin.js');



dotenv.config();



const app = express();



app.use(cors({

    origin: ['http://localhost:5173', 'http://localhost:5174'],

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization']

}));



app.use(express.json());

app.use(cookieParser());





app.use('/products', productRouter);

app.use('/admin-products', adminProductRouter);

app.use('/auth', authRouter);

app.use('/files', fileRouter);

app.use('/cart', cartRouter);

app.use('/super-admin', superAdminRouter);



// Health check endpoint

app.get('/health', (req, res) => {

    res.status(200).json({ 

        status: 'OK', 

        message: 'Server is running',

        timestamp: new Date().toISOString()

    });

});









const port = process.env.PORT || 5000;







connectDB().then(() => {

    console.log("Database connected successfully");

    app.listen(port, () => {

        console.log(`Server is running on port ${port}`);

    });



}).catch((err) => {

    console.log("Database connection failed", err);

});