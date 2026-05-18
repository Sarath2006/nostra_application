import RecycleOrder from "../models/RecycleOrder.js";
import Wallet from "../models/Wallet.js";
import WalletTxn from "../models/WalletTransaction.js";
import ImpactMessage from "../models/ImpactMessage.js";
import { calculateCoins } from "../services/coinEngine.js";
import mongoose from "mongoose";

export const submitRecycle = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { items, pickup } = req.body;

    /* ===== Pickup validation ===== */
    if (!pickup || !pickup.address) {
      return res.json({
        success: false,
        message: "Pickup address is required"
      });
    }

    /* ===== Item validation ===== */
    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "At least one item is required"
      });
    }

    if (items.length < 3 || items.length > 5) {
      return res.json({
        success: false,
        message: "Recycle order must contain minimum 3 and maximum 5 items"
      });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.clothType) {
        return res.json({
          success: false,
          message: `Cloth type required for item ${i + 1}`
        });
      }

      if (!item.images || item.images.length < 3) {
        return res.json({
          success: false,
          message: `Minimum 3 images required for item ${i + 1}`
        });
      }
    }

    /* ===== Wallet logic ===== */
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) wallet = await Wallet.create({ userId });

    const hoursSinceLast = wallet.lastRecycleAt
      ? (Date.now() - wallet.lastRecycleAt) / 3600000
      : 72;

    const monthlyAttempts = Math.floor(wallet.monthlyEarned / 20);

    const coins = calculateCoins({
      itemCount: items.length,
      monthlyAttempts,
      hoursSinceLast
    });

    wallet.balance += coins;
    wallet.monthlyEarned += coins;
    wallet.lastRecycleAt = new Date();
    await wallet.save();

    await WalletTxn.create({
      userId,
      type: "CREDIT",
      coins,
      reason: "ReWear Recycling"
    });

    const order = await RecycleOrder.create({
      userId,
      pickup,
      items,
      itemCount: items.length,
      coinsEarned: coins
    });

    res.json({
      success: true,
      coins,
      order
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getMyRecycles = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const orders = await RecycleOrder
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



/* =====================================================
   REWEAR DASHBOARD STATS  ✅ NEW
===================================================== */
export const getReWearStats = async (req, res) => {
  try {
    const userId = req.body.userId; // string from token

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1️⃣ Total Coins Earned (CREDIT from recycling)
    const coinAgg = await WalletTxn.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "CREDIT",
          reason: "ReWear Recycling"
        }
      },
      {
        $group: {
          _id: null,
          totalCoins: { $sum: "$coins" }
        }
      }
    ]);
    const totalCoinsEarned = coinAgg[0]?.totalCoins || 0;

    // Current available wallet balance (credits - debits)
    const wallet = await Wallet.findOne({ userId: userObjectId });
    const availableCoins = wallet?.balance || 0;

    // 2️⃣ Total Items Recycled
    const itemAgg = await RecycleOrder.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: "$itemCount" }
        }
      }
    ]);

    const totalItems = itemAgg[0]?.totalItems || 0;

    // 3️⃣ Total ReWear Orders
    const totalOrders = await RecycleOrder.countDocuments({
      userId: userObjectId
    });

    res.json({
      success: true,
      stats: {
        totalCoins: availableCoins,
        totalCoinsEarned,
        totalItems,
        totalOrders
      }
    });

  } catch (error) {
    console.error("ReWear Dashboard Error:", error);
    res.json({ success: false, message: error.message });
  }
};


/* =====================================================
   GET USER IMPACT MESSAGES  ✅ NEW
===================================================== */
export const getImpactMessages = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch impact messages for the user
    const messages = await ImpactMessage
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("Get Impact Messages Error:", error);
    res.json({ success: false, message: error.message });
  }
};
