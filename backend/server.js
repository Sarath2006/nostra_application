import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import recycleRoute from './routes/recycleRoute.js';
import walletRoute from './routes/walletRoute.js';
import adminRecycleRoute from './routes/adminRecycleRoute.js';
import contactRouter from './routes/contactRoute.js';
// App Config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares

app.use(express.json());
app.use(cors());

// api endpoints

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review', reviewRoute)
app.use('/api/recycle', recycleRoute)
app.use('/api/wallet', walletRoute)
app.use('/api/admin/recycle', adminRecycleRoute)
app.use('/admin/recycle', adminRecycleRoute)
app.use('/api/contact', contactRouter)
import wishlistRouter from './routes/wishlistRoute.js';
app.use('/api/wishlist', wishlistRouter);

app.get('/', (req, res)=>{
    res.send('API Working')
})

app.listen(port, ()=> console.log('Server started on port ' + port))