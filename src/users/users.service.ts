import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findAll(role?: string) {
        return this.prisma.user.findMany({
            where: role ? { role: role as any } : {},
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
