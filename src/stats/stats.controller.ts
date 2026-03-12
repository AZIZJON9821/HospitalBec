import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('admin')
    @Roles(Role.ADMIN)
    getAdminStats() {
        return this.statsService.getAdminStats();
    }

    @Get('doctor')
    @Roles(Role.DOCTOR)
    getDoctorStats(@Request() req: any) {
        return this.statsService.getDoctorStats(req.user.id);
    }

    @Get('user')
    @Roles(Role.USER)
    getUserStats(@Request() req: any) {
        return this.statsService.getUserStats(req.user.id);
    }
}

