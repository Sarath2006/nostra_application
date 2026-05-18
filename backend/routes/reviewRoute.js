import express from 'express';
import { addReview, getReviews } from '../controllers/reviewController.js';
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authUser ,addReview);
router.get("/:productId", getReviews);

export default router;