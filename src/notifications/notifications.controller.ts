import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Foydalanuvchi bildirishnomalarini olish' })
    findAll(@Request() req) {
        return this.notificationsService.findAllForUser(req.user.id);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Bildirishnomani o\'qilgan deb belgilash' })
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }
}
