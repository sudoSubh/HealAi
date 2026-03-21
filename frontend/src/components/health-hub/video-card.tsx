import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  aiSummary?: string;
  category?: string;
}

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });
  
  // Format view count
  const formatViewCount = (viewCount?: string) => {
    if (!viewCount) return "0 views";
    
    const count = parseInt(viewCount, 10);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  // Fallback image for when thumbnails fail to load
  const fallbackImage = "https://placehold.co/320x180/2563eb/white?text=Health+Video";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col bg-card border-border">
        <div className="relative aspect-video">
          {!imageError ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={() => {
                console.log("Thumbnail failed to load, using fallback");
                setImageError(true);
              }}
            />
          ) : (
            <img
              src={fallbackImage}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              className="rounded-full bg-white/90 hover:bg-white text-black"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>
          {video.viewCount && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-black/70 text-white"
            >
              <Eye className="h-3 w-3" />
              {formatViewCount(video.viewCount)}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold line-clamp-2 mb-2 leading-tight flex-grow">
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <span className="truncate">{video.channelTitle}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
          {video.aiSummary && (
            <div className="mt-3 p-2 bg-primary/5 rounded-md">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {video.aiSummary}
              </p>
            </div>
          )}
          {video.category && (
            <Badge variant="outline" className="mt-2 text-xs w-fit">
              {video.category}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full mt-3 text-primary hover:bg-primary/10"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}