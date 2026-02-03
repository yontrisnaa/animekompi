'use client';

import { useState, useEffect, useRef } from 'react';
import { getHome } from '@/lib/api';
import { AnimeCard } from '@/components/anime-card';
import type { AnimeItem } from '@/lib/types';

interface InfiniteAnimeGridProps {
    initialAnime: AnimeItem[];
    initialPage: number;
}

export function InfiniteAnimeGrid({ initialAnime, initialPage }: InfiniteAnimeGridProps) {
    const [animeList, setAnimeList] = useState<AnimeItem[]>(initialAnime);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page]);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await getHome(nextPage);
            const newAnime = response.data.anime;

            if (newAnime.length === 0 || nextPage >= response.data.total_pages) {
                setHasMore(false);
            } else {
                // Deduplicate: filter out anime that already exist
                setAnimeList((prev) => {
                    const existingSlugs = new Set(prev.map(a => a.slug));
                    const uniqueNewAnime = newAnime.filter(a => !existingSlugs.has(a.slug));

                    // If no new unique anime, stop loading more
                    if (uniqueNewAnime.length === 0) {
                        setHasMore(false);
                        return prev;
                    }

                    return [...prev, ...uniqueNewAnime];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Failed to load more:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {animeList.map((anime, index) => (
                    <AnimeCard key={`${anime.slug}-${index}`} anime={anime} />
                ))}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl" />
                    ))}
                </div>
            )}

            {/* Intersection observer target */}
            <div ref={observerRef} className="h-20 flex items-center justify-center">
                {!hasMore && animeList.length > 0 && (
                    <p className="text-gray-500 text-sm">No more anime to load</p>
                )}
            </div>
        </>
    );
}
