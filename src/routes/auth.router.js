import express from 'express';
import { AuthController } from '../controllers/auth.controller.router.js';

const router = express.Router();
const authController = new AuthController();

router.post('/signup', authController.PostCreateAuth);

router.post('/signin', authController.PostLoginAuth);


export default router;