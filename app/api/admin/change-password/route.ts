import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, currentPassword, newPassword } = await request.json();

        const admin = await prisma.adminUser.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, admin.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.adminUser.update({
            where: { username },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
