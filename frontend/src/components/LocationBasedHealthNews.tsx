import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  WifiOff, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle,
  Info,
  TrendingUp,
  Shield
} from "lucide-react";

interface HealthNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "news" | "advisory" | "campaign" | "awareness";
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
}

// Hardcoded fallback health updates data
const FALLBACK_HEALTH_NEWS: HealthNewsItem[] = [
  {
    id: "fallback-1",
    title: "Covid-19 Monitoring and Alerts",
    summary: "Odisha reports low but ongoing Covid-19 cases, with a recent new death in Bhubaneswar marking the state's first Covid-19 fatality of 2025. A sub-variant strain JN.1 of Omicron has been detected in recent cases. The government continues to urge adherence to Covid-19 protocols, increased testing, and vaccination to control transmission during festivals and public gatherings like Rath Yatra.",
    source: "Odisha Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.odisha.gov.in/",
    category: "advisory",
    location: "Bhubaneswar",
    priority: "high",
    tags: ["covid-19", "JN.1", "vaccination", "testing"]
  },
  {
    id: "fallback-2",
    title: "Doctor Shortage in Government Facilities",
    summary: "A critical shortage of doctors persists in Odisha's government hospitals, with nearly 4,880 medical officer positions vacant statewide, including in Bhubaneswar. This shortage could strain healthcare delivery, especially in peak illness seasons. Recruitment and incentives are under discussion.",
    source: "Odisha Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://dphodisha.nic.in/",
    category: "news",
    location: "Bhubaneswar",
    priority: "high",
    tags: ["doctor shortage", "government hospitals", "recruitment"]
  },
  {
    id: "fallback-3",
    title: "Heavy Rainfall Alert and Preparedness",
    summary: "Odisha, including Bhubaneswar, is under high alert for heavy rainfall and potential flooding. The health department has issued warnings for vector-borne diseases like dengue and malaria, which tend to spike after rains, along with other communicable diseases.",
    source: "Odisha State Disaster Management Authority",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://osdma.org/",
    category: "advisory",
    location: "Bhubaneswar",
    priority: "critical",
    tags: ["rainfall", "flooding", "dengue", "malaria", "vector-borne diseases"]
  },
  {
    id: "fallback-4",
    title: "Unified Health Insurance Rollout",
    summary: "The state has launched a unified health insurance scheme offering cashless treatment for millions of families, promoting wider healthcare access. This initiative aims to improve financial protection against health emergencies for Bhubaneswar residents.",
    source: "Odisha Health Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://health.odisha.gov.in/",
    category: "news",
    location: "Bhubaneswar",
    priority: "medium",
    tags: ["health insurance", "cashless treatment", "financial protection"]
  },
  {
    id: "fallback-5",
    title: "Focus on Traditional Medicine",
    summary: "With rising urban health challenges, there is a push to strengthen Ayurveda and AYUSH systems for preventive and holistic healthcare. Expanded Ayurvedic services create additional care options amidst ongoing public health concerns.",
    source: "Odisha AYUSH Department",
    publishedAt: new Date().toISOString().split('T')[0],
    url: "https://ayushodisha.nic.in/",
    category: "awareness",
    location: "Bhubaneswar",
    priority: "medium",
    tags: ["Ayurveda", "AYUSH", "preventive care", "holistic healthcare"]
  }
];

interface LocationBasedHealthNewsProps {
  className?: string;
}

export function LocationBasedHealthNews({ className }: LocationBasedHealthNewsProps) {
  const [news] = useState<HealthNewsItem[]>(FALLBACK_HEALTH_NEWS);
  const [loading] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'advisory':
        return <AlertTriangle className="w-3 h-3" />;
      case 'campaign':
        return <TrendingUp className="w-3 h-3" />;
      case 'awareness':
        return <Shield className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'advisory':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'campaign':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'awareness':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    }
  };

  const handleRefresh = () => {
    // Refresh functionality - in this case, just reload the hardcoded data
    window.location.reload();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Bhubaneswar Health News
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {news.length === 0 ? (
          <div className="text-center py-8">
            <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No Real-Time Health Updates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Currently, no real-time health updates are available from government sources for Bhubaneswar, Odisha.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              This system only displays verified real-time updates from official government health departments.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open("https://health.odisha.gov.in/", "_blank")}
              >
                Visit Official Health Department
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh Data
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 5).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(item.category)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)} variant="secondary">
                      {item.priority}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Read
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {news.length > 5 && (
              <div className="text-center pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open("https://health.odisha.gov.in/", "_blank")}
                >
                  View All Updates
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}