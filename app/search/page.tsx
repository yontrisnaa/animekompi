import { Suspense } from 'react';
import { search } from '@/lib/api';
import { InfiniteSearchGrid } from '@/components/infinite-search-grid';

async function SearchContent({ query }: { query: string }) {
    if (!query) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-gray-400">
                Please enter a search term.
            </div>
        );
    }

    const response = await search(query);
    const results = response.data.anime;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">
                Search Results for: <span className="text-blue-400">&quot;{query}&quot;</span>
            </h1>

            {results.length > 0 ? (
                <InfiniteSearchGrid initialAnime={results} initialPage={1} query={query} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p className="text-lg">No results found.</p>
                </div>
            )}
        </div>
    );
}

function SearchLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-64 bg-slate-900 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;

    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchContent query={q || ''} />
        </Suspense>
    );
}
