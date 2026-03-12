import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    async create(userId: string, dto: CreateAppointmentDto) {
        const { doctorId, appointmentDate, notes } = dto;
        const bookingDate = new Date(appointmentDate);

        // Prevent double booking for the same doctor at the same time
        const existingAppointment = await this.prisma.appointment.findFirst({
            where: {
                doctorId,
                appointmentDate: bookingDate,
                status: { notIn: ['CANCELLED', 'REJECTED'] },
            },
        });

        if (existingAppointment) {
            throw new ConflictException('Bu vaqt uchun shifokor allaqachon band. Iltimos boshqa vaqt tanlang.');
        }

        const appointment = await this.prisma.appointment.create({
            data: {
                userId,
                doctorId,
                appointmentDate: bookingDate,
                notes,
                status: 'PENDING',
            },
            include: {
                doctor: { include: { user: true } },
            },
        });

        // Notify doctor
        await this.notificationsService.create({
            userId: appointment.doctor.userId,
            title: 'Yangi qabul so\'rovi',
            message: `${appointmentDate} vaqtiga yangi qabul so\'rovi kelib tushdi.`,
        });

        return appointment;
    }

    async findAll(query?: any) {
        const { userId, doctorId, role } = query || {};
        return this.prisma.appointment.findMany({
            where: {
                ...(userId && { userId }),
                ...(doctorId && { doctorId }),
            },
            include: {
                user: { select: { fullName: true, phoneNumber: true } },
                doctor: {
                    include: {
                        user: { select: { fullName: true } },
                        department: true,
                    },
                },
            },
            orderBy: { appointmentDate: 'desc' },
        });
    }

    async updateStatus(id: string, userId: string, role: string, dto: UpdateAppointmentStatusDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { doctor: true },
        });

        if (!appointment) throw new NotFoundException('Qabul topilmadi');

        // Permissions check
        if (role === 'DOCTOR' && appointment.doctor.userId !== userId) {
            throw new ForbiddenException('Sizga bu qabulni boshqarish ruxsat etilmagan');
        }
        if (role === 'USER' && appointment.userId !== userId) {
            if (dto.status !== 'CANCELLED') {
                throw new ForbiddenException('Siz faqat o\'zingizning qabulingizni bekor qilishingiz mumkin');
            }
        }

        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: dto.status },
        });

        // Notify user about status change
        const statusLabels = {
            APPROVED: 'tasdiqlandi',
            REJECTED: 'rad etildi',
            CANCELLED: 'bekor qilindi',
            COMPLETED: 'yakunlandi',
        };

        await this.notificationsService.create({
            userId: appointment.userId,
            title: 'Qabul holati o\'zgardi',
            message: `Sizning ${appointment.appointmentDate.toLocaleString()} vaqtidagi qabulingiz ${statusLabels[dto.status]} sifatida belgilandi.`,
        });

        return updated;
    }
}
