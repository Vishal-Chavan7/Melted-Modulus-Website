import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import checkoutRouter from './routes/checkout.route.js';
import orderRouter from './routes/order.route.js';
import adminOrderRouter from './routes/adminOrder.route.js';
import adminUserRouter from './routes/adminUser.route.js';
import adminDashboardRouter from './routes/adminDashboard.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

// Define routes here
app.get('/', (req, res) => {
    res.send('Welcome to the 3D Bamboo Website API');
});

// user routes
app.use('/api/v1/users', userRouter)

// category routes
app.use('/api/v1', categoryRouter)

// product routes
app.use('/api/v1', productRouter)

// cart routes
app.use('/api/v1', cartRouter)

// checkout routes
app.use('/api/v1', checkoutRouter)

// order routes
app.use('/api/v1', orderRouter)

// admin order routes
app.use('/api/v1', adminOrderRouter)

// admin user routes
app.use('/api/v1', adminUserRouter)

// admin dashboard routes
app.use('/api/v1', adminDashboardRouter)


app.use(errorHandler)


export default app;