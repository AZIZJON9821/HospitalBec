import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@shifoxona.uz' },
        update: {},
        create: {
            email: 'admin@shifoxona.uz',
            password: hashedPassword,
            fullName: 'Asosiy Admin',
            phoneNumber: '+998901234567',
            role: 'ADMIN',
        },
    });

    // 2. Create Departments
    const departments = [
        { name: 'Kardiologiya', description: 'Yurak va qon tomir kasalliklari' },
        { name: 'Nevrologiya', description: 'Asab tizimi kasalliklari' },
        { name: 'Stomatologiya', description: 'Tish va milq kasalliklari' },
        { name: 'Pediatriya', description: 'Bolalar kasalliklari' },
        { name: 'Dermatologiya', description: 'Teri kasalliklari' },
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept,
        });
    }

    const depts = await prisma.department.findMany();

    // 3. Create Sample Doctors
    const doctorPasswords = await bcrypt.hash('doctor123', 10);
    const sampleDoctors = [
        {
            email: 'ali@shifoxona.uz',
            fullName: 'Ali Valiyev',
            specialization: 'Kardiolog',
            deptName: 'Kardiologiya',
        },
        {
            email: 'zofiya@shifoxona.uz',
            fullName: 'Zofiya Karimova',
            specialization: 'Nevrolog',
            deptName: 'Nevrologiya',
        },
    ];

    for (const doc of sampleDoctors) {
        const user = await prisma.user.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                email: doc.email,
                password: doctorPasswords,
                fullName: doc.fullName,
                phoneNumber: '+998911112233',
                role: 'DOCTOR',
            },
        });

        const dept = depts.find((d) => d.name === doc.deptName);
        if (dept) {
            await prisma.doctor.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    departmentId: dept.id,
                    specialization: doc.specialization,
                    experience: 5,
                    biography: 'Tajribali shifokor',
                },
            });
        }
    }

    console.log('Seed data successfully created!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
