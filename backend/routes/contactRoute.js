import express from 'express';
import { submitContact } from '../controllers/contactController.js';
import authUser from '../middleware/auth.js';

const contactRouter = express.Router();

contactRouter.post('/send', authUser, submitContact);

export default contactRouter;