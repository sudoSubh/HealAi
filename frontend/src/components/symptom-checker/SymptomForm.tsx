
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
// @ts-ignore: All icons are used but TypeScript doesn't recognize usage in object properties
import { 
  Info, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  CalendarClock, 
  Smile, 
  Meh, 
  Frown, 
  AlertTriangle, 
  ShieldCheck, 
  Brain, 
  Eye, 
  Ear, 
  Droplet, 
  BookOpen, 
  Activity, 
  Heart, 
  Dumbbell, 
  Bone, 
  Stethoscope as LucideStethoscope, 
  Thermometer, 
  Microscope, 
  Pill 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSymptomsWithGemini, type AnalysisResponse } from "@/services/symptom-checker-gemini-service";
import { motion } from "framer-motion";

// Add this type definition
type BodyPartId = 'head' | 'eyes' | 'ears' | 'nose' | 'mouth' | 'neck' | 'chest' | 'shoulders' | 'abdomen' | 'digestive' | 'respiratory' | 'upper_back' | 'lower_back' | 'arms' | 'elbows' | 'wrists' | 'hips' | 'legs' | 'knees' | 'ankles' | 'skin' | 'joints' | 'urinary' | 'general';

interface SymptomSeverityDetails {
  value: string;
  description: string;
  examples: string[];
  color: "default" | "secondary" | "destructive";
}


interface SymptomFormProps {
  onAnalyze: (data: AnalysisResponse) => void;
}

const bodyParts = [
  // Head & Face Area
  { id: "head", name: "Head & Face", icon: Brain, color: "bg-blue-500 dark:bg-blue-600", gradient: "from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600" },
  { id: "eyes", name: "Eyes", icon: Eye, color: "bg-blue-500 dark:bg-blue-600", gradient: "from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600" },
  { id: "ears", name: "Ears", icon: Ear, color: "bg-blue-500 dark:bg-blue-600", gradient: "from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600" },
  { id: "nose", name: "Nose & Sinuses", icon: Droplet, color: "bg-blue-500 dark:bg-blue-600", gradient: "from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600" },
  { id: "mouth", name: "Mouth & Throat", icon: BookOpen, color: "bg-blue-500 dark:bg-blue-600", gradient: "from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600" },
  
  // Neck & Upper Body
  { id: "neck", name: "Neck", icon: Activity, color: "bg-teal-500 dark:bg-teal-600", gradient: "from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600" },
  { id: "chest", name: "Chest & Heart", icon: Heart, color: "bg-red-500 dark:bg-red-600", gradient: "from-red-400 to-rose-500 dark:from-red-500 dark:to-rose-600" },
  { id: "shoulders", name: "Shoulders", icon: Dumbbell, color: "bg-teal-500 dark:bg-teal-600", gradient: "from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600" },

  // Abdomen & Digestive
  { id: "abdomen", name: "Abdomen", icon: LucideStethoscope, color: "bg-amber-500 dark:bg-amber-600", gradient: "from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600" },
  { id: "digestive", name: "Digestive System", icon: Microscope, color: "bg-amber-500 dark:bg-amber-600", gradient: "from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600" },
  
  // Respiratory
  { id: "respiratory", name: "Respiratory", icon: LucideStethoscope, color: "bg-cyan-500 dark:bg-cyan-600", gradient: "from-cyan-400 to-sky-500 dark:from-cyan-500 dark:to-sky-600" },
  
  // Back Area
  { id: "upper_back", name: "Upper Back", icon: Bone, color: "bg-teal-500 dark:bg-teal-600", gradient: "from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600" },
  { id: "lower_back", name: "Lower Back", icon: Activity, color: "bg-teal-500 dark:bg-teal-600", gradient: "from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-600" },
  
  // Upper Limbs
  { id: "arms", name: "Arms", icon: Dumbbell, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  { id: "elbows", name: "Elbows", icon: Activity, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  { id: "wrists", name: "Wrists & Hands", icon: Droplet, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  
  // Lower Limbs
  { id: "hips", name: "Hips & Pelvis", icon: Bone, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  { id: "legs", name: "Legs", icon: Activity, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  { id: "knees", name: "Knees", icon: LucideStethoscope, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  { id: "ankles", name: "Ankles & Feet", icon: Thermometer, color: "bg-green-500 dark:bg-green-600", gradient: "from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600" },
  
  // Other Systems
  { id: "skin", name: "Skin & Hair", icon: Droplet, color: "bg-rose-500 dark:bg-rose-600", gradient: "from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600" },
  { id: "joints", name: "Joints & Muscles", icon: Activity, color: "bg-orange-500 dark:bg-orange-600", gradient: "from-orange-400 to-amber-500 dark:from-orange-500 dark:to-amber-600" },
  { id: "urinary", name: "Urinary & Reproductive", icon: Heart, color: "bg-indigo-500 dark:bg-indigo-600", gradient: "from-indigo-400 to-violet-500 dark:from-indigo-500 dark:to-violet-600" },
  { id: "general", name: "General", icon: Pill, color: "bg-purple-500 dark:bg-purple-600", gradient: "from-purple-400 to-violet-500 dark:from-purple-500 dark:to-violet-600" },
];

const symptomsByBodyPart: Record<BodyPartId, string[]> = {
  head: ["Headache", "Migraine", "Dizziness", "Confusion", "Memory problems"],
  eyes: ["Blurred vision", "Eye pain", "Red eyes", "Dry eyes", "Vision changes", "Light sensitivity"],
  ears: ["Ear pain", "Hearing loss", "Ringing in ears", "Ear discharge", "Vertigo"],
  nose: ["Nasal congestion", "Runny nose", "Loss of smell", "Nosebleeds", "Sinus pressure"],
  mouth: ["Sore throat", "Difficulty swallowing", "Mouth ulcers", "Bad breath", "Dry mouth", "Taste changes"],
  
  neck: ["Neck pain", "Stiff neck", "Neck swelling", "Limited neck mobility", "Neck muscle spasms"],
  chest: ["Chest pain", "Shortness of breath", "Heart palpitations", "Chest tightness", "Irregular heartbeat"],
  shoulders: ["Shoulder pain", "Limited shoulder mobility", "Shoulder stiffness", "Joint pain", "Muscle weakness"],
  
  abdomen: ["Abdominal pain", "Bloating", "Nausea", "Vomiting", "Loss of appetite"],
  digestive: ["Diarrhea", "Constipation", "Acid reflux", "Indigestion", "Stomach cramps", "Changes in bowel habits"],
  respiratory: ["Cough", "Wheezing", "Difficulty breathing", "Rapid breathing", "Chest congestion"],
  
  upper_back: ["Upper back pain", "Muscle tension", "Stiffness", "Burning sensation", "Radiating pain"],
  lower_back: ["Lower back pain", "Sciatica", "Muscle spasms", "Limited mobility", "Chronic pain"],
  
  arms: ["Arm pain", "Muscle weakness", "Numbness", "Tingling", "Limited mobility"],
  elbows: ["Elbow pain", "Tennis elbow", "Limited range of motion", "Joint stiffness", "Swelling"],
  wrists: ["Wrist pain", "Carpal tunnel", "Joint stiffness", "Weakness", "Limited mobility"],
  
  hips: ["Hip pain", "Limited mobility", "Joint stiffness", "Difficulty walking", "Groin pain"],
  legs: ["Leg pain", "Muscle cramps", "Weakness", "Swelling", "Numbness"],
  knees: ["Knee pain", "Swelling", "Stiffness", "Limited mobility", "Joint instability"],
  ankles: ["Ankle pain", "Swelling", "Instability", "Limited mobility", "Stiffness"],
  
  skin: ["Rash", "Itching", "Dry skin", "Skin changes", "Excessive sweating"],
  joints: ["Joint pain", "Stiffness", "Swelling", "Limited mobility", "Inflammation"],
  urinary: ["Frequent urination", "Painful urination", "Blood in urine", "Urgency", "Incontinence"],
  general: ["Fever", "Fatigue", "Weight changes", "Night sweats", "General weakness"],
} as const;

const severityLevels: SymptomSeverityDetails[] = [
  {
    value: "Mild",
    description: "Noticeable but doesn't interfere with daily activities",
    examples: [
      "Can work and socialize normally",
      "Symptoms are annoying but manageable",
      "No need for medication or only occasional over-the-counter remedies"
    ],
    color: "default"
  },
  {
    value: "Moderate",
    description: "Affects daily activities but doesn't prevent them",
    examples: [
      "May need to modify some activities",
      "Regular use of over-the-counter medication",
      "Symptoms are distressing but not incapacitating"
    ],
    color: "secondary"
  },
  {
    value: "Severe",
    description: "Significantly impacts or prevents daily activities",
    examples: [
      "Unable to work or need significant accommodations",
      "Difficulty performing basic tasks",
      "May require immediate medical attention"
    ],
    color: "destructive"
  }
];

const MINIMUM_SYMPTOMS = 1;
const MAXIMUM_SYMPTOMS = 10;

const commonConditions = [
  "High Blood Pressure",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Thyroid Disorders",
  "Cancer",
  "Anxiety/Depression",
];

export function SymptomForm({ onAnalyze }: SymptomFormProps) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(16.67); // Updated for 6 steps (100/6 ≈ 16.67)
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartId | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomDuration, setSymptomDuration] = useState<string | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Medical history state
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    surgeries: [] as string[],
  });
  
  // Lifestyle factors state
  const [lifestyleFactors] = useState({
    smoking: false,
    alcohol: "None",
    exercise: "Sedentary",
    diet: "Balanced",
    stress: "Low",
    sleep: "6-8 hours",
  });
  
  // Family history state
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);

  // Update total steps from 6 to 7 to include medical history
  const totalSteps = 7;

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Body Part";
      case 2: return "Symptoms";
      case 3: return "Duration";
      case 4: return "Severity";
      case 5: return "Additional Info";
      case 6: return "Medical History";
      case 7: return "Review";
      default: return "";
    }
  };


  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      // Check if we've reached the maximum number of symptoms
      if (selectedSymptoms.length >= MAXIMUM_SYMPTOMS) {
        alert(`You can select a maximum of ${MAXIMUM_SYMPTOMS} symptoms.`);
        return;
      }
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedBodyPart !== null;
      case 2:
        return selectedSymptoms.length >= MINIMUM_SYMPTOMS && selectedSymptoms.length <= MAXIMUM_SYMPTOMS;
      case 3:
        return symptomDuration !== null;
      case 4:
        return symptomSeverity !== null;
      case 5:
        return true; // Additional info is optional
      case 6:
        return true; // Medical history is optional
      case 7:
        return true; // Review step can always proceed to submit
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setProgress(((step + 1) / totalSteps) * 100);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 1) / totalSteps) * 100);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      // Combine the new symptom data with the existing data structure
      const analysisData = {
        symptoms: selectedSymptoms,
        severity: symptomSeverity || "",
        duration: symptomDuration || "",
        medicalHistory: medicalHistory,
        lifestyle: lifestyleFactors,
        recentChanges: additionalInfo, // Use the additional info here
        familyHistory: familyHistory,
      };

      const result = await analyzeSymptomsWithGemini(analysisData);
      onAnalyze(result);
    } catch (error: any) {
      console.error('Error analyzing symptoms:', error);
      // Handle error appropriately - show user-friendly error message
      alert('Failed to analyze symptoms. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Where are you experiencing symptoms?</h2>
            <p className="text-muted-foreground">Select the primary area of your body where you're experiencing symptoms.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {bodyParts.map((part) => (
                <motion.div
                  key={part.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all overflow-hidden border-0 shadow-md ${
                      selectedBodyPart === part.id 
                        ? 'ring-2 ring-primary/50 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-900/80' 
                        : 'hover:shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-900/80'
                    }`}
                    onClick={() => setSelectedBodyPart(part.id as BodyPartId)}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${part.gradient}`}></div>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${
                        selectedBodyPart === part.id ? part.gradient : 'from-primary/20 to-primary/10'
                      } flex items-center justify-center transition-colors duration-300 backdrop-blur-sm`}>
                        <part.icon className={`h-5 w-5 ${selectedBodyPart === part.id ? 'text-white' : 'text-primary/70'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{part.name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              What symptoms are you experiencing?
            </h2>
            <p className="text-muted-foreground">
              Select all symptoms that apply to your {selectedBodyPart ? bodyParts.find(bp => bp.id === selectedBodyPart)?.name.toLowerCase() : ''} area.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBodyPart && symptomsByBodyPart[selectedBodyPart].map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                const bodyPart = bodyParts.find(bp => bp.id === selectedBodyPart);
                const gradientClass = bodyPart?.gradient || '';
                
                return (
                  <motion.div
                    key={symptom}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div 
                      className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? `border-2 border-primary/50 bg-gradient-to-r ${gradientClass} shadow-md backdrop-blur-sm` 
                          : 'border border-input/30 hover:bg-white/30 dark:hover:bg-slate-800/30 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm'
                      }`}
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : `bg-gradient-to-br ${gradientClass} bg-opacity-10`
                      }`}>
                        <Checkbox 
                          id={symptom}
                          checked={isSelected}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                          className={`${isSelected ? 'border-white' : ''} h-5 w-5`}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={symptom}
                          className={`text-sm font-medium leading-none cursor-pointer ${isSelected ? 'text-white' : ''}`}
                        >
                          {symptom}
                        </label>
                        <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                          Common symptom for {bodyPart?.name}
                          {selectedSymptoms.length >= MAXIMUM_SYMPTOMS && !isSelected && (
                            <span className="block text-yellow-300 mt-1">Maximum symptoms selected ({MAXIMUM_SYMPTOMS})</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              className="flex items-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 backdrop-blur-sm rounded-lg mt-6 border border-blue-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-sm">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Selected Symptoms: {selectedSymptoms.length}/{MAXIMUM_SYMPTOMS}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Choose all symptoms you're experiencing for a more accurate assessment (maximum {MAXIMUM_SYMPTOMS})
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              How long have you been experiencing these symptoms?
            </h2>
            <p className="text-muted-foreground">Select the duration that best matches your symptoms.</p>
            
            <RadioGroup value={symptomDuration || ""} onValueChange={setSymptomDuration} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: "Less than a day", icon: <Clock className="h-5 w-5" />, description: "Symptoms started recently" },
                { value: "1-3 days", icon: <Calendar className="h-5 w-5" />, description: "Short-term symptoms" },
                { value: "4-7 days", icon: <CalendarDays className="h-5 w-5" />, description: "Ongoing for about a week" },
                { value: "1-2 weeks", icon: <CalendarRange className="h-5 w-5" />, description: "Persistent symptoms" },
                { value: "More than 2 weeks", icon: <CalendarClock className="h-5 w-5" />, description: "Long-term symptoms" }
              ].map((duration) => {
                const isSelected = symptomDuration === duration.value;
                const bodyPart = bodyParts.find(bp => bp.id === selectedBodyPart);
                const gradientClass = bodyPart?.gradient || 'from-primary/40 to-primary/20';
                
                return (
                  <motion.div
                    key={duration.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div 
                      className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? `border-2 border-primary/50 bg-gradient-to-r ${gradientClass} shadow-md backdrop-blur-sm` 
                          : 'border border-input/30 hover:bg-white/30 dark:hover:bg-slate-800/30 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm'
                      }`}
                      onClick={() => setSymptomDuration(duration.value)}
                    >
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : `bg-gradient-to-br ${gradientClass} bg-opacity-10`
                      }`}>
                        {duration.icon}
                      </div>
                      <div className="flex-1">
                        <RadioGroupItem 
                          value={duration.value} 
                          id={duration.value} 
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={duration.value} 
                          className={`block cursor-pointer ${isSelected ? 'text-white' : ''}`}
                        >
                          <span className="font-medium">{duration.value}</span>
                          <p className={`text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {duration.description}
                          </p>
                        </Label>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </RadioGroup>

            <motion.div
              className="flex items-center p-4 bg-gradient-to-r from-amber-500/10 to-orange-600/10 backdrop-blur-sm rounded-lg mt-6 border border-amber-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Symptom Timeline</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  The duration of your symptoms helps determine the urgency of care needed
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              How severe are your symptoms?
            </h2>
            <p className="text-muted-foreground">Select the severity level that best describes your symptoms.</p>
            
            <RadioGroup value={symptomSeverity || ""} onValueChange={setSymptomSeverity} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {severityLevels.map((level) => {
                const isSelected = symptomSeverity === level.value;
                const bodyPart = bodyParts.find(bp => bp.id === selectedBodyPart);
                
                // Color coding based on severity level
                let gradientClass = "";
                let bgColorClass = "";
                let borderColorClass = "";
                
                switch (level.value) {
                  case "Mild":
                    gradientClass = "from-green-400 to-emerald-500";
                    bgColorClass = "bg-green-50 dark:bg-green-900/20";
                    borderColorClass = "border-green-200 dark:border-green-800/50";
                    break;
                  case "Moderate":
                    gradientClass = "from-yellow-400 to-amber-500";
                    bgColorClass = "bg-yellow-50 dark:bg-yellow-900/20";
                    borderColorClass = "border-yellow-200 dark:border-yellow-800/50";
                    break;
                  case "Severe":
                    gradientClass = "from-red-400 to-orange-500";
                    bgColorClass = "bg-red-50 dark:bg-red-900/20";
                    borderColorClass = "border-red-200 dark:border-red-800/50";
                    break;
                  default:
                    gradientClass = "from-primary/40 to-primary/20";
                    bgColorClass = "bg-primary/5 dark:bg-primary/10";
                    borderColorClass = "border-primary/20 dark:border-primary/30";
                }
                
                return (
                  <motion.div
                    key={level.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div 
                      className={`flex flex-col p-5 rounded-lg cursor-pointer transition-all border-2 ${
                        isSelected 
                          ? `border-primary/50 bg-gradient-to-r ${gradientClass} shadow-md backdrop-blur-sm text-white` 
                          : `${bgColorClass} ${borderColorClass} hover:shadow-md`
                      }`}
                      onClick={() => setSymptomSeverity(level.value)}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          isSelected 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-white/50 dark:bg-slate-800/50'
                        }`}>
                          {level.value === "Mild" && <Smile className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-green-500'}`} />}
                          {level.value === "Moderate" && <Meh className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-yellow-500'}`} />}
                          {level.value === "Severe" && <Frown className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-red-500'}`} />}
                        </div>
                        <RadioGroupItem 
                          value={level.value} 
                          id={level.value} 
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={level.value} 
                          className={`block cursor-pointer ml-3 font-medium ${
                            isSelected ? 'text-white' : level.value === "Mild" ? 'text-green-700 dark:text-green-300' : 
                                         level.value === "Moderate" ? 'text-yellow-700 dark:text-yellow-300' : 
                                         level.value === "Severe" ? 'text-red-700 dark:text-red-300' : ''
                          }`}
                        >
                          {level.value}
                        </Label>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        isSelected ? 'text-white/90' : level.value === "Mild" ? 'text-green-600 dark:text-green-400' : 
                                     level.value === "Moderate" ? 'text-yellow-600 dark:text-yellow-400' : 
                                     level.value === "Severe" ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                      }`}>
                        {level.description}
                      </p>
                      
                      <div className="mt-auto">
                        <p className={`text-xs font-medium mb-2 ${
                          isSelected ? 'text-white/80' : level.value === "Mild" ? 'text-green-600 dark:text-green-400' : 
                                       level.value === "Moderate" ? 'text-yellow-600 dark:text-yellow-400' : 
                                       level.value === "Severe" ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                        }`}>
                          Examples:
                        </p>
                        <ul className={`text-xs space-y-1 ${
                          isSelected ? 'text-white/70' : level.value === "Mild" ? 'text-green-500/80 dark:text-green-300/80' : 
                                       level.value === "Moderate" ? 'text-yellow-500/80 dark:text-yellow-300/80' : 
                                       level.value === "Severe" ? 'text-red-500/80 dark:text-red-300/80' : 'text-muted-foreground'
                        }`}>
                          {level.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </RadioGroup>

            <motion.div
              className="flex items-center p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 backdrop-blur-sm rounded-lg mt-6 border border-blue-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 backdrop-blur-sm">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Severity Assessment</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Accurately assessing severity helps determine the appropriate level of care needed
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Additional Information
            </h2>
            <p className="text-muted-foreground">
              Please provide any additional details that might help with the analysis. This could include:
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex items-center"><span className="mr-2">•</span>Recent life changes or stressors</li>
              <li className="flex items-center"><span className="mr-2">•</span>Environmental factors</li>
              <li className="flex items-center"><span className="mr-2">•</span>Recent injuries or accidents</li>
              <li className="flex items-center"><span className="mr-2">•</span>Travel history</li>
              <li className="flex items-center"><span className="mr-2">•</span>Family medical history</li>
              <li className="flex items-center"><span className="mr-2">•</span>Other relevant information</li>
            </ul>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Details</Label>
              <Textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Enter any additional information that might be relevant..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                This information is optional but can help provide more accurate analysis
              </p>
            </div>
            
            <motion.div
              className="flex items-center p-4 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 backdrop-blur-sm rounded-lg border border-indigo-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 backdrop-blur-sm">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Privacy Notice</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  All information provided is processed locally and is not stored on any servers
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      case 6: // Medical History Step
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Medical History
            </h2>
            <p className="text-muted-foreground">
              Providing your medical history helps us give you more accurate analysis.
            </p>
            
            <div className="space-y-6">
              {/* Conditions */}
              <div>
                <Label className="text-lg font-medium mb-2 block">Existing Conditions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commonConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={medicalHistory.conditions.includes(condition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMedicalHistory(prev => ({
                              ...prev,
                              conditions: [...prev.conditions, condition]
                            }));
                          } else {
                            setMedicalHistory(prev => ({
                              ...prev,
                              conditions: prev.conditions.filter(c => c !== condition)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`condition-${condition}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="Other conditions (comma separated)"
                    onChange={(e) => {
                      const otherConditions = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                      setMedicalHistory(prev => ({
                        ...prev,
                        conditions: [...prev.conditions.filter(c => !commonConditions.includes(c)), ...otherConditions]
                      }));
                    }}
                  />
                </div>
              </div>
              
              {/* Medications */}
              <div>
                <Label className="text-lg font-medium mb-2 block">Current Medications</Label>
                <Input
                  placeholder="List your current medications (comma separated)"
                  onChange={(e) => {
                    const medications = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                    setMedicalHistory(prev => ({
                      ...prev,
                      medications
                    }));
                  }}
                />
              </div>
              
              {/* Allergies */}
              <div>
                <Label className="text-lg font-medium mb-2 block">Allergies</Label>
                <Input
                  placeholder="List your allergies (comma separated)"
                  onChange={(e) => {
                    const allergies = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                    setMedicalHistory(prev => ({
                      ...prev,
                      allergies
                    }));
                  }}
                />
              </div>
              
              {/* Family History */}
              <div>
                <Label className="text-lg font-medium mb-2 block">Family Medical History</Label>
                <Input
                  placeholder="List significant conditions in your family (comma separated)"
                  value={familyHistory.join(', ')}
                  onChange={(e) => {
                    const history = e.target.value.split(',').map(h => h.trim()).filter(h => h);
                    setFamilyHistory(history);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include conditions like heart disease, diabetes, cancer, etc.
                </p>
              </div>
            </div>
            
            <motion.div
              className="flex items-center p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 backdrop-blur-sm rounded-lg mt-6 border border-blue-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Privacy Notice</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  All medical information is processed locally and is not stored on any servers
                </p>
              </div>
            </motion.div>
          </div>
        );
      
      case 7: // Review step
        // Get the body part color for consistent styling
        {
          const bodyPart = bodyParts.find(bp => bp.id === selectedBodyPart);
          const gradientClass = bodyPart?.gradient || "from-primary/40 to-primary/20";
          const bgGradientClass = `from-${gradientClass.split('-')[1]}-50/10 to-${gradientClass.split('-')[3]}-50/5`;
          const IconComponent = bodyPart?.icon || LucideStethoscope;
          
          return (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400/80 to-emerald-500/80 text-white mb-4 backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Symptom Assessment Complete</h2>
                  <p className="text-muted-foreground">
                    Review the information you've provided before submitting for analysis.
                  </p>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className={`overflow-hidden border-0 bg-gradient-to-br ${bgGradientClass} backdrop-blur-sm shadow-lg`}>
                  <div className={`h-1.5 bg-gradient-to-r ${gradientClass}`}></div>
                  <CardHeader>
                    <CardTitle>Symptom Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <div className="flex items-center mt-1">
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradientClass} mr-2 flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">
                          {selectedBodyPart ? bodyParts.find(bp => bp.id === selectedBodyPart)?.name : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSymptoms.map(symptom => (
                          <span
                            key={symptom}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gradient-to-r ${gradientClass} text-white`}
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                      <p>{symptomDuration || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Severity</h3>
                      <p>
                        {symptomSeverity ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            symptomSeverity === "Mild" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" :
                            symptomSeverity === "Moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200" :
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          }`}>
                            {symptomSeverity}
                          </span>
                        ) : 'Not specified'}
                      </p>
                    </div>
                    
                    {additionalInfo && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                        <p className="text-sm bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg mt-1">
                          {additionalInfo}
                        </p>
                      </div>
                    )}
                    
                    {medicalHistory.conditions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Medical Conditions</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {medicalHistory.conditions.map(condition => (
                            <span
                              key={condition}
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {familyHistory.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Family Medical History</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {familyHistory.map(condition => (
                            <span
                              key={condition}
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-100/20 to-amber-200/20 dark:from-yellow-900/20 dark:to-amber-800/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      Important Notice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400/80 to-amber-500/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Medical Disclaimer</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This symptom checker is for informational purposes only and is not a qualified medical opinion. 
                          Always consult with a healthcare professional for proper diagnosis and treatment.
                        </p>
                        <p className="text-sm font-medium text-red-500 mt-2">
                          If you're experiencing severe symptoms or a medical emergency, please call emergency services immediately.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Step {step} of {totalSteps}</h2>
        <div className="flex flex-col items-end">
          <Progress value={progress} className="w-[200px]" />
          <span className="text-sm text-muted-foreground mt-1">
            {getStepTitle(step)}
          </span>
        </div>
      </div>

      {renderStepContent()}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={step === 1}
          className="gap-2 shadow-sm hover:shadow transition-all bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-900/70 border-slate-200/50 dark:border-slate-800/50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={() => {
            if (step === totalSteps) {
              handleSubmit();
            } else {
              handleNextStep();
            }
          }}
          disabled={!canProceedToNextStep() || isAnalyzing}
          className={`gap-2 ${
            step === totalSteps 
              ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90' 
              : 'bg-gradient-to-r from-violet-500/90 to-purple-500/90 hover:from-violet-600/90 hover:to-purple-600/90'
          } border-0 shadow-md hover:shadow-lg transition-all backdrop-blur-sm`}
        >
          {step === totalSteps ? (
            <>
              {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
              {isAnalyzing ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}