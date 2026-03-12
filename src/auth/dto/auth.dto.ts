import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email manzili noto\'g\'ri' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Ism-familiya kiritilishi shart' })
    fullName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
    phoneNumber: string;

    @ApiProperty()
    @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Parolni tasdiqlash shart' })
    confirmPassword: string;
}

export class LoginDto {
    @ApiProperty({ example: 'admin@shifoxona.uz yoki +998901234567' })
    @IsNotEmpty({ message: 'Email yoki telefon raqami kiritilishi shart' })
    @IsString()
    identifier: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Parol kiritilishi shart' })
    @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
    password: string;
}
