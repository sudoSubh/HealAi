// YouTube API service for Health Hub
import { fetchHealthVideos, fetchHealthCourses, fetchVideosByTopic } from "@/lib/youtubeApi";

// Export all functions from the youtubeApi module
export { fetchHealthVideos, fetchHealthCourses, fetchVideosByTopic };

// Additional utility functions for Health Hub

/**
 * Fetches videos from specific government health channels
 * @param channelId - The YouTube channel ID
 * @param maxResults - Maximum number of results to return (default: 24)
 * @returns Promise with video data or error
 */
export async function fetchVideosFromGovernmentChannel(
  channelId: string,
  maxResults: number = 24
) {
  try {
    // This would use a more specific implementation to fetch from a single channel
    // For now, we'll use the existing fetchHealthVideos function
    return await fetchHealthVideos(undefined, maxResults);
  } catch (error) {
    console.error("Error fetching videos from government channel:", error);
    throw error;
  }
}

/**
 * Fetches the most popular health videos from government sources
 * @param maxResults - Maximum number of results to return (default: 24)
 * @returns Promise with video data or error
 */
export async function fetchPopularGovernmentHealthVideos(
  maxResults: number = 24 // Increased from 3 to 24
) {
  try {
    // For now, we'll use the existing fetchHealthVideos function
    // In a more advanced implementation, we could sort by view count
    return await fetchHealthVideos(undefined, maxResults);
  } catch (error) {
    console.error("Error fetching popular government health videos:", error);
    throw error;
  }
}

/**
 * Fetches health videos specifically from Indian government sources
 * @param maxResults - Maximum number of results to return (default: 24)
 * @returns Promise with video data or error
 */
export async function fetchIndianGovernmentHealthVideos(
  maxResults: number = 24 // Increased from 3 to 24
) {
  try {
    // Search for Indian government health content with more specific terms
    return await fetchVideosByTopic("healthcare India government Ministry of Health", undefined, maxResults);
  } catch (error) {
    console.error("Error fetching Indian government health videos:", error);
    throw error;
  }
}