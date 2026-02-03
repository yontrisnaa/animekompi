import { Suspense } from 'react';
import { getBatch } from '@/lib/api';
import { InfiniteBatchGrid } from '@/components/infinite-batch-grid';

async function BatchContent() {
    const response = await getBatch(1);
    const results = response.data.anime;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8 border-b-2 border-white/10 pb-4">
                Completed / Batch
            </h1>

            {results.length > 0 ? (
                <InfiniteBatchGrid initialAnime={results} initialPage={1} />
            ) : (
                <div className="text-center text-gray-500">No batches found.</div>
            )}
        </div>
    );
}

function BatchLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-48 bg-slate-900 rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function BatchPage() {
    return (
        <Suspense fallback={<BatchLoading />}>
            <BatchContent />
        </Suspense>
    );
}
