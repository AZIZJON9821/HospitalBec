import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: { doctorId: string; rating: number; comment?: string }) {
        const review = await this.prisma.review.create({
            data: {
                userId,
                doctorId: dto.doctorId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });

        // Update doctor's average rating
        const doctorReviews = await this.prisma.review.findMany({
            where: { doctorId: dto.doctorId },
            select: { rating: true },
        });

        const averageRating = doctorReviews.reduce((acc, curr) => acc + curr.rating, 0) / doctorReviews.length;

        await this.prisma.doctor.update({
            where: { id: dto.doctorId },
            data: {
                rating: averageRating,
                reviewCount: doctorReviews.length,
            },
        });

        return review;
    }

    async findByDoctor(doctorId: string) {
        return this.prisma.review.findMany({
            where: { doctorId },
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
