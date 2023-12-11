import { prisma } from "../utils/prisma/index.js";

export class UserRepository {

    getMyInfo = async(userId) => {
        const user = await prisma.Users.findUnique({
            where: {
                userId: userId,
            },
        });

        return user;
    };
}