import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Bu email manzili allaqachon ro\'yxatdan o\'tgan');
        }

        if (dto.password !== dto.confirmPassword) {
            throw new ConflictException('Parollar mos kelmadi. Iltimos, qaytadan tekshiring.'); // Updated error message
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                phoneNumber: dto.phoneNumber,
                role: 'USER',
            },
        });

        return this.generateToken(user);
    }

    async login(dto: LoginDto) {
        const { identifier, password } = dto;

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phoneNumber: identifier },
                ],
            },
        });

        if (!user) {
            throw new UnauthorizedException('Email, telefon raqami yoki parol noto\'g\'ri');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email, telefon raqami yoki parol noto\'g\'ri');
        }

        return this.generateToken(user);
    }

    private generateToken(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
}
