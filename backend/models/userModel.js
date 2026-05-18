import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipcode: {type: String, required: true},
    country: {type: String, required: true},
}, {timestamps: true});

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},   
    cart: {type: Object, default: {}},
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    username: {type: String, unique: true, sparse: true},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    gender: {type: String, enum: ['Male', 'Female', ''], default: ''},
    phone: {type: String, default: ''},
    dateOfBirth: {type: String, default: ''},
    country: {type: String, default: ''},
    addresses: [addressSchema],
    resetOtp: {type: String, default: null},
    resetOtpExpiry: {type: Date, default: null},
    resetOtpRequestAt: {type: Date, default: null},
}, {minimize:false, timestamps: true})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;