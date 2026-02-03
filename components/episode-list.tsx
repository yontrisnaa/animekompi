'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Episode {
    slug: string;
    episode: string;
    title: string;
    date: string;
}

interface EpisodeListProps {
    episodes: Episode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Safety check for episodes
    if (!episodes || episodes.length === 0) {
        return (
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Episodes (0)
                </h3>
                <p className="text-gray-500">No episodes found.</p>
            </div>
        );
    }

    // Filter episodes based on search query
    const filteredEpisodes = episodes.filter(ep =>
        (ep.episode?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (ep.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );


    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Episodes ({episodes.length})
                </h3>

                {/* Episode Search */}
                <div className="relative w-48">
                    <Input
                        type="text"
                        placeholder="Search episode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/20 border-white/10 rounded-full py-1.5 px-4 pl-10 text-sm focus:border-blue-500 text-white placeholder-gray-500"
                    />
                    <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
                </div>
            </div>

            {filteredEpisodes.length === 0 ? (
                <p className="text-gray-500">No episodes found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-1">
                    {filteredEpisodes.map((ep) => (
                        <Button
                            key={ep.slug}
                            asChild
                            variant="secondary"
                            className="bg-slate-900 hover:bg-blue-900 border border-white/5 hover:border-blue-500/50 transition-all h-auto flex-col items-start p-3"
                        >
                            <Link href={`/watch/${ep.slug}`}>
                                <span className="text-gray-400 text-xs text-left mb-1">{ep.date}</span>
                                <span className="text-white font-bold">Episode {ep.episode}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
