import { Suspense } from 'react';
import { getSchedule } from '@/lib/api';
import { AnimeCard } from '@/components/anime-card';

async function ScheduleContent() {
    const response = await getSchedule();
    const scheduleData = response.data;

    // Day mapping for sorting
    const dayOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Get current day in Indonesian
    const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Sort days starting from current day
    const sortedDays = Object.entries(scheduleData).sort(([dayA], [dayB]) => {
        const indexA = dayOrder.indexOf(dayA);
        const indexB = dayOrder.indexOf(dayB);

        // Calculate offset from current day
        const offsetA = (indexA - currentDayIndex + 7) % 7;
        const offsetB = (indexB - currentDayIndex + 7) % 7;

        return offsetA - offsetB;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-8">
                Weekly Schedule
            </h1>

            <div className="space-y-8">
                {sortedDays.map(([day, animeList]) => {
                    if (!animeList || animeList.length === 0) return null;

                    // Remove duplicates based on slug
                    const uniqueAnime = Array.from(
                        new Map(animeList.map(anime => [anime.slug, anime])).values()
                    );

                    // Check if this is today
                    const isToday = dayOrder[currentDayIndex] === day;

                    return (
                        <div key={day}>
                            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                                {day}
                                {isToday && (
                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Today</span>
                                )}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {uniqueAnime.map((anime, index) => (
                                    <AnimeCard key={`${day}-${anime.slug}-${index}`} anime={anime} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ScheduleLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-48 bg-slate-900 rounded mb-8 animate-pulse" />
            <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                        <div className="h-6 w-32 bg-slate-900 rounded mb-4 animate-pulse" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="aspect-[3/4] bg-slate-900 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SchedulePage() {
    return (
        <Suspense fallback={<ScheduleLoading />}>
            <ScheduleContent />
        </Suspense>
    );
}
