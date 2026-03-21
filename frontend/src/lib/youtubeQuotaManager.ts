// YouTube API Quota Manager
// This module implements strategies to reduce YouTube API quota usage

// Quota exceeded state tracking
const QUOTA_EXCEEDED_KEY = 'youtube_quota_exceeded_timestamp';
const QUOTA_BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Response caching - Increase cache duration to reduce API calls
const CACHE_KEY_PREFIX = 'youtube_cache_';
const CACHE_TTL = 2 * 60 * 60 * 1000; // Increase from 1 hour to 2 hours

// User refresh cooldown - Reduce cooldown to allow more frequent requests
const REFRESH_COOLDOWN_KEY = 'youtube_last_refresh';
const REFRESH_COOLDOWN_DURATION = 5 * 60 * 1000; // Reduce from 15 to 5 minutes

// Fallback content for quota exceeded state
// Using actual health videos from trusted sources as fallback
const FALLBACK_VIDEOS = [
  {
    id: "xC5CAlCl_6I",
    title: "Understanding Heart Disease - American Heart Association",
    description: "Learn about heart disease prevention and maintaining cardiovascular health.",
    thumbnailUrl: "https://img.youtube.com/vi/xC5CAlCl_6I/default.jpg",
    channelTitle: "American Heart Association",
    publishedAt: new Date().toISOString(),
    viewCount: "1500000"
  },
  {
    id: "8oYV2qCOs8E",
    title: "Nutrition Basics for Better Health - WHO",
    description: "Essential nutrition guidelines from the World Health Organization.",
    thumbnailUrl: "https://img.youtube.com/vi/8oYV2qCOs8E/default.jpg",
    channelTitle: "World Health Organization",
    publishedAt: new Date().toISOString(),
    viewCount: "2100000"
  },
  {
    id: "b8b8V07FJ4M",
    title: "Mental Health Awareness - CDC",
    description: "Understanding mental health and resources for support.",
    thumbnailUrl: "https://img.youtube.com/vi/b8b8V07FJ4M/default.jpg",
    channelTitle: "Centers for Disease Control and Prevention",
    publishedAt: new Date().toISOString(),
    viewCount: "850000"
  },
  {
    id: "Z35G2W69X20",
    title: "Exercise and Physical Activity - NIH",
    description: "Benefits of regular physical activity for all ages.",
    thumbnailUrl: "https://img.youtube.com/vi/Z35G2W69X20/default.jpg",
    channelTitle: "National Institutes of Health",
    publishedAt: new Date().toISOString(),
    viewCount: "1200000"
  },
  {
    id: "rDZ6Qk4Q75k",
    title: "Preventive Healthcare - Mayo Clinic",
    description: "Importance of preventive care and regular health screenings.",
    thumbnailUrl: "https://img.youtube.com/vi/rDZ6Qk4Q75k/default.jpg",
    channelTitle: "Mayo Clinic",
    publishedAt: new Date().toISOString(),
    viewCount: "1800000"
  },
  {
    id: "PQ3GDOCK9IU",
    title: "Understanding Diabetes - CDC",
    description: "Learn about diabetes types, symptoms, and management.",
    thumbnailUrl: "https://img.youtube.com/vi/PQ3GDOCK9IU/default.jpg",
    channelTitle: "Centers for Disease Control and Prevention",
    publishedAt: new Date().toISOString(),
    viewCount: "950000"
  },
  {
    id: "l56635P3k4w",
    title: "Healthy Eating Patterns - USDA",
    description: "Guidance on building healthy eating patterns for all ages.",
    thumbnailUrl: "https://img.youtube.com/vi/l56635P3k4w/default.jpg",
    channelTitle: "U.S. Department of Agriculture",
    publishedAt: new Date().toISOString(),
    viewCount: "750000"
  },
  {
    id: "9d2WFEl3j8I",
    title: "Sleep and Health - Sleep Foundation",
    description: "Understanding the importance of sleep for overall health.",
    thumbnailUrl: "https://img.youtube.com/vi/9d2WFEl3j8I/default.jpg",
    channelTitle: "Sleep Foundation",
    publishedAt: new Date().toISOString(),
    viewCount: "650000"
  }
];

/**
 * Check if YouTube API quota has been exceeded recently
 * @returns boolean indicating if quota is currently blocked
 */
export function isQuotaExceeded(): boolean {
  const quotaExceededTimestamp = localStorage.getItem(QUOTA_EXCEEDED_KEY);
  if (!quotaExceededTimestamp) return false;
  
  const exceededTime = parseInt(quotaExceededTimestamp, 10);
  const currentTime = Date.now();
  
  // If quota was exceeded within the last 24 hours, block requests
  if (currentTime - exceededTime < QUOTA_BLOCK_DURATION) {
    return true;
  }
  
  // Clear the quota exceeded state if it's older than 24 hours
  localStorage.removeItem(QUOTA_EXCEEDED_KEY);
  return false;
}

/**
 * Record that YouTube API quota has been exceeded
 */
export function recordQuotaExceeded(): void {
  localStorage.setItem(QUOTA_EXCEEDED_KEY, Date.now().toString());
}

/**
 * Get cached response for a given key
 * @param cacheKey - Key to look up in cache
 * @returns Cached data or null if not found or expired
 */
export function getCachedResponse(cacheKey: string): any {
  const cachedData = localStorage.getItem(`${CACHE_KEY_PREFIX}${cacheKey}`);
  if (!cachedData) return null;
  
  try {
    const parsed = JSON.parse(cachedData);
    const currentTime = Date.now();
    
    // Check if cache is still valid
    if (currentTime - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    } else {
      // Remove expired cache entry
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${cacheKey}`);
      return null;
    }
  } catch (error) {
    // Remove invalid cache entry
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${cacheKey}`);
    return null;
  }
}

/**
 * Cache response data
 * @param cacheKey - Key to store data under
 * @param data - Data to cache
 */
export function cacheResponse(cacheKey: string, data: any): void {
  const cacheEntry = {
    timestamp: Date.now(),
    data: data
  };
  
  try {
    localStorage.setItem(`${CACHE_KEY_PREFIX}${cacheKey}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Failed to cache YouTube API response:', error);
  }
}

/**
 * Check if user is in refresh cooldown period
 * @returns boolean indicating if user should be blocked from refreshing
 */
export function isInRefreshCooldown(): boolean {
  const lastRefresh = localStorage.getItem(REFRESH_COOLDOWN_KEY);
  if (!lastRefresh) return false;
  
  const lastRefreshTime = parseInt(lastRefresh, 10);
  const currentTime = Date.now();
  
  return currentTime - lastRefreshTime < REFRESH_COOLDOWN_DURATION;
}

/**
 * Record a refresh action to enforce cooldown
 */
export function recordRefresh(): void {
  localStorage.setItem(REFRESH_COOLDOWN_KEY, Date.now().toString());
}

/**
 * Get fallback content when quota is exceeded or API fails
 * @returns Pre-approved fallback videos
 */
export function getFallbackContent(): any[] {
  // First, try to get cached content from recent successful API calls
  const cachedVideos = getAllCachedVideos();
  if (cachedVideos.length > 0) {
    // Return up to 24 cached videos
    return cachedVideos.slice(0, 24);
  }
  
  // Return fallback videos if no cached content is available
  return FALLBACK_VIDEOS;
}

/**
 * Get all cached videos from localStorage
 * @returns Array of cached videos
 */
function getAllCachedVideos(): any[] {
  const cachedVideos: any[] = [];
  
  // Iterate through all localStorage items to find cached YouTube responses
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      try {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if this is a valid YouTube API response with videos
          if (parsed.data && parsed.data.videos && Array.isArray(parsed.data.videos)) {
            cachedVideos.push(...parsed.data.videos);
          }
        }
      } catch (error) {
        console.warn('Error parsing cached data:', error);
      }
    }
  }
  
  // Return unique videos (deduplicate by ID)
  const uniqueVideos = cachedVideos.filter((video, index, self) => 
    index === self.findIndex(v => v.id === video.id)
  );
  
  return uniqueVideos;
}

/**
 * Generate a cache key for a given set of parameters
 * @param functionName - Name of the function being called
 * @param params - Parameters used in the function call
 * @returns String cache key
 */
export function generateCacheKey(functionName: string, params: any): string {
  // Create a consistent cache key by stringifying parameters
  const paramStr = JSON.stringify(params, Object.keys(params).sort());
  return `${functionName}_${btoa(paramStr).replace(/[+/=]/g, '')}`;
}