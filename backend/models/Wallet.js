import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", unique: true },
  balance: { type: Number, default: 0 },
  monthlyEarned: { type: Number, default: 0 },
  lastRecycleAt: { type: Date },
  lastDiscountUsedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('wallet', walletSchema);