import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getHome } from '@/lib/api';
import { HeroSlider } from '@/components/hero-slider';
import { InfiniteAnimeGrid } from '@/components/infinite-anime-grid';

export const metadata: Metadata = {
  title: 'Nonton Anime Subtitle Indonesia Terbaru',
  description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD. Nonton anime ongoing, completed, dan download batch gratis.',
  openGraph: {
    title: 'AnimeKompi - Nonton Anime Subtitle Indonesia Terbaru',
    description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD.',
    url: 'https://animekompi.fun',
    type: 'website',
  },
};

async function HomeContent() {
  const data = await getHome(1);
  const animeList = data.data.anime;
  const trending = animeList.slice(0, 5);

  return (
    <>
      {/* Hero Section */}
      <section className="mb-8">
        <HeroSlider animeList={trending} />
      </section>

      {/* Latest Updates */}
      <section className="container mx-auto px-4 mb-12">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          Latest Anime Updates - Subtitle Indonesia
        </h1>
        <InfiniteAnimeGrid initialAnime={animeList} initialPage={1} />
      </section>
    </>
  );
}

function HomeLoading() {
  return (
    <>
      <div className="h-64 md:h-[500px] bg-slate-900 animate-pulse" />
      <section className="container mx-auto px-4 mb-12 mt-8">
        <div className="h-8 w-48 bg-slate-900 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-900 animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
