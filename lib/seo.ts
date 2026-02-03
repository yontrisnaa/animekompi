import { prisma } from '@/lib/prisma';

export async function getSeoSettings() {
    try {
        let settings = await prisma.seoSettings.findFirst();

        if (!settings) {
            settings = await prisma.seoSettings.create({
                data: {},
            });
        }

        return settings;
    } catch (error) {
        console.error('Failed to fetch SEO settings:', error);
        return null;
    }
}
