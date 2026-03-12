import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    appointmentDate: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateAppointmentStatusDto {
    @ApiProperty({ enum: AppointmentStatus })
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
