import express from 'express';

import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress, requestPasswordReset, verifyOtp, resetPassword, getAllCustomers, getCustomerDetailedInfo, deleteAccount } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/update-profile', authUser, updateUserProfile)
userRouter.post('/add-address', authUser, addAddress)
userRouter.post('/update-address', authUser, updateAddress)
userRouter.post('/delete-address', authUser, deleteAddress)
userRouter.post('/request-password-reset', requestPasswordReset);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/delete-account', authUser, deleteAccount);
userRouter.get('/all-customers', adminAuth, getAllCustomers);
userRouter.post('/customer-detailed-info', adminAuth, getCustomerDetailedInfo);

export default userRouter;