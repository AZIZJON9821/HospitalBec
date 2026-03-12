import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Get('my')
    @Roles('DOCTOR')
    @ApiOperation({ summary: 'Shifokor o\'z ish grafigini ko\'rishi' })
    getMySchedule(@Request() req) {
        return this.schedulesService.getByDoctor(req.user.id);
    }

    @Post('my')
    @Roles('DOCTOR')
    @ApiOperation({ summary: 'Shifokor ish grafigini yangilashi' })
    updateMySchedule(@Request() req, @Body() schedules: any[]) {
        return this.schedulesService.updateSchedules(req.user.id, schedules);
    }
}
