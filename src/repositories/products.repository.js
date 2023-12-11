import { prisma } from '../utils/prisma/index.js';

export class ProductsRepository {
    findAllProducts = async() => {

        const products = await prisma.Product.findMany();

        return products;
    };

    findProductById = async(productId) => {

        const product = await prisma.Product.findUnique({
            where: { productId: +productId },
        });

        return product;
    };


    createProduct = async(title, description, userId) => {
        const createdProduct = await prisma.Product.create({
            data: {
                title,
                description,
                UserId: userId,
            },
        });

        return createdProduct;
    };


    updateProduct = async(productId, description, title, statusToUpdate, userId) => {


        const updatedProduct = await prisma.product.update({
            where: {
                productId: +productId,
            },
            data: {
                UserId: userId,
                title: title,
                description: description,
                status: statusToUpdate,
            },
        });

        return updatedProduct;
    };

    deleteProduct = async(productId) => {
        try {
            const deletedProduct = await prisma.Product.delete({
                where: {
                    productId: +productId,
                },
            });

            return deletedProduct
        } catch (error) {
            console.error(error);
            throw new Error('상품 삭제에 실패했습니다.');
        }
    };

}