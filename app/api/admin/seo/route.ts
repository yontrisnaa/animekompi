import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.seoSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.seoSettings.create({
                data: {},
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Get or create settings
        let settings = await prisma.seoSettings.findFirst();

        if (!settings) {
            settings = await prisma.seoSettings.create({
                data: body,
            });
        } else {
            settings = await prisma.seoSettings.update({
                where: { id: settings.id },
                data: body,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
