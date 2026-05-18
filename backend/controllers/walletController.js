import Wallet from "../models/Wallet.js";
import WalletTxn from "../models/WalletTransaction.js";
import { getDiscountOffer } from "../services/discountEngine.js";

/* =====================================================
   CHECK DISCOUNT ELIGIBILITY
   ===================================================== */
export const checkDiscount = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { cartValue } = req.body;

    if (!cartValue || cartValue <= 0) {
      return res.json({
        success: false,
        message: "Invalid cart value"
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.json({
        success: false,
        message: "Wallet not found"
      });
    }

    // ⏳ Cooldown: 5 days
    if (wallet.lastDiscountUsedAt) {
      const daysPassed =
        (Date.now() - wallet.lastDiscountUsedAt.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysPassed < 5) {
        return res.json({
          success: true,
          eligible: false,
          cooldown: true,
          nextAvailableInDays: Math.ceil(5 - daysPassed),
          walletBalance: wallet.balance
        });
      }
    }

    const offer = getDiscountOffer(wallet.balance, cartValue);

    if (!offer) {
      return res.json({
        success: true,
        eligible: false,
        walletBalance: wallet.balance
      });
    }

    res.json({
      success: true,
      eligible: true,
      walletBalance: wallet.balance,
      discount: offer.discount,
      coinsRequired: offer.coinsUsed,
      minCartValue: offer.minCart
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   APPLY DISCOUNT (DEDUCT COINS)
   ===================================================== */
export const applyCoins = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { cartValue } = req.body;

    if (!cartValue || cartValue <= 0) {
      return res.json({
        success: false,
        message: "Invalid cart value"
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.json({
        success: false,
        message: "Wallet not found"
      });
    }

    // ⏳ Cooldown: 5 days
    if (wallet.lastDiscountUsedAt) {
      const daysPassed =
        (Date.now() - wallet.lastDiscountUsedAt.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysPassed < 5) {
        return res.json({
          success: false,
          message: "Discount cooldown active"
        });
      }
    }

    const offer = getDiscountOffer(wallet.balance, cartValue);
    if (!offer) {
      return res.json({
        success: false,
        message: "Not eligible for discount"
      });
    }

    // ✅ Deduct ONLY required coins
    wallet.balance -= offer.coinsUsed;
    wallet.lastDiscountUsedAt = new Date();
    await wallet.save();

    // ✅ Log transaction
    await WalletTxn.create({
      userId,
      type: "DEBIT",
      coins: offer.coinsUsed,
      reason: "Order Discount"
    });

    res.json({
      success: true,
      discountApplied: offer.discount,
      coinsDeducted: offer.coinsUsed,
      remainingCoins: wallet.balance
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};