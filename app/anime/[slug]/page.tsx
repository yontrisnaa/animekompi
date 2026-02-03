import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDetail } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EpisodeList } from '@/components/episode-list';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await getDetail(slug);
        const anime = response.data;

        return {
            title: `${anime.title} - Nonton Anime Sub Indo`,
            description: anime.synopsis || `Nonton ${anime.title} subtitle Indonesia terbaru. ${anime.info.genres.join(', ')}. Status: ${anime.info.status}.`,
            keywords: [
                anime.title,
                `nonton ${anime.title}`,
                `${anime.title} sub indo`,
                ...anime.info.genres,
                'anime subtitle indonesia',
            ],
            openGraph: {
                title: `${anime.title} - AnimeKompi`,
                description: anime.synopsis,
                images: [{ url: anime.thumbnail, width: 460, height: 650, alt: anime.title }],
                type: 'video.tv_show',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${anime.title} - AnimeKompi`,
                description: anime.synopsis,
                images: [anime.thumbnail],
            },
        };
    } catch {
        return {
            title: 'Anime Not Found',
        };
    }
}

async function DetailContent({ slug }: { slug: string }) {
    try {
        const response = await getDetail(slug);
        const anime = response.data;

        // JSON-LD Structured Data
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name: anime.title,
            description: anime.synopsis,
            image: anime.thumbnail,
            genre: anime.info.genres,
            numberOfEpisodes: anime.episodes.length,
            productionCompany: {
                '@type': 'Organization',
                name: anime.info.studio,
            },
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Mobile: Horizontal Card Layout */}
                        <div className="md:hidden mb-4">
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="relative w-28 h-40 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                                        <Image
                                            src={anime.thumbnail}
                                            alt={`${anime.title} - Nonton Anime Sub Indo`}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-white font-semibold">{anime.info.status}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Studio:</span>
                                            <span className="text-white font-semibold">{anime.info.studio}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Type:</span>
                                            <span className="text-white font-semibold">{anime.info.tipe}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Season:</span>
                                            <span className="text-white font-semibold">{anime.info.season}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: Sidebar */}
                        <div className="hidden md:block w-1/3 lg:w-1/4 flex-shrink-0">
                            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl mb-4">
                                <Image
                                    src={anime.thumbnail}
                                    alt={`${anime.title} - Nonton Anime Sub Indo`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <Card className="bg-slate-900 p-4 border-white/5 space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="text-white">{anime.info.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Studio:</span>
                                    <span className="text-white">{anime.info.studio}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span className="text-white">{anime.info.tipe}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Season:</span>
                                    <span className="text-white">{anime.info.season}</span>
                                </div>
                            </Card>
                        </div>

                        {/* Content - Shared between Mobile and Desktop */}
                        <div className="w-full md:w-2/3 lg:w-3/4">
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {anime.title}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {anime.info.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="bg-slate-800 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-500/20"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            <Card className="bg-black/20 p-6 border-white/5 mb-6">
                                <h2 className="text-lg font-bold text-white mb-2">Synopsis</h2>
                                <p className="text-gray-400 leading-relaxed">{anime.synopsis}</p>
                            </Card>

                            {/* Watch Latest Episode Button */}
                            {anime.episodes.length > 0 && (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold mb-8 w-full md:w-auto"
                                >
                                    <Link href={`/watch/${anime.episodes[0].slug}`} className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                        {anime.episodes[0].episode
                                            ? `Nonton Episode ${anime.episodes[0].episode}`
                                            : 'Nonton Episode Terbaru'}
                                    </Link>
                                </Button>
                            )}

                            {/* Episodes */}
                            <EpisodeList episodes={anime.episodes} />
                        </div>
                    </div>
                </div>
            </>
        );
    } catch (error) {
        notFound();
    }
}

function DetailLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 animate-pulse">
                <div className="w-full md:w-1/3 h-96 bg-slate-900 rounded-xl"></div>
                <div className="w-full md:w-2/3 space-y-4">
                    <div className="h-8 bg-slate-900 w-3/4 rounded"></div>
                    <div className="h-4 bg-slate-900 w-1/2 rounded"></div>
                    <div className="h-32 bg-slate-900 w-full rounded"></div>
                </div>
            </div>
        </div>
    );
}

export default async function DetailPage({ params }: Props) {
    const { slug } = await params;

    return (
        <Suspense fallback={<DetailLoading />}>
            <DetailContent slug={slug} />
        </Suspense>
    );
}
