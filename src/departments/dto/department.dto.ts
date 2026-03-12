import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Bo\'lim nomi bo\'sh bo\'lmasligi kerak' })
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateDepartmentDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
