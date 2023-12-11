import express from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { needSignin } from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const productsController = new ProductsController();

/** 게시글 조회 API **/
router.get('/', productsController.getprodutcs);

/** 게시글 상세 조회 API **/
router.get('/:productId', productsController.getProductById);

/** 게시글 작성 API **/
router.post('/', needSignin, productsController.createProduct);

/** 게시글 수정 API **/
router.put('/:productId', needSignin, productsController.updateProduct);

/** 게시글 삭제 API **/
router.delete('/:productId', needSignin, productsController.deleteProduct);

export default router;