import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateDepartmentDto) {
        return this.prisma.department.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.department.findMany({
            include: {
                _count: {
                    select: { doctors: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const dept = await this.prisma.department.findUnique({
            where: { id },
            include: {
                doctors: {
                    include: {
                        user: {
                            select: { fullName: true, email: true },
                        },
                    },
                },
            },
        });
        if (!dept) throw new NotFoundException('Bo\'lim topilmadi');
        return dept;
    }

    async update(id: string, dto: UpdateDepartmentDto) {
        return this.prisma.department.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.department.delete({
            where: { id },
        });
    }
}
