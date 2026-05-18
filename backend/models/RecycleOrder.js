import mongoose from "mongoose";

const recycleItemSchema = new mongoose.Schema({
  clothType: {
    type: String,
    required: true
  },

  materialType: {
    type: String,
    required: false   // OPTIONAL
  },

  images: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length >= 3,
      message: "Minimum 3 images required per item"
    }
  }
});

const recycleOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

  contact: {
    name: String,
    phone: String
  },

  pickup: {
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },
    preferredDate: String,
    preferredSlot: String
  },

  items: {
    type: [recycleItemSchema],
    required: true,
    validate: {
      validator: v => v.length >= 3 && v.length <= 5,
      message: "Each recycle order must contain 3 to 5 items"
    }
  },

  itemCount: Number,
  coinsEarned: Number,

  status: {
    type: String,
    enum: ["pending", "picked", "verified", "completed"],
    default: "pending"
  },

  // ✅ FULLY FREE ADMIN INPUT
  impactTitle: {
    type: String
  },

  impactMessage: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("recycleOrder", recycleOrderSchema);
