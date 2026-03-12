import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getAdminStats() {
        const [userCount, doctorCount, departmentCount, appointmentCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.doctor.count(),
            this.prisma.department.count(),
            this.prisma.appointment.count(),
        ]);

        return {
            users: userCount,
            doctors: doctorCount,
            departments: departmentCount,
            totalAppointments: appointmentCount,
            revenue: appointmentCount * 50000, // Mock revenue logic: 50k per appointment
        };
    }

    async getDoctorStats(userId: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });

        if (!doctor) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [todayAppointments, totalPatients, completedAppointments] = await Promise.all([
            this.prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    appointmentDate: { gte: today },
                },
            }),
            this.prisma.appointment.groupBy({
                by: ['userId'],
                where: { doctorId: doctor.id },
            }).then(res => res.length),
            this.prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    appointmentDate: { lt: today },
                },
            }),
        ]);

        return {
            todayAppointments,
            totalPatients,
            completedAppointments,
        };
    }

    async getUserStats(userId: string) {
        const [appointments, notifications] = await Promise.all([
            this.prisma.appointment.count({ where: { userId } }),
            this.prisma.notification?.count({ where: { userId } }) || 0,
        ]);

        const uniqueDoctors = await this.prisma.appointment.groupBy({
            by: ['doctorId'],
            where: { userId },
        }).then(res => res.length);

        return {
            appointments,
            notifications,
            consultedDoctors: uniqueDoctors,
        };
    }
}

