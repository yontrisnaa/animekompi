import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { AnimeItem } from '@/lib/types';

interface AnimeCardProps {
    anime: AnimeItem;
}

export function AnimeCard({ anime }: AnimeCardProps) {
    const image = anime.thumbnail || anime.image || '/placeholder.png';

    // Detect if this is an episode (contains "episode" or "ep" in slug or title)
    const isEpisode = anime.slug.includes('episode') || anime.slug.includes('ep-');
    const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

    return (
        <Link
            href={href}
            className="group block relative overflow-hidden rounded-xl bg-slate-900 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="aspect-[3/4] w-full overflow-hidden relative">
                <Image
                    src={image}
                    alt={anime.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {anime.type}
                </div>

                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Play className="w-3 h-3 text-cyan-400" />
                    {anime.latest_episode || anime.episode || '?'}
                </div>
            </div>

            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {anime.title}
                </h3>
            </div>
        </Link>
    );
}
