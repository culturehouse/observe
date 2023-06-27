const { PrismaClient } = require('@prisma/client');

const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query'],
})

module.exports = prisma

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
