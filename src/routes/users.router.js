import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { needSignin } from '../middlewares/need-signin.middleware.js';

const router = express.Router();
const userController = new UserController();

router.get('/me', needSignin, userController.GetMyInfo);


export default router;