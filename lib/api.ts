import type {
    HomeResponse,
    DetailResponse,
    WatchResponse,
    ScheduleResponse,
    SearchResponse,
    BatchResponse,
} from './types';

const BASE_URL = 'https://zeldvorik.ru/animekompi/endpoints';

async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

export async function getHome(page: number = 1): Promise<HomeResponse> {
    return fetchAPI<HomeResponse>('/home.php', { page: page.toString() });
}

export async function getDetail(slug: string): Promise<DetailResponse> {
    return fetchAPI<DetailResponse>('/detail.php', { slug });
}

export async function getWatch(slug: string): Promise<WatchResponse> {
    return fetchAPI<WatchResponse>('/watch.php', { slug });
}

export async function getSchedule(): Promise<ScheduleResponse> {
    return fetchAPI<ScheduleResponse>('/schedule.php');
}

export async function search(query: string, page: number = 1): Promise<SearchResponse> {
    return fetchAPI<SearchResponse>('/search.php', { q: query, page: page.toString() });
}

export async function getBatch(page: number = 1): Promise<BatchResponse> {
    return fetchAPI<BatchResponse>('/batch.php', { page: page.toString() });
}
