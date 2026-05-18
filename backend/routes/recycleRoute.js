import express from 'express';
import authUser from '../middleware/auth.js';
import { submitRecycle, getMyRecycles, getReWearStats, getImpactMessages } from '../controllers/recycleController.js';

const router = express.Router();

const ensureBody = (req, res, next) => {
  if (!req.body) req.body = {};
  next();
};

router.post("/submit", ensureBody, authUser, submitRecycle);
router.get("/my", ensureBody, authUser, getMyRecycles);
router.get("/dashboard", ensureBody, authUser, getReWearStats);
router.get("/impact-messages", ensureBody, authUser, getImpactMessages);
export default router;