'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { AnimeItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { isEpisodeSlug } from '@/lib/utils-episode';

interface HeroSliderProps {
    animeList: AnimeItem[];
}

export function HeroSlider({ animeList }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animeList.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [animeList.length]);

    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="relative w-full h-64 md:h-[500px] overflow-hidden group">
            {/* Slides */}
            {animeList.map((anime, index) => {
                const img = anime.thumbnail || anime.image || '';
                // Smart routing: detect if it's an episode or anime series
                const isEpisode = isEpisodeSlug(anime.slug);
                const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

                return (
                    <Link
                        key={anime.slug}
                        href={href}
                        className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="absolute inset-0 bg-cover bg-center">
                            <Image
                                src={img}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-16 flex flex-col items-start gap-4">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                                Trending
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl drop-shadow-lg line-clamp-2">
                                {anime.title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                <span>{anime.type}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>{anime.latest_episode || 'Ongoing'}</span>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    {isEpisode ? 'Watch Now' : 'View Details'}
                                </Button>
                                {!isEpisode && (
                                    <Button
                                        variant="secondary"
                                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Details
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}

            {/* Indicators */}
            <div className="absolute bottom-6 right-6 md:right-12 flex gap-2 z-20">
                {animeList.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentIndex(index);
                        }}
                        className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 w-6 md:w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
