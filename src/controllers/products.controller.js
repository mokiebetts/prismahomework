import { ProductsService } from '../services/products.service.js';

export class ProductsController {
    productsService = new ProductsService();

    getprodutcs = async(req, res, next) => {
        try {

            const product = await this.productsService.findAllProducts();


            return res.status(200).json({ data: product });
        } catch (err) {
            next(err);
        }
    };

    getProductById = async(req, res, next) => {
        try {
            const { productId } = req.params;

            const product = await this.productsService.findProductById(productId);

            if (!product) {
                return res.status(404).json({ error: '제품을 찾을 수 없습니다.' });
            }

            return res.status(200).json({ data: product });
        } catch (err) {
            next(err);
        }
    };

    createProduct = async(req, res, next) => {
        try {
            const { title, description } = req.body;
            const userId = res.locals.user.userId;

            const createdProduct = await this.productsService.createProduct(
                title,
                description,
                userId
            );

            return res.status(201).json({ data: createdProduct });
        } catch (err) {
            next(err);
        }
    };


    updateProduct = async(req, res, next) => {
        try {
            const { productId } = req.params;
            const { description, title, status } = req.body;
            const userId = res.locals.user.userId;

            const updatedProduct = await this.productsService.updateProduct(
                productId,
                description,
                title,
                status,
                userId
            );

            return res.status(200).json({ data: updatedProduct });
        } catch (err) {
            next(err);
        }
    };

    deleteProduct = async(req, res, next) => {
        try {
            const { productId } = req.params;
            const userId = res.locals.user.userId;

            const deletedProduct = await this.productsService.deleteProduct(productId, userId);

            return res.status(200).json({ data: deletedProduct });
        } catch (err) {
            next(err);
        }
    };
}