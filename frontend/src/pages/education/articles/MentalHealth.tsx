import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentSection {
  title: string;
  content: string;
  keyPoints?: string[];
  tips?: string[];
  resources?: string[];
}

const mentalHealthContent: Record<string, ContentSection[]> = {
  understanding: [
    {
      title: "What is Mental Health?",
      content: `Mental health encompasses our emotional, psychological, and social well-being. It affects how we:
      
      1. Think, feel, and act
      2. Handle stress and anxiety
      3. Make choices and decisions
      4. Relate to others
      
      Good mental health isn't just the absence of mental health problems. It's about:
      - Enjoying life
      - Having a sense of purpose
      - Maintaining meaningful relationships
      - Contributing to society
      - Adapting to change
      - Dealing with life's challenges`,
      keyPoints: [
        "Mental health is essential at every stage of life",
        "It influences our thoughts, behaviors, and emotions",
        "Good mental health enables effective coping with stress",
        "Mental health affects physical health and vice versa"
      ]
    },
    {
      title: "Common Mental Health Challenges",
      content: `Understanding common mental health challenges is crucial for early recognition and support:

      1. Anxiety Disorders
      - Generalized anxiety
      - Social anxiety
      - Panic disorders
      - Specific phobias

      2. Mood Disorders
      - Depression
      - Bipolar disorder
      - Seasonal affective disorder

      3. Stress-Related Issues
      - Work-related stress
      - Academic pressure
      - Relationship difficulties
      - Financial worries`,
      keyPoints: [
        "Mental health challenges are common and treatable",
        "Early intervention leads to better outcomes",
        "Professional help is important for proper diagnosis",
        "Support systems play a crucial role in recovery"
      ]
    }
  ],
  selfCare: [
    {
      title: "Daily Self-Care Practices",
      content: `Self-care is essential for maintaining good mental health. Key practices include:

      1. Physical Self-Care
      - Regular exercise (30 minutes daily)
      - Adequate sleep (7-9 hours)
      - Balanced nutrition
      - Regular health check-ups

      2. Emotional Self-Care
      - Mindfulness and meditation
      - Journaling
      - Creative expression
      - Setting boundaries

      3. Social Self-Care
      - Maintaining connections
      - Asking for help when needed
      - Joining support groups
      - Quality time with loved ones`,
      tips: [
        "Start with small, manageable changes",
        "Create a daily self-care routine",
        "Practice mindfulness regularly",
        "Set realistic goals and boundaries",
        "Make time for activities you enjoy"
      ]
    },
    {
      title: "Stress Management Techniques",
      content: `Effective stress management is crucial for mental well-being:

      1. Relaxation Techniques
      - Deep breathing exercises
      - Progressive muscle relaxation
      - Guided imagery
      - Meditation

      2. Time Management
      - Prioritizing tasks
      - Breaking large tasks into smaller ones
      - Setting realistic deadlines
      - Taking regular breaks

      3. Healthy Coping Strategies
      - Exercise and physical activity
      - Creative outlets
      - Nature walks
      - Social support`,
      tips: [
        "Practice relaxation techniques daily",
        "Identify and avoid stress triggers",
        "Maintain a balanced schedule",
        "Take regular breaks during work",
        "Connect with nature regularly"
      ]
    }
  ],
  resources: [
    {
      title: "Professional Support",
      content: `Various professional mental health services are available:

      1. Types of Mental Health Professionals
      - Psychiatrists
      - Psychologists
      - Licensed counselors
      - Social workers
      - Support groups

      2. Treatment Options
      - Individual therapy
      - Group therapy
      - Medication management
      - Alternative therapies
      
      3. When to Seek Help
      - Persistent feelings of sadness or anxiety
      - Changes in sleep or appetite
      - Difficulty concentrating
      - Loss of interest in activities
      - Thoughts of self-harm`,
      resources: [
        "24/7 Crisis Helplines",
        "Online therapy platforms",
        "Community mental health centers",
        "Support groups and workshops",
        "Mental health apps and tools"
      ]
    },
    {
      title: "Digital Mental Health Resources",
      content: `Modern technology offers various mental health support tools:

      1. Mental Health Apps
      - Meditation apps
      - Mood tracking tools
      - Therapy apps
      - Sleep improvement apps

      2. Online Resources
      - Educational websites
      - Self-help programs
      - Virtual support groups
      - Teletherapy services

      3. Digital Wellness Tools
      - Stress management apps
      - Habit tracking
      - Journaling platforms
      - Mindfulness resources`,
      resources: [
        "Evidence-based mental health websites",
        "Meditation and mindfulness apps",
        "Online therapy platforms",
        "Mental health podcasts and videos",
        "Self-help books and guides"
      ]
    }
  ]
};

export default function MentalHealth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/education/articles">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mental Health & Wellness</h1>
                <p className="text-gray-600">Understanding and improving mental well-being</p>
              </div>
            </div>
          </div>
        </div>
      </header>
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="understanding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="understanding">Understanding</TabsTrigger>
              <TabsTrigger value="selfCare">Self-Care</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {Object.entries(mentalHealthContent).map(([key, sections]) => (
              <TabsContent key={key} value={key}>
                <ScrollArea className="h-[600px] rounded-md border">
                  <Card>
                    <CardContent className="p-6 space-y-8">
                      {sections.map((section, index) => (
                        <div key={index} className="prose prose-slate max-w-none">
                          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                          <div className="whitespace-pre-line">{section.content}</div>
                          {section.keyPoints && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Key Points:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.keyPoints.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {section.tips && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Tips:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.tips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {section.resources && (
                            <div className="mt-4">
                              <h3 className="font-medium mb-2">Available Resources:</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.resources.map((resource, i) => (
                                  <li key={i}>{resource}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </main>
    </div>
  );
} 