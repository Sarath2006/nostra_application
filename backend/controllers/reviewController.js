import mongoose from 'mongoose';

import Review from '../models/reviewModel.js';
import productModel from '../models/productModel.js';
// Add Review

export const addReview = async (req, res) => {
  try {
    const { productId, name, rating, text, userId } = req.body;

    if (!productId || !name || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    await Review.create({
      productId: new mongoose.Types.ObjectId(productId), // 🔥 FIX
      name,
      rating,
      text,
      userId: userId || null,
    });

    res.json({ success: true, message: "Review added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get reviews for a product
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
  productId: productId,
}).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({
      _id: reviewId,
      userId: userId,
    });

    if (!review) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this review",
      });
    }

    review.rating = rating;
    review.text = text;
    await review.save();

    res.json({ success: true, message: "Review updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
