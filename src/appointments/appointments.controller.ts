import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Yangi qabul yozilishi' })
    create(@Request() req, @Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.create(req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Qabullar ro\'yxatini olish (rolga qarab)' })
    findAll(@Request() req) {
        const { id, role } = req.user;
        if (role === 'ADMIN') return this.appointmentsService.findAll();
        if (role === 'DOCTOR') return this.appointmentsService.findAll({ doctorUserId: id });
        return this.appointmentsService.findAll({ userId: id });
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Qabul holatini o\'zgartirish (tasdiqlash/rad etish/bekor qilish)' })
    updateStatus(@Param('id') id: string, @Request() req, @Body() dto: UpdateAppointmentStatusDto) {
        return this.appointmentsService.updateStatus(id, req.user.id, req.user.role, dto);
    }
}
