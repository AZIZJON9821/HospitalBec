import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateDoctorDto) {
        let userId = dto.userId;

        if (!userId) {
            // Create a new user if details are provided
            const hashedPassword = await bcrypt.hash(dto.password || 'doctor123', 10);
            const user = await this.prisma.user.create({
                data: {
                    fullName: dto.fullName!,
                    email: dto.email!,
                    phoneNumber: dto.phoneNumber!,
                    password: hashedPassword,
                    role: 'DOCTOR',
                },
            });
            userId = user.id;
        } else {
            // Update existing user role to DOCTOR
            await this.prisma.user.update({
                where: { id: userId },
                data: { role: 'DOCTOR' },
            });
        }

        return this.prisma.doctor.create({
            data: {
                userId,
                departmentId: dto.departmentId,
                specialization: dto.specialization,
                experience: dto.experience,
                biography: dto.biography,
                workingHours: dto.workingHours,
                imageUrl: dto.imageUrl,
            },
        });
    }

    async findAll(filters: { departmentId?: string; search?: string }) {
        const { departmentId, search } = filters;
        const doctors = await this.prisma.doctor.findMany({
            where: {
                AND: [
                    departmentId ? { departmentId } : {},
                    search ? {
                        user: {
                            fullName: { contains: search, mode: 'insensitive' }
                        }
                    } : {},
                ],
            },
            include: {
                user: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
                department: true,
            },
            orderBy: { user: { fullName: 'asc' } }
        });
        return doctors;
    }

    async findOne(id: string) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                user: {
                    select: { fullName: true, email: true, phoneNumber: true },
                },
                department: true,
                reviews: {
                    include: {
                        user: { select: { fullName: true } },
                    },
                },
            },
        });
        if (!doctor) throw new NotFoundException('Shifokor topilmadi');
        return doctor;
    }

    async update(id: string, dto: UpdateDoctorDto) {
        return this.prisma.doctor.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.doctor.delete({
            where: { id },
        });
    }
}
