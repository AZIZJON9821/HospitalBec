import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    async onApplicationBootstrap() {
        await this.seedSuperAdmin();
    }

    async seedSuperAdmin() {
        const phone = this.configService.get<string>('SUPER_ADMIN_PHONE');
        const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

        if (!phone || !password) {
            this.logger.warn('SUPER_ADMIN_PHONE yoki SUPER_ADMIN_PASSWORD topilmadi. Super admin yaratilmadi.');
            return;
        }

        try {
            this.logger.log('Super admin holatini tekshirish...');

            const hashedPassword = await bcrypt.hash(password, 10);
            const email = 'admin@shifoxona.uz'; // Default email for super admin

            // User says "delete and add again" (ochirib qaytadan qoshadigan bo'lsin)
            const existingUser = await this.prisma.user.findFirst({
                where: { phoneNumber: phone }
            });

            if (existingUser) {
                await this.prisma.user.delete({ where: { id: existingUser.id } });
                this.logger.log('Eski super admin o\'chirildi.');
            }

            await this.prisma.user.create({
                data: {
                    email,
                    fullName: 'Super Admin',
                    phoneNumber: phone,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });

            this.logger.log('Yangi super admin muvaffaqiyatli yaratildi.');
        } catch (error) {
            this.logger.error('Super admin yaratishda xatolik:', error.message);
        }
    }
}
