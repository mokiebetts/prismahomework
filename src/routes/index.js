import express from 'express';
import ProductsRouter from './products.router.js';
import AuthRouter from './auth.router.js'
import UserRouter from './users.router.js'

const router = express.Router();

router.use('/products/', ProductsRouter);
router.use('/auth/', AuthRouter);
router.use('/users/', UserRouter)

export default router;