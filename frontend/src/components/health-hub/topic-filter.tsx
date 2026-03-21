import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Pill, 
  Brain, 
  Apple, 
  Baby, 
  Dumbbell, 
  Microscope, 
  Cross, 
  Leaf, 
  Activity, 
  Stethoscope,
  TrendingUp
} from "lucide-react";

const TOPICS = [
  { id: "all", name: "All", icon: TrendingUp },
  { id: "heart-health", name: "Heart", icon: Heart },
  { id: "medications", name: "Medications", icon: Pill },
  { id: "mental-health", name: "Mental Health", icon: Brain },
  { id: "nutrition", name: "Nutrition", icon: Apple },
  { id: "pediatrics", name: "Pediatrics", icon: Baby },
  { id: "fitness", name: "Fitness", icon: Dumbbell },
  { id: "research", name: "Research", icon: Microscope },
  { id: "first-aid", name: "First Aid", icon: Cross },
  { id: "holistic", name: "Holistic", icon: Leaf },
  { id: "physical-therapy", name: "Physical Therapy", icon: Activity },
  { id: "diagnostics", name: "Diagnostics", icon: Stethoscope },
];

interface TopicFilterProps {
  selectedTopic: string;
  onSelectTopic: (topicId: string) => void;
}

export function TopicFilter({ selectedTopic, onSelectTopic }: TopicFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOPICS.map((topic) => {
        const Icon = topic.icon;
        return (
          <Button
            key={topic.id}
            variant={selectedTopic === topic.id ? "default" : "outline"}
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => onSelectTopic(topic.id)}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{topic.name}</span>
          </Button>
        );
      })}
    </div>
  );
}