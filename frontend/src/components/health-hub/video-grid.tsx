import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { YouTubeVideo, YouTubeApiResponse } from "@/lib/youtubeApi";
import { VideoCard } from "./video-card";
import { isInRefreshCooldown, recordRefresh } from "@/lib/youtubeQuotaManager";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VideoGridProps {
  fetchVideos: (pageToken?: string) => Promise<YouTubeApiResponse>;
  title: string;
  category?: string;
}

export function VideoGrid({ fetchVideos, title, category }: VideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const loadVideos = useCallback(async (pageToken?: string) => {
    try {
      setLoading(true);
      const response = await fetchVideos(pageToken);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (pageToken) {
        setVideos(prev => [...prev, ...response.videos]);
      } else {
        setVideos(response.videos);
      }
      
      setNextPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [fetchVideos]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const loadMore = () => {
    // Check if user is in refresh cooldown
    if (isInRefreshCooldown()) {
      toast.warning("Please wait a few minutes before loading more content to preserve API quota");
      return;
    }
    
    if (nextPageToken) {
      // Record the refresh action
      recordRefresh();
      loadVideos(nextPageToken);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button 
            onClick={() => {
              // Check if user is in refresh cooldown
              if (isInRefreshCooldown()) {
                toast.warning("Please wait a few minutes before retrying to preserve API quota");
                return;
              }
              
              // Record the refresh action
              recordRefresh();
              loadVideos();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {hasMore && (
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
            className="px-4 py-2 text-sm"
          >
            {loading ? "Loading..." : "See More"}
          </Button>
        )}
      </div>
      
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found</p>
        </div>
      ) : (
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: "auto",
            }}
            className="w-full"
          >
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem 
                  key={video.id} 
                  className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 pl-4"
                >
                  <VideoCard video={video} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      )}
    </div>
  );
}