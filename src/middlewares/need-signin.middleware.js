import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

export const needSignin = async(req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(400).json({
                success: false,
                message: '올바른 인증 정보가 필요합니다.',
            });
        }

        const [bearer, accessToken] = authorizationHeader.split(' ');

        if (!accessToken || bearer.toLowerCase() !== 'bearer') {
            return res.status(400).json({
                success: false,
                message: '올바른 Bearer 토큰이 필요합니다.',
            });
        }

        const decodedPayload = jwt.verify(accessToken, process.env.SECRET_KEY);
        const { userId } = decodedPayload;
        console.log('Decoded Payload:', decodedPayload);

        const user = await prisma.users.findUnique({ where: { userId } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: '존재하지 않는 사용자입니다.',
            });
        }

        delete user.password;
        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);

        let statusCode = 401;

        switch (error.message) {
            case 'jwt expired':
                statusCode = 401;
                error.message = '인증 정보 유효기간이 지났습니다.';
                break;
            case 'invalid signature':
                statusCode = 401;
                error.message = '유효하지 않는 인증 정보입니다.';
                break;
            default:
                statusCode = 500;
                error.message =
                    '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.';
                break;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};