import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Initialize default admin user
export async function GET() {
    try {
        const adminCount = await prisma.adminUser.count();

        if (adminCount === 0) {
            // Create default admin user: admin / admin123
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.adminUser.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                },
            });

            return NextResponse.json({
                message: 'Default admin created',
                username: 'admin',
                password: 'admin123',
                warning: 'Please change the password immediately!'
            });
        }

        return NextResponse.json({ message: 'Admin already exists' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to initialize' }, { status: 500 });
    }
}
