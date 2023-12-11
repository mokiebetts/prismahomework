import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {

    createAuth = async(email, password, name) => {
        try {
            if (!email || !password || !name) {
                throw new Error('Auth 정보를 입력해주세요');
            }

            const existingUser = await prisma.Users.findUnique({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                throw new Error('같은 아이디가 이미 존재합니다.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const createdAuth = await prisma.Users.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            return {
                userId: createdAuth.userId,
                createdAt: createdAuth.createdAt,
                updatedAt: createdAuth.updatedAt,
            };
        } catch (error) {
            console.error(error);
            throw new Error('회원가입이 실패했습니다.');
        }
    };

    loginAuth = async(email, password, res) => {
        try {
            const user = await prisma.Users.findUnique({
                where: { email },
            });

            if (!user) {
                throw new Error('일치하는 인증 정보가 없습니다.');
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (!isPasswordMatched) {
                throw new Error('비밀번호가 일치하지 않습니다.');
            }

            const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
                expiresIn: '1h',
            });

            res.setHeader('Authorization', `Bearer ${accessToken}`);

            return {
                success: true,
                message: '로그인에 성공했습니다.',
                data: { accessToken: `Bearer ${accessToken}` },
            };
        } catch (error) {
            console.error(error);
            throw new Error('예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.');
        }
    };
}