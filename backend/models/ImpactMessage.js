import mongoose from "mongoose";

const impactMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  recycleOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "recycleOrder",
    required: true
  },
  message: { type: String, required: true },
  createdBy: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.model("impactMessage", impactMessageSchema);
