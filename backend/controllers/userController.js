import validator from 'validator';
import bycrypt from "bcrypt";
import jwt, { decode } from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import { sendWelcomeEmail, sendOtpEmail } from '../services/emailService.js';
import mongoose from 'mongoose';
import orderModel from '../models/orderModel.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import RecycleOrder from '../models/RecycleOrder.js';
import reviewModel from '../models/reviewModel.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bycrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }
            })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking user already exists or not 
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validating email format & string password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "PLease enter valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password is too weak" })
        }

        // hasing user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(err => {
            console.error('Failed to send welcome email:', err.message);
        });

        const token = createToken(user._id)

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const adminLogin = async (req, res) => {

    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credientials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { firstName, lastName, gender, phone, username, dateOfBirth, country } = req.body;

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (gender !== undefined) updateData.gender = gender;
        if (phone !== undefined) updateData.phone = phone;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (country !== undefined) updateData.country = country;
        if (username !== undefined) {
            // Check if username already exists
            const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
            if (existingUser) {
                return res.json({ success: false, message: "Username already taken" });
            }
            updateData.username = username;
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add address
const addAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { name, phone, street, city, state, zipcode, country } = req.body;

        if (!name || !phone || !street || !city || !state || !zipcode || !country) {
            return res.json({ success: false, message: "All address fields are required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.addresses.push({ name, phone, street, city, state, zipcode, country });
        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update address
const updateAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { addressId, name, phone, street, city, state, zipcode, country } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.json({ success: false, message: "Address not found" });
        }

        if (name) address.name = name;
        if (phone) address.phone = phone;
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zipcode) address.zipcode = zipcode;
        if (country) address.country = country;

        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { addressId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.addresses.pull(addressId);
        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// Request password reset OTP
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        if(!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        const user = await userModel.findOne({ email });


        if(!user) {
            return res.json({ success: false, message: "No account found with this email" });
        }

        // Check if OTP was requested recently (prevent spam)
        if(user.resetOtpRequestAt){
            const timeSinceLastRequest = Date.now() - new Date(user.resetOtpRequestAt).getTime();
            const waitTime = 90000; // 1.5 minutes in milliseconds


            if(timeSinceLastRequest < waitTime) {
                const remainingTime = Math.ceil((waitTime - timeSinceLastRequest) / 1000);
                return res.json({
                    success: false,
                    message: `Please wait ${remainingTime} seconds before requesting a OTP`,
                    remainingTime
                });
            }
        }


        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing 
        const hashedOtp = await bycrypt.hash(otp, 10);

        // Set OTP expiry to 5 minutes from now
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        // Update user with OTP details
        user.resetOtp = hashedOtp;
        user.resetOtpExpiry = otpExpiry;
        user.resetOtpRequestAt = new Date();
        await user.save();

        // Send OTP email
        const emailResult = await sendOtpEmail(user.email, user.name, otp);


        if(!emailResult.success){
            return res.json({ success: false, message: "Failed to send OTP email"});
        }

        res.json({
            success: true,
            message: "OTP sent to your email address",
            canResendAt: new Date(Date.now() + 90000).toISOString()
        });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if(!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required"});
        }

        const user  = await userModel.findOne({ email });


        if(!user) {
            return res.json({ success: false, message: "User not found "});
        }

        if(!user.resetOtp || !user.resetOtpExpiry) {
            return res.json({ success: false, message: "No OTP request found. Plwase request a new OTP"});
        }


        // Check if OTP is expired
        if(new Date() > new Date(user.resetOtpExpiry)) {
            user.resetOtp = null;
            user.resetOtpExpiry = null;
            user.resetOtpRequestAt = null;
            await user.save();
            return res.json({ success: false, message: "OTP has expired. Please request a new one"});
        }

        // Verify OTP
        const isOtpValid = await bycrypt.compare(otp, user.resetOtp);

        if(!isOtpValid){
            return res.json({ success: false, message: "Invalid OTP"});
        }

        // OTP is valid - generate a temporary token for password reset
        const resetToken = jwt.sign({ id: user._id, purpose: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '10m' });


        res.json({
            success: true,
            message: "OTP verified successfully",
            resetToken
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Reset password
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if(!resetToken || !newPassword) {
            return res.json({ success: false, message: "Reset token and new password are required"});
        }

        if(newPassword.length < 8){
            return res.json({ success: false, message: "Password must be at least 8 characters long"});
        }

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
            if(decoded.purpose !== 'password-reset'){
                return res.json({ success: false, message: "Invalid reset token"});
            }
        } catch (error) {
            return res.json({ success: false, message: "Reset token expired or invalid"});
        }

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.json({ success: false, message: "User not found"});
        }

        // Hash new password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(newPassword, salt);


        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.resetOtpRequestAt = null;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await userModel
            .find()
            .select('_id name email phone createdAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            customers,
            total: customers.length
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get single customer details with all activities
const getCustomerDetailedInfo = async (req, res) => {
    try {
        const { customerId } = req.body;

        // Basic user info
        const user = await userModel
            .findById(customerId)
            .select('-password');

        if (!user) {
            return res.json({
                success: false,
                message: "Customer not found"
            });
        }

        const userId = new mongoose.Types.ObjectId(customerId);

        // Get orders
        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

        // Get wallet info
        const wallet = await Wallet.findOne({ userId });

        // Get wallet transactions
        const walletTransactions = await WalletTransaction
            .find({ userId })
            .sort({ createdAt: -1 });

        // Get recycle orders
        const recycleOrders = await RecycleOrder.find({ userId }).sort({ createdAt: -1 });

        // Get reviews
        const reviews = await reviewModel.find({ userId }).sort({ createdAt: -1 });

        // Calculate stats
        const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;
        const totalReviews = reviews.length;
        const totalRecycled = recycleOrders.length;

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                addresses: user.address,
                joinedAt: user.createdAt
            },
            stats: {
                totalOrders,
                totalSpent,
                totalRecycled,
                totalReviews,
                walletBalance: wallet?.balance || 0,
                coinsEarned: wallet?.monthlyEarned || 0
            },
            orders: orders.map(o => ({
                _id: o._id,
                items: o.items,
                totalAmount: o.amount,
                status: o.status,
                createdAt: o.date
            })),
            walletTransactions: walletTransactions.map(t => ({
                type: t.type,
                coins: t.coins,
                reason: t.reason,
                createdAt: t.createdAt
            })),
            recycleOrders: recycleOrders.map(r => ({
                _id: r._id,
                itemCount: r.items?.length || 0,
                coinsEarned: r.coinsEarned || 0,
                status: r.status,
                createdAt: r.createdAt
            })),
            reviews: reviews.map(r => ({
                _id: r._id,
                productName: r.productId?.name || 'Unknown Product',
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt
            }))
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete User Account and All Related Data
const deleteAccount = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Delete all user-related data from various collections
        
        // 1. Delete user's orders
        await orderModel.deleteMany({ userId });
        console.log(`Deleted orders for user: ${userId}`);

        // 2. Delete user's recycle orders
        await RecycleOrder.deleteMany({ userId });
        console.log(`Deleted recycle orders for user: ${userId}`);

        // 3. Delete user's reviews
        await reviewModel.deleteMany({ userId });
        console.log(`Deleted reviews for user: ${userId}`);

        // 4. Delete user's wallet transactions
        await WalletTransaction.deleteMany({ userId });
        console.log(`Deleted wallet transactions for user: ${userId}`);

        // 5. Delete user's wallet
        await Wallet.deleteMany({ userId });
        console.log(`Deleted wallet for user: ${userId}`);

        // 6. Finally delete the user account
        await userModel.findByIdAndDelete(userId);
        console.log(`Deleted user account: ${userId}`);

        res.json({
            success: true,
            message: "Account and all related data deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress, requestPasswordReset, verifyOtp, resetPassword, getAllCustomers, getCustomerDetailedInfo, deleteAccount }
