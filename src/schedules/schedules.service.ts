import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    async getByDoctor(userId: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });
        if (!doctor) throw new NotFoundException('Shifokor topilmadi');

        return this.prisma.schedule.findMany({
            where: { doctorId: doctor.id },
            orderBy: { dayOfWeek: 'asc' },
        });
    }

    async updateSchedules(userId: string, schedules: any[]) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });
        if (!doctor) throw new NotFoundException('Shifokor topilmadi');

        // Transaction to clear and recreate schedules
        return this.prisma.$transaction(async (tx) => {
            await tx.schedule.deleteMany({
                where: { doctorId: doctor.id },
            });

            return tx.schedule.createMany({
                data: schedules.map(s => ({
                    ...s,
                    doctorId: doctor.id,
                })),
            });
        });
    }
}
