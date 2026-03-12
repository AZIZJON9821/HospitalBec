import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('doctors')
@ApiBearerAuth()
@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Shifokor profilini yaratish (Faqat Admin)' })
    create(@Body() createDoctorDto: CreateDoctorDto) {
        return this.doctorsService.create(createDoctorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Barcha shifokorlarni olish' })
    @ApiQuery({ name: 'departmentId', required: false })
    @ApiQuery({ name: 'search', required: false })
    findAll(@Query('departmentId') departmentId?: string, @Query('search') search?: string) {
        return this.doctorsService.findAll({ departmentId, search });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Shifokor haqida to\'liq ma\'lumot olish' })
    findOne(@Param('id') id: string) {
        return this.doctorsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DOCTOR')
    @ApiOperation({ summary: 'Shifokor ma\'lumotlarini tahrirlash' })
    update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
        return this.doctorsService.update(id, updateDoctorDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Shifokor profilini o\'chirish (Faqat Admin)' })
    remove(@Param('id') id: string) {
        return this.doctorsService.remove(id);
    }
}
