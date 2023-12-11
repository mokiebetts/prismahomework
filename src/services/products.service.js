import { ProductsRepository } from "../repositories/Products.repository.js";


export class ProductsService {
    productsRepository = new ProductsRepository();

    findAllProducts = async() => {

        const products = await this.productsRepository.findAllProducts();

        // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
        products.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return products.map((product) => {
            return {
                productId: product.productId,
                UserId: product.UserId,
                description: product.description,
                title: product.title,
                status: product.status,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            };
        });
    };

    findProductById = async(productId) => {
        // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
        const product = await this.productsRepository.findProductById(productId);

        return {
            productId: product.productId,
            description: product.description,
            title: product.title,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    };

    createProduct = async(title, description, userId) => {
        // 저장소(Repository)에게 데이터를 요청합니다.
        const createdPost = await this.productsRepository.createProduct(
            title,
            description,
            userId
        );

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return {
            productId: createdPost.productId,
            UserId: createdPost.userId,
            description: createdPost.description,
            title: createdPost.title,
            status: createdPost.status,
            createdAt: createdPost.createdAt,
            updatedAt: createdPost.updatedAt,
        };
    };
    updateProduct = async(productId, title, description, status, userId) => {
        try {
            const product = await this.productsRepository.findProductById(productId);

            if (!product) {
                throw {
                    status: 404,
                    message: '상품 조회에 실패했습니다.',
                };
            }

            if (!title && !description && !status) {
                throw {
                    status: 400,
                    message: '수정 정보는 최소 한 가지 이상이어야 합니다.',
                };
            }

            // const statusToUpdate = status ? 'FOR_SALE' : 'SOLD_OUT';

            if (product.status === 'FOR_SALE') {
                product.status = 'SOLD_OUT'
            } else if (product.status === 'SOLD_OUT') {
                product.status = 'FOR_SALE'
            }

            let statusToUpdate = product.status

            if (!statusToUpdate) {
                throw {
                    status: 400,
                    message: '지원하지 않는 상태입니다. (status: FOR_SALE | SOLD_OUT)',
                };
            }

            const updatedProduct = await this.productsRepository.updateProduct(
                productId,
                description,
                title,
                statusToUpdate,
                userId
            );

            return updatedProduct;
        } catch (err) {
            console.error(err);
            throw new Error('상품 업데이트에 실패했습니다.');
        }
    };


    deleteProduct = async(productId, userId) => {

        const product = await this.productsRepository.findProductById(productId);

        if (!product) {
            throw {
                status: 404,
                message: '상품 조회에 실패했습니다.',
            };
        }

        const isProductOwner = product.UserId === userId;
        if (!isProductOwner) {
            throw {
                status: 403,
                message: '상품 삭제 권한이 없습니다.',
            };
        }

        await this.productsRepository.deleteProduct(productId);

        return {
            ...product
        };
    };
}