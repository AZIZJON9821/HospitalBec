import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Departments
    const departmentsData = [
        { name: 'Kardiologiya', description: 'Yurak va qon tomir kasalliklari bo\'limi' },
        { name: 'Nevrologiya', description: 'Asab tizimi kasalliklari bo\'limi' },
        { name: 'Pediatriya', description: 'Bolalar salomatligi va kasalliklari' },
        { name: 'Terapevt', description: 'Umumiy amaliyot shifokori' },
        { name: 'Stomatologiya', description: 'Tish va og\'iz bo\'shlig\'i kasalliklari' },
        { name: 'Xirurgiya', description: 'Umumiy jarrohlik amaliyotlari' },
    ];

    console.log('Seeding departments...');
    const departments: any[] = [];
    for (const d of departmentsData) {
        const dept = await prisma.department.upsert({
            where: { name: d.name },
            update: {},
            create: d,
        });
        departments.push(dept);
    }

    // 2. Create Admin
    console.log('Seeding admin...');
    await prisma.user.upsert({
        where: { email: 'admin@shifoxona.uz' },
        update: {},
        create: {
            email: 'admin@shifoxona.uz',
            password: hashedPassword,
            fullName: 'Asosiy Administrator',
            phoneNumber: '+998901234567',
            role: Role.ADMIN,
        },
    });

    // 3. Create Doctors
    const doctorsData = [
        {
            fullName: 'Dr. Abror Alimov',
            email: 'abror@shifoxona.uz',
            specialization: 'Kardiolog-Xirurg',
            experience: 15,
            imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
            deptIndex: 0 // Kardiologiya
        },
        {
            fullName: 'Dr. Nigora Sobirova',
            email: 'nigora@shifoxona.uz',
            specialization: 'Bolalar Nevrologi',
            experience: 10,
            imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop',
            deptIndex: 1 // Nevrologiya
        },
        {
            fullName: 'Dr. Jasur Karimov',
            email: 'jasur@shifoxona.uz',
            specialization: 'Oliy toifali Pediatar',
            experience: 12,
            imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
            deptIndex: 2 // Pediatriya
        },
        {
            fullName: 'Dr. Malika Axmedova',
            email: 'malika@shifoxona.uz',
            specialization: 'Terapevt-Dietolog',
            experience: 8,
            imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=400&auto=format&fit=crop',
            deptIndex: 3 // Terapevt
        },
        {
            fullName: 'Dr. Dilshod Tursunov',
            email: 'dilshod@shifoxona.uz',
            specialization: 'Stomatolog-Ortoped',
            experience: 7,
            imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
            deptIndex: 4 // Stomatologiya
        }
    ];

    console.log('Seeding doctors...');
    for (const d of doctorsData) {
        const user = await prisma.user.upsert({
            where: { email: d.email },
            update: {},
            create: {
                email: d.email,
                password: hashedPassword,
                fullName: d.fullName,
                phoneNumber: `+9989${Math.floor(Math.random() * 90000000 + 10000000)}`,
                role: Role.DOCTOR,
            },
        });

        await prisma.doctor.upsert({
            where: { userId: user.id },
            update: {
                imageUrl: d.imageUrl,
                specialization: d.specialization,
                experience: d.experience,
                departmentId: departments[d.deptIndex].id,
            },
            create: {
                userId: user.id,
                departmentId: departments[d.deptIndex].id,
                specialization: d.specialization,
                experience: d.experience,
                imageUrl: d.imageUrl,
                biography: `${d.fullName} o'z sohasining malakali mutaxassisi bo'lib, ko'p yillik tajribaga ega.`,
            },
        });
    }

    // 4. Create Regular Users
    console.log('Seeding patients...');
    const patients = ['Anvar G\'ofurov', 'Zilola Mirzaeva', 'Rustam Voxidov'];
    for (let i = 0; i < patients.length; i++) {
        await prisma.user.upsert({
            where: { email: `patient${i + 1}@gmail.com` },
            update: {},
            create: {
                email: `patient${i + 1}@gmail.com`,
                password: hashedPassword,
                fullName: patients[i],
                phoneNumber: `+9989${Math.floor(Math.random() * 90000000 + 10000000)}`,
                role: Role.USER,
            },
        });
    }

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

