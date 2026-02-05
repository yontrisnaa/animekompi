export interface AnimeItem {
    slug: string;
    title: string;
    thumbnail?: string;
    image?: string;
    type: string;
    latest_episode: string;
    episode?: string;
    release_time?: string;
}

export interface HomeResponse {
    status: string;
    data: {
        page: number;
        total_pages: number;
        anime: AnimeItem[];
    };
}

export interface AnimeDetail {
    title: string;
    thumbnail: string;
    synopsis: string;
    info: {
        status: string;
        studio: string;
        dirilis: string;
        durasi: string;
        season: string;
        tipe: string;
        censor: string;
        diposting_oleh: string;
        diperbarui_pada: string;
        genres: string[];
    };
    episodes: Array<{
        slug: string;
        episode: string;
        title: string;
        date: string;
    }>;
}

export interface DetailResponse {
    status: string;
    data: AnimeDetail;
}

export interface StreamingServer {
    name: string;
    type: string;
    url: string;
}

export interface DownloadLink {
    quality: string;
    links: Array<{
        provider: string;
        url: string;
    }>;
}

export interface WatchResponse {
    status: string;
    data: {
        title: string;
        streaming_servers: StreamingServer[];
        download_links: DownloadLink[];
    };
}

export interface ScheduleResponse {
    status: string;
    data: {
        [day: string]: AnimeItem[];
    };
}

export interface SearchResponse {
    status: string;
    data: {
        page: number;
        total_pages: number;
        anime: AnimeItem[];
        query?: string;
    };
}

export interface BatchResponse {
    status: string;
    data: {
        page: number;
        total_pages: number;
        anime: AnimeItem[];
    };
}
