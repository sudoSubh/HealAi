import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink } from "lucide-react";
import { CuratedVideo } from "@/data/curatedVideos";

interface CuratedVideoCardProps {
  video: CuratedVideo;
}

export function CuratedVideoCard({ video }: CuratedVideoCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate thumbnail URL from YouTube video ID
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  
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
              src={thumbnailUrl}
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
              onClick={() => window.open(video.url, "_blank")}
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold line-clamp-2 mb-2 leading-tight flex-grow">
            {video.title}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline" className="text-xs">
              {video.category}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => window.open(video.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}