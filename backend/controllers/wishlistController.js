import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).populate('wishlist');
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.wishlist.includes(productId)) {
      return res.json({ success: false, message: 'Product already in wishlist' });
    }
    user.wishlist.push(productId);
    await user.save();
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
