import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish (Admin)' })
    findAll(@Query('role') role?: string) {
        return this.usersService.findAll(role);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Foydalanuvchi haqida ma\'lumot olish' })
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Foydalanuvchini o\'chirish (Admin)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
