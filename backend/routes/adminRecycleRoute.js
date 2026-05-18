import express from 'express';
import adminAuth from "../middleware/adminAuth.js";
import { addImpact, getAllRecycleOrders, getUserFullDetails } from '../controllers/adminRecycleController.js';

const router = express.Router();
router.post("/impact", adminAuth, addImpact);
router.post("/user/full-details", adminAuth, getUserFullDetails);
router.get("/orders", adminAuth, getAllRecycleOrders)
export default router;