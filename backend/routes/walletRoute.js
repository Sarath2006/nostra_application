import express from 'express';
import authUser from '../middleware/auth.js';
import { applyCoins, checkDiscount } from '../controllers/walletController.js';

const router = express.Router();
router.post("/discount", authUser, checkDiscount);
router.post("/use", authUser, applyCoins);
export default router;