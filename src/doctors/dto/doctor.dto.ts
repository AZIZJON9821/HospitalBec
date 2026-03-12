import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    userId?: string;

    // Fields for creating a new user if userId is not provided
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsUUID()
    departmentId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Mutaxassislik kiritilishi shart' })
    specialization: string;

    @ApiProperty()
    @IsInt()
    experience: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    biography?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    workingHours?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class UpdateDoctorDto {
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    departmentId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    specialization?: string;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    experience?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    biography?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    workingHours?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
