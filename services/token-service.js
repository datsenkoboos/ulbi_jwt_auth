const jwt = require('jsonwebtoken');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async saveToken(userId, refreshToken) {
        return await prisma.token.upsert({
            where: {
                userId
            },
            update: {
                refreshToken
            },
            create: {
                userId,
                refreshToken
            }
        });
    }
    async removeToken(refreshToken) {
        const token = await prisma.token.delete({
            where: {
                refreshToken
            }
        })
        return token
    }
}
module.exports = new TokenService();