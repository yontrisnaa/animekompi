/**
 * Extract anime slug from episode slug
 * Example: "one-piece-episode-1120-subtitle-indonesia" -> "one-piece"
 */
export function getAnimeSlugFromEpisode(episodeSlug: string): string {
    // Remove common episode patterns
    const patterns = [
        /-episode-\d+.*$/i,
        /-ep-\d+.*$/i,
        /-\d+.*$/,
    ];

    let animeSlug = episodeSlug;
    for (const pattern of patterns) {
        const match = animeSlug.match(pattern);
        if (match) {
            animeSlug = animeSlug.replace(pattern, '');
            break;
        }
    }

    return animeSlug;
}

/**
 * Get episode number from slug
 * Example: "one-piece-episode-1120-subtitle-indonesia" -> "1120"
 */
export function getEpisodeNumber(episodeSlug: string): string | null {
    const patterns = [
        /episode-(\d+)/i,
        /ep-(\d+)/i,
        /-(\d+)-/,
    ];

    for (const pattern of patterns) {
        const match = episodeSlug.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Check if slug is an episode slug
 * Example: "one-piece-episode-1120-subtitle-indonesia" -> true
 */
export function isEpisodeSlug(slug: string): boolean {
    return /episode-\d+|ep-\d+/i.test(slug);
}
