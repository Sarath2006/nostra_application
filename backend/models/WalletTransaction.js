import mongoose from "mongoose";

const walletTxnSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  type: { type: String, enum: ["CREDIT", "DEBIT", "ADJUST"], required: true },
  coins: Number,
  reason: String,
  referenceId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

export default mongoose.model('walletTransaction', walletTxnSchema);