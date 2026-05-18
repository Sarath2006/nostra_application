import RecycleOrder from "../models/RecycleOrder.js";
import ImpactMessage from "../models/ImpactMessage.js";
import WalletTxn from "../models/WalletTransaction.js";
import Wallet from "../models/Wallet.js";
import userModel from "../models/userModel.js";

/* =====================================================
   ADMIN: ADD IMPACT MESSAGE TO RECYCLE ORDER
   ===================================================== */
export const addImpact = async (req, res) => {
  try {
    const { recycleOrderId, impactTitle, impactMessage } = req.body;

    if (!recycleOrderId || !impactMessage) {
      return res.json({
        success: false,
        message: "Recycle order ID and impact message are required"
      });
    }

    const order = await RecycleOrder.findById(recycleOrderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Recycle order not found"
      });
    }

    order.impactTitle = impactTitle || "Update from ReWear";
    order.impactMessage = impactMessage;
    await order.save();

    await ImpactMessage.create({
      userId: order.userId,
      recycleOrderId,
      message: impactMessage
    });

    res.json({
      success: true,
      message: "Impact update sent successfully"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================================
   ADMIN: GET FULL USER + RECYCLE + WALLET DETAILS
   ===================================================== */
export const getUserFullDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel
      .findById(userId)
      .select("name email createdAt");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const wallet = await Wallet.findOne({ userId });

    const recycleOrders = await RecycleOrder
      .find({ userId })
      .sort({ createdAt: -1 });

    const walletTransactions = await WalletTxn
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,

      /* USER INFO */
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinedAt: user.createdAt
      },

      /* WALLET INFO */
      wallet: {
        balance: wallet?.balance || 0,
        totalCoinsEarned: wallet?.monthlyEarned || 0,
        lastDiscountUsedAt: wallet?.lastDiscountUsedAt || null
      },

      /* RECYCLE ORDERS (FULL DETAILS) */
      recycleOrders: recycleOrders.map(order => ({
        orderId: order._id,
        items: order.items,               // item type + images
        pickup: order.pickup,             // address + date + slot
        coinsEarned: order.coinsEarned,
        status: order.status,
        impactTitle: order.impactTitle,
        impactMessage: order.impactMessage,
        createdAt: order.createdAt
      })),

      /* WALLET TRANSACTIONS */
      walletTransactions: walletTransactions.map(txn => ({
        type: txn.type,                   // CREDIT / DEBIT
        coins: txn.coins,
        reason: txn.reason,
        createdAt: txn.createdAt
      }))
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllRecycleOrders = async (req, res) => {
  try {
    const orders = await RecycleOrder
      .find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};