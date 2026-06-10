import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';

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


app.use(errorHandler)


export default app;