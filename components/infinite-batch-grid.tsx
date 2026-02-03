'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimeCard } from '@/components/anime-card';
import { getBatch } from '@/lib/api';
import type { AnimeItem } from '@/lib/types';

interface InfiniteBatchGridProps {
    initialAnime: AnimeItem[];
    initialPage: number;
}

export function InfiniteBatchGrid({ initialAnime, initialPage }: InfiniteBatchGridProps) {
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
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await getBatch(nextPage);
            const newAnime = response.data.anime;

            if (newAnime.length === 0) {
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
            console.error('Failed to load more anime:', error);
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
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Observer target */}
            {hasMore && !loading && <div ref={observerRef} className="h-20" />}

            {/* No more content */}
            {!hasMore && (
                <div className="text-center py-8 text-gray-500">
                    No more batch anime to load
                </div>
            )}
        </>
    );
}
