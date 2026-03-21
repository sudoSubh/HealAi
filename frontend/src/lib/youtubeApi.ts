export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
}

export interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: {
        url: string;
      };
      default?: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubeVideoDetailsItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: {
        url: string;
      };
      default?: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount?: string;
  };
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  prevPageToken?: string;
}

export interface YouTubeVideoDetailsResponse {
  items: YouTubeVideoDetailsItem[];
}

export interface YouTubeApiResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  error?: string; // Add optional error property
  quotaExceeded?: boolean; // Add quota exceeded flag
}

// YouTube API key from environment variables
const API_KEY = (import.meta.env as any).VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// API key status logging removed for security

// Add a function to test the API key
export async function testApiKey(): Promise<boolean> {
  try {
    const testUrl = `${BASE_URL}/videos?part=id&id=VIDEO_ID&key=${API_KEY}`;
    // We won't actually make a request, just check if key is present
    return !!API_KEY;
  } catch (error) {
    console.error("API key test failed:", error);
    return false;
  }
}

// Import quota management utilities
import { 
  isQuotaExceeded, 
  recordQuotaExceeded, 
  getCachedResponse, 
  cacheResponse, 
  getFallbackContent,
  generateCacheKey
} from './youtubeQuotaManager';

// Official government and reputable health channels
const HEALTH_CHANNELS = [
  // International health organizations
  'UCzJ376eCNQQd2gXFu8q3PCA', // CDC
  'UCJ014fTUtYV9TAZsFH7CI9A', // WHO
  'UCQzd3SL6D0AX1l9AhlS8apw', // NIH
  'UCDlQwclD38pEyXH6UyXKa4w', // NHS
  'UCSFH9dUoZ4Rv3RZUHmW4MPw', // Healthline
  'UCZn16tbQ7TOKyRzrz24H7jw', // Medical News Today
  'UCzQUP1qoWDoEbmsQ4_Yi7pA', // Mayo Clinic
  'UCzUPzt5iM3jD48bvu8YAUVw', // Cleveland Clinic
  'UCzgD1waL9E9g9w0bZ2d2dZw', // Johns Hopkins Medicine
  'UCzjD1waL9E9g9w0bZ2d2dZw', // Harvard Health
  
  // Indian government health channels
  'UCsyPEi8BS07G8ZPXmpzIZrg', // Ministry of Health and Family Welfare, India
  'UCT0-V_Z5-MuwN5fpbO-25Ag', // AIIMS, New Delhi
  'UCMO8AoVI1HtqbxKVOevaBSw', // ICMR Organisation
  'UC0InVdvqNyNzKBl1-TL348A', // Apollo Hospitals
  
  // State government health departments
  'UCfmeFs0EgfkJudQcDWlVaYw', // ICMR-NIRT
  
  // Additional reputable health channels
  'UCZ5XnGb-3t7jCkXdawN2tkA', // WebMD
  'UCXV8RoT3I2u0ib5B8fcuFhA', // Health.com
];

// Search terms for health-related videos from government/reputable sources
const HEALTH_VIDEO_SEARCH_TERMS = [
  'healthcare India government Ministry of Health',
  'public health India government',
  'medical advice India government',
  'health tips India government',
  'disease prevention India government',
  'vaccination India government',
  'mental health India government',
  'nutrition India government',
  'fitness India government',
  'healthcare innovations India',
  'Ayushman Bharat health scheme',
  'MoHFW India health programs',
  'AIIMS health education',
  'ICMR health guidelines',
  'health awareness campaign India'
];

// Search terms for health-related courses from government/reputable sources
const HEALTH_COURSE_SEARCH_TERMS = [
  'medical education India government',
  'healthcare training India government',
  'medical courses India government',
  'nursing education India government',
  'public health courses India',
  'first aid training India government',
  'healthcare certification India',
  'medical school lectures India',
  'health education programs India',
  'healthcare workshops India'
];

/**
 * Fetches health videos from YouTube, prioritizing government and reputable health channels
 */
export async function fetchHealthVideos(
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  // Generate cache key for this request
  const cacheKey = generateCacheKey('fetchHealthVideos', { pageToken, maxResults });
  
  // Check cache first
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    console.log("Returning cached response for fetchHealthVideos");
    return cachedResponse;
  }
  
  try {
    console.log("Attempting to fetch from health channels first");
    // First try to fetch from specific health channels
    try {
      const channelResponse = await fetchVideosFromChannels(pageToken, maxResults);
      if (channelResponse.videos.length > 0 && !channelResponse.error) {
        console.log("Successfully fetched from health channels:", channelResponse.videos.length, "videos");
        // Cache the response
        cacheResponse(cacheKey, channelResponse);
        return channelResponse;
      } else {
        console.log("No videos returned from health channels");
      }
    } catch (channelError) {
      console.log("Channel fetching failed, continuing with search terms:", channelError);
      // Continue with search terms if channel fetching fails
    }
    
    // If channel fetching fails or returns no videos, fall back to search terms with more specific query
    console.log("Falling back to search terms");
    // Use a more general search term that's more likely to return results
    const response = await fetchYouTubeVideos("health medical India government", pageToken, maxResults);
    
    // Cache the response
    cacheResponse(cacheKey, response);
    return response;
  } catch (error) {
    // If we get a quota exceeded error, record it and return fallback content
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // For all other errors, return an empty result instead of triggering fallback
    console.error('Error fetching health videos:', error);
    return { videos: [] };
  }
}

/**
 * Fetches health courses from YouTube, prioritizing government and reputable health channels
 */
export async function fetchHealthCourses(
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  // Generate cache key for this request
  const cacheKey = generateCacheKey('fetchHealthCourses', { pageToken, maxResults });
  
  // Check cache first
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Use more specific search terms for courses
    const response = await fetchYouTubeVideos("medical education health courses India government", pageToken, maxResults);
    
    // Cache the response
    cacheResponse(cacheKey, response);
    return response;
  } catch (error) {
    // If we get a quota exceeded error, record it and return fallback content
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // For all other errors, return an empty result instead of triggering fallback
    console.error('Error fetching health courses:', error);
    return { videos: [] };
  }
}

/**
 * Fetches videos for a specific health topic from government/reputable sources
 */
export async function fetchVideosByTopic(
  topic: string,
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  // Generate cache key for this request
  const cacheKey = generateCacheKey('fetchVideosByTopic', { topic, pageToken, maxResults });
  
  // Check cache first
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    console.log("Fetching videos for topic:", topic);
    // Try to fetch from specific health channels first with the topic
    try {
      const channelResponse = await fetchVideosFromChannels(pageToken, maxResults, topic);
      if (channelResponse.videos.length > 0 && !channelResponse.error) {
        // Cache the response
        cacheResponse(cacheKey, channelResponse);
        return channelResponse;
      }
    } catch (channelError) {
      console.log("Channel fetching failed for topic, continuing with search:", channelError);
      // Continue with search if channel fetching fails
    }
    
    // If that fails, fall back to search with topic
    const response = await fetchYouTubeVideos(`${topic}`, pageToken, maxResults);
    
    // Cache the response
    cacheResponse(cacheKey, response);
    return response;
  } catch (error) {
    // If we get a quota exceeded error, record it and return fallback content
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // For all other errors, return an empty result instead of triggering fallback
    console.error('Error fetching videos by topic:', error);
    return { videos: [] };
  }
}

/**
 * Fetches videos from specific health channels
 */
async function fetchVideosFromChannels(
  pageToken?: string,
  maxResults: number = 24,
  searchQuery?: string
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  try {
    console.log("Fetching videos from specific health channels");
    
    // Build channel filter - use more channels to get better coverage
    const limitedChannels = HEALTH_CHANNELS.slice(0, 8);
    console.log("Using channels:", limitedChannels);
    
    let searchUrl = `${BASE_URL}/search?part=snippet&channelId=${limitedChannels[0]}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
    
    if (searchQuery) {
      searchUrl = `${BASE_URL}/search?part=snippet&channelId=${limitedChannels[0]}&q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
    }
    
    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    console.log("Channel search URL:", searchUrl);

    // Fetch search results
    const searchResponse = await fetch(searchUrl);
    console.log("Search response status:", searchResponse.status);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      // Search response error handled
      
      // Check for quota exceeded error
      if (searchResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API search error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    // Search data received
    
    // Check if we have items
    if (!searchData.items || searchData.items.length === 0) {
      console.log("No items found in channel search data");
      // Try the next channels if no results
      for (let i = 1; i < limitedChannels.length; i++) {
        let nextChannelUrl = `${BASE_URL}/search?part=snippet&channelId=${limitedChannels[i]}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
        if (searchQuery) {
          nextChannelUrl = `${BASE_URL}/search?part=snippet&channelId=${limitedChannels[i]}&q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
        }
        if (pageToken) {
          nextChannelUrl += `&pageToken=${pageToken}`;
        }
        
        console.log("Trying next channel URL:", nextChannelUrl);
        const nextSearchResponse = await fetch(nextChannelUrl);
        if (nextSearchResponse.ok) {
          const nextSearchData: YouTubeSearchResponse = await nextSearchResponse.json();
          if (nextSearchData.items && nextSearchData.items.length > 0) {
            searchData.items = nextSearchData.items;
            searchData.nextPageToken = nextSearchData.nextPageToken;
            searchData.prevPageToken = nextSearchData.prevPageToken;
            break;
          }
        }
      }
      
      // If still no items, don't return empty but let the main function continue to search terms
      if (!searchData.items || searchData.items.length === 0) {
        // Instead of returning empty, we'll throw an error to let the calling function handle it
        throw new Error("No videos found in health channels");
      }
    }
    
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');
    console.log("Video IDs to fetch details for:", videoIds);

    // Get additional video details - use all video IDs
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    console.log("Video details URL:", videoDetailsUrl);
    
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    // Video details response status checked
    
    if (!videoDetailsResponse.ok) {
      const errorText = await videoDetailsResponse.text();
      // Video details response error handled
      
      // Check for quota exceeded error
      if (videoDetailsResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API video details error: ${videoDetailsResponse.status} ${videoDetailsResponse.statusText} - ${errorText}`);
    }
    
    const videoDetailsData: YouTubeVideoDetailsResponse = await videoDetailsResponse.json();
    // Video details data received
    
    // Check if we have items
    if (!videoDetailsData.items || videoDetailsData.items.length === 0) {
      console.log("No items found in video details data");
      throw new Error("No video details found");
    }
    
    // Transform the data
    const videos = videoDetailsData.items.map((item: YouTubeVideoDetailsItem) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
    }));

    console.log("Transformed videos:", videos);

    return {
      videos,
      nextPageToken: searchData.nextPageToken,
      prevPageToken: searchData.prevPageToken
    };
  } catch (error) {
    // Error fetching YouTube videos from channels handled
    
    // Check for quota exceeded error
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // Re-throw the error so the calling function can handle it properly
    throw error;
  }
}

/**
 * Core function to fetch YouTube videos 
 */
async function fetchYouTubeVideos(
  searchQuery: string,
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  try {
    // Fetching YouTube videos with search query
    
    // Build search URL with parameters - use more specific search queries to get better results with fewer calls
    let searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
    
    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    // Search URL constructed
    
    // Add a check to see if we're in a browser environment
    if (typeof fetch === 'undefined') {
      // Fetch API is not available
      return { videos: [], error: "Fetch API not available" };
    }

    // Fetch search results
    const searchResponse = await fetch(searchUrl);
    console.log("Search response status:", searchResponse.status);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      // Search response error handled
      
      // Check for quota exceeded error
      if (searchResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API search error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    // Search data received
    
    // Check if we have items
    if (!searchData.items || searchData.items.length === 0) {
      // No items found in search data
      return { videos: [] };
    }
    
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

    // Get additional video details - use all video IDs
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    // Video details URL constructed
    
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    // Video details response status checked
    
    if (!videoDetailsResponse.ok) {
      const errorText = await videoDetailsResponse.text();
      // Video details response error handled
      
      // Check for quota exceeded error
      if (videoDetailsResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API video details error: ${videoDetailsResponse.status} ${videoDetailsResponse.statusText} - ${errorText}`);
    }
    
    const videoDetailsData: YouTubeVideoDetailsResponse = await videoDetailsResponse.json();
    // Video details data received
    
    // Check if we have items
    if (!videoDetailsData.items || videoDetailsData.items.length === 0) {
      // No items found in video details data
      return { videos: [] };
    }
    
    // Transform the data
    const videos = videoDetailsData.items.map((item: YouTubeVideoDetailsItem) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
    }));

    // Videos transformed

    return {
      videos,
      nextPageToken: searchData.nextPageToken,
      prevPageToken: searchData.prevPageToken
    };
  } catch (error) {
    // Error fetching YouTube videos handled
    
    // Check for quota exceeded error
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // Return a more descriptive error
    if (error instanceof Error) {
      return { 
        videos: [], 
        error: error.message 
      };
    }
    return { videos: [], error: 'Unknown error occurred' };
  }
}

/**
 * Fetches videos from specific YouTube channels
 * @param channelIds - Array of YouTube channel IDs
 * @param pageToken - Pagination token
 * @param maxResults - Maximum number of results per channel
 * @returns Promise with combined video data
 */
export async function fetchVideosFromSpecificChannels(
  channelIds: string[],
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  try {
    console.log("Fetching videos from specific channels:", channelIds);
    
    // Fetch videos from each channel
    const allVideos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined = pageToken;
    
    // Fetch from more channels to ensure we get enough videos
    const channelsToFetch = channelIds.slice(0, Math.min(channelIds.length, 12));
    console.log(`Fetching from ${channelsToFetch.length} channels`);
    
    for (const channelId of channelsToFetch) {
      try {
        console.log(`Attempting to fetch videos from channel: ${channelId}`);
        // Increase videos per channel to ensure we get enough total videos
        const channelVideos = await fetchVideosFromSingleChannel(channelId, nextPageToken, Math.min(maxResults, 24));
        console.log(`Got ${channelVideos.videos.length} videos from channel ${channelId}`);
        allVideos.push(...channelVideos.videos);
        
        // If we have enough videos, stop fetching
        if (allVideos.length >= maxResults * 3) { // Allow more buffer for deduplication
          console.log(`Stopping fetch - have ${allVideos.length} videos, which is more than needed`);
          break;
        }
      } catch (error) {
        console.warn(`Failed to fetch videos from channel ${channelId}:`, error);
        // Continue with other channels
      }
    }
    
    console.log(`Total videos before deduplication: ${allVideos.length}`);
    
    // Deduplicate videos by ID
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );
    
    console.log(`Total videos after deduplication: ${uniqueVideos.length}`);
    
    // Sort by published date (newest first)
    uniqueVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Return the requested number of videos (ensure at least 10)
    const resultVideos = uniqueVideos.slice(0, Math.max(maxResults, 10));
    console.log(`Returning ${resultVideos.length} videos from ${uniqueVideos.length} unique videos`);
    
    return {
      videos: resultVideos,
      nextPageToken: nextPageToken
    };
  } catch (error) {
    console.error('Error fetching videos from specific channels:', error);
    
    // If we get a quota exceeded error, record it and return fallback content
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // For all other errors, return an empty result
    return { videos: [] };
  }
}

/**
 * Fetches videos from a single YouTube channel
 * @param channelId - YouTube channel ID
 * @param pageToken - Pagination token
 * @param maxResults - Maximum number of results
 * @returns Promise with video data
 */
async function fetchVideosFromSingleChannel(
  channelId: string,
  pageToken?: string,
  maxResults: number = 12
): Promise<YouTubeApiResponse> {
  try {
    let searchUrl = `${BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&order=date&key=${API_KEY}`;
    
    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    console.log("Single channel search URL:", searchUrl);
    console.log("Channel ID:", channelId);
    console.log("Max results:", maxResults);

    // Fetch search results
    const searchResponse = await fetch(searchUrl);
    console.log("Search response status:", searchResponse.status);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      // Search response error handled
      
      // Check for quota exceeded error
      if (searchResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API search error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    // Search data received
    
    // Check if we have items
    if (!searchData.items || searchData.items.length === 0) {
      console.log("No items found in channel search data for channel:", channelId);
      return { videos: [] };
    }
    
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');
    console.log(`Found ${searchData.items.length} videos for channel ${channelId}`);

    // Get additional video details
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    console.log("Video details URL:", videoDetailsUrl);
    
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    // Video details response status checked
    
    if (!videoDetailsResponse.ok) {
      const errorText = await videoDetailsResponse.text();
      // Video details response error handled
      
      // Check for quota exceeded error
      if (videoDetailsResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API video details error: ${videoDetailsResponse.status} ${videoDetailsResponse.statusText} - ${errorText}`);
    }
    
    const videoDetailsData: YouTubeVideoDetailsResponse = await videoDetailsResponse.json();
    // Video details data received
    
    // Check if we have items
    if (!videoDetailsData.items || videoDetailsData.items.length === 0) {
      // No items found in video details data
      return { videos: [] };
    }
    
    // Transform the data
    const videos = videoDetailsData.items.map((item: YouTubeVideoDetailsItem) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
    }));

    console.log(`Transformed ${videos.length} videos for channel ${channelId}:`, videos.map(v => v.title));

    return {
      videos,
      nextPageToken: searchData.nextPageToken,
      prevPageToken: searchData.prevPageToken
    };
  } catch (error) {
    console.error('Error fetching YouTube videos from single channel:', channelId, error);
    
    // Check for quota exceeded error
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    throw error;
  }
}

/**
 * Fetches videos for a specific topic from specific channels
 * @param topic - Search topic
 * @param channelIds - Array of YouTube channel IDs
 * @param pageToken - Pagination token
 * @param maxResults - Maximum number of results
 * @returns Promise with video data
 */
export async function fetchVideosByTopicFromChannels(
  topic: string,
  channelIds: string[],
  pageToken?: string,
  maxResults: number = 24
): Promise<YouTubeApiResponse> {
  // Check if quota has been exceeded
  if (isQuotaExceeded()) {
    return { 
      videos: getFallbackContent(), 
      quotaExceeded: true 
    };
  }
  
  try {
    console.log("Fetching videos for topic from specific channels:", topic, channelIds);
    
    // Fetch videos from each channel with the topic
    const allVideos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined = pageToken;
    
    // For simplicity, we'll fetch from the first few channels to avoid quota issues
    const channelsToFetch = channelIds.slice(0, 4);
    
    for (const channelId of channelsToFetch) {
      try {
        const channelVideos = await fetchVideosByTopicFromSingleChannel(topic, channelId, nextPageToken, Math.min(maxResults, 6));
        allVideos.push(...channelVideos.videos);
        
        // If we have enough videos, stop fetching
        if (allVideos.length >= maxResults) {
          break;
        }
      } catch (error) {
        console.warn(`Failed to fetch videos for topic "${topic}" from channel ${channelId}:`, error);
        // Continue with other channels
      }
    }
    
    // Deduplicate videos by ID
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );
    
    // Sort by published date (newest first)
    uniqueVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Return only the requested number of videos
    return {
      videos: uniqueVideos.slice(0, maxResults),
      nextPageToken: nextPageToken
    };
  } catch (error) {
    console.error('Error fetching videos by topic from specific channels:', error);
    
    // If we get a quota exceeded error, record it and return fallback content
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    // For all other errors, return an empty result
    return { videos: [] };
  }
}

/**
 * Fetches videos for a specific topic from a single YouTube channel
 * @param topic - Search topic
 * @param channelId - YouTube channel ID
 * @param pageToken - Pagination token
 * @param maxResults - Maximum number of results
 * @returns Promise with video data
 */
async function fetchVideosByTopicFromSingleChannel(
  topic: string,
  channelId: string,
  pageToken?: string,
  maxResults: number = 6
): Promise<YouTubeApiResponse> {
  try {
    let searchUrl = `${BASE_URL}/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(topic)}&maxResults=${maxResults}&type=video&order=relevance&key=${API_KEY}`;
    
    if (pageToken) {
      searchUrl += `&pageToken=${pageToken}`;
    }

    console.log("Single channel topic search URL:", searchUrl);

    // Fetch search results
    const searchResponse = await fetch(searchUrl);
    console.log("Search response status:", searchResponse.status);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      // Search response error handled
      
      // Check for quota exceeded error
      if (searchResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API search error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    // Search data received
    
    // Check if we have items
    if (!searchData.items || searchData.items.length === 0) {
      console.log("No items found in channel search data");
      return { videos: [] };
    }
    
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

    // Get additional video details
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    console.log("Video details URL:", videoDetailsUrl);
    
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    // Video details response status checked
    
    if (!videoDetailsResponse.ok) {
      const errorText = await videoDetailsResponse.text();
      // Video details response error handled
      
      // Check for quota exceeded error
      if (videoDetailsResponse.status === 403 && errorText.includes('quota')) {
        recordQuotaExceeded();
        return { 
          videos: getFallbackContent(), 
          quotaExceeded: true 
        };
      }
      
      throw new Error(`YouTube API video details error: ${videoDetailsResponse.status} ${videoDetailsResponse.statusText} - ${errorText}`);
    }
    
    const videoDetailsData: YouTubeVideoDetailsResponse = await videoDetailsResponse.json();
    // Video details data received
    
    // Check if we have items
    if (!videoDetailsData.items || videoDetailsData.items.length === 0) {
      // No items found in video details data
      return { videos: [] };
    }
    
    // Transform the data
    const videos = videoDetailsData.items.map((item: YouTubeVideoDetailsItem) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
    }));

    console.log("Transformed videos:", videos);

    return {
      videos,
      nextPageToken: searchData.nextPageToken,
      prevPageToken: searchData.prevPageToken
    };
  } catch (error) {
    console.error('Error fetching YouTube videos by topic from single channel:', error);
    
    // Check for quota exceeded error
    if (error instanceof Error && (error.message.includes('403') || error.message.includes('quota'))) {
      recordQuotaExceeded();
      return { 
        videos: getFallbackContent(), 
        quotaExceeded: true 
      };
    }
    
    throw error;
  }
}

