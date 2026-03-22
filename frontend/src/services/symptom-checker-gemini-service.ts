import { callGemini } from "./gemini";

// Function to get a random GenerativeAI client to load balance requests
// (kept as a no-op shim to avoid breaking other references)
const getRandomGeminiClient = () => ({});

interface AnalysisData {
  symptoms: string[];
  severity: string;
  duration: string;
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    surgeries: string[];
  };
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
    diet: string;
    stress: string;
    sleep: string;
  };
  recentChanges: string;
  familyHistory: string[];
}

export interface AnalysisResponse {
  conditions: Array<{
    condition: string;
    probability: "High" | "Moderate" | "Low";
    description: string;
    reasoning: string[];
    commonSymptoms: string[];
    riskFactors: string[];
    suggestedTests?: string[];
  }>;
  urgencyLevel: {
    level: "Emergency" | "Urgent" | "Soon" | "Routine";
    reasoning: string[];
    timeframe: string;
  };
  lifestyleImpact: Array<{
    factor: string;
    impact: string;
    recommendations: string[];
  }>;
  remedyRecommendations: Array<{
    type: string;
    warning: string;
    recommendation: string;
  }>;
  preventiveMeasures: string[];
  followUpRecommendations: string[];
  specialistReferrals?: string[];
  redFlags: string[];
  disclaimer: string;
}

// Default fallback response structure
const DEFAULT_ANALYSIS_RESPONSE: AnalysisResponse = {
  conditions: [],
  urgencyLevel: {
    level: "Routine",
    reasoning: ["Insufficient information to determine urgency level."],
    timeframe: "Not specified"
  },
  lifestyleImpact: [],
  remedyRecommendations: [],
  preventiveMeasures: [
    "Maintain a balanced diet",
    "Stay hydrated",
    "Get adequate sleep",
    "Exercise regularly",
    "Manage stress levels"
  ],
  followUpRecommendations: [
    "Monitor symptoms for any changes",
    "Consult with a healthcare provider if symptoms persist or worsen"
  ],
  specialistReferrals: [],
  redFlags: [],
  disclaimer: "This tool provides health information & awareness only. It is not a substitute for professional medical advice, diagnosis, or treatment. The information provided should not be used for self-diagnosis or self-treatment. Always consult with a qualified healthcare provider for any medical concerns. In case of a medical emergency, seek immediate professional help. While we strive to provide accurate information, we make no guarantees about the completeness or accuracy of the content. Use of this tool does not create a doctor-patient relationship. Your health is important - professional medical consultation is always recommended for personalized care. By using this service, you acknowledge and agree to these terms and conditions."
};

const MEDICAL_ANALYSIS_PROMPT = `You are an advanced medical analysis system. Analyze the following patient data and provide a comprehensive medical assessment. 

Patient Data:
Symptoms: {symptoms}
Severity: {severity}
Duration: {duration}
Medical History:
- Conditions: {conditions}
- Medications: {medications}
- Allergies: {allergies}
Lifestyle Factors:
- Smoking: {smoking}
- Alcohol: {alcohol}
- Exercise: {exercise}
- Diet: {diet}
- Stress: {stress}
- Sleep: {sleep}
Recent Changes: {recentChanges}
Family History: {familyHistory}

Provide a detailed analysis focusing on these key areas:

1. Potential Conditions (3-5 conditions)
2. Lifestyle Impact Analysis (at least 4 factors)
3. Remedy Recommendations (at least 3 types) - Focus on natural remedies, home treatments, and lifestyle changes instead of medications
4. Comprehensive Recommendations

Return a detailed JSON response with the following structure:

{
  "conditions": [
    {
      "condition": "Name of condition",
      "probability": "High/Moderate/Low",
      "description": "Detailed description of the condition",
      "reasoning": [
        "Specific symptom matches",
        "Risk factor correlations",
        "Medical history relevance"
      ],
      "riskFactors": [
        "Age-related factors",
        "Lifestyle impacts",
        "Genetic predisposition"
      ],
      "suggestedTests": [
        "Specific diagnostic tests",
        "Lab work recommendations",
        "Imaging studies if relevant"
      ]
    }
  ],
  "urgencyLevel": {
    "level": "Emergency/Urgent/Soon/Routine",
    "reasoning": [
      "Detailed reason for urgency level",
      "Risk factor consideration",
      "Complication potential"
    ],
    "timeframe": "Specific timeframe recommendation"
  },
  "lifestyleImpact": [
    {
      "factor": "Specific lifestyle factor (e.g., Sleep, Exercise, Diet, Stress)",
      "impact": "Detailed description of how this factor affects the condition",
      "recommendations": [
        "Specific actionable change",
        "Practical implementation steps",
        "Expected benefits"
      ]
    }
  ],
  "remedyRecommendations": [
    {
      "type": "Category of remedy (e.g., Herbal remedies, Home treatments, Physical therapy)",
      "warning": "Specific caution or contraindication warning",
      "recommendation": "Detailed remedy guidance focusing on natural treatments, home remedies, and lifestyle changes rather than medications"
    }
  ],
  "preventiveMeasures": [
    "Specific preventive action",
    "Lifestyle modification",
    "Risk reduction strategy"
  ],
  "followUpRecommendations": [
    "Timeframe for follow-up",
    "Type of healthcare provider",
    "Specific monitoring needs"
  ],
  "specialistReferrals": [
    "Specific type of specialist",
    "Reason for referral",
    "Urgency of consultation"
  ],
  "redFlags": [
    "Critical warning signs",
    "Emergency symptoms",
    "When to seek immediate care"
  ],
  "disclaimer": "This tool provides health information & awareness only. It is not a substitute for professional medical advice, diagnosis, or treatment. The information provided should not be used for self-diagnosis or self-treatment. Always consult with a qualified healthcare provider for any medical concerns. In case of a medical emergency, seek immediate professional help. While we strive to provide accurate information, we make no guarantees about the completeness or accuracy of the content. Use of this tool does not create a doctor-patient relationship. Your health is important - professional medical consultation is always recommended for personalized care. By using this service, you acknowledge and agree to these terms and conditions."
}

Ensure each section is thoroughly populated with specific, actionable information based on the provided symptoms and patient data. Focus on practical, evidence-based recommendations and clear explanations. Emphasize natural remedies, home treatments, and lifestyle changes rather than medications. Provide clear warnings where medical consultation is essential.`;

export async function analyzeSymptomsWithGemini(data: AnalysisData): Promise<AnalysisResponse> {
  try {
    const prompt = MEDICAL_ANALYSIS_PROMPT
      .replace("{symptoms}", data.symptoms.join(", "))
      .replace("{severity}", data.severity)
      .replace("{duration}", data.duration)
      .replace("{conditions}", data.medicalHistory.conditions.join(", ") || "None")
      .replace("{medications}", data.medicalHistory.medications.join(", ") || "None")
      .replace("{allergies}", data.medicalHistory.allergies.join(", ") || "None")
      .replace("{smoking}", data.lifestyle.smoking.toString())
      .replace("{alcohol}", data.lifestyle.alcohol)
      .replace("{exercise}", data.lifestyle.exercise)
      .replace("{diet}", data.lifestyle.diet)
      .replace("{stress}", data.lifestyle.stress)
      .replace("{sleep}", data.lifestyle.sleep)
      .replace("{recentChanges}", data.recentChanges || "None reported")
      .replace("{familyHistory}", data.familyHistory.join(", ") || "None reported");

    // Route through the backend proxy
    const text = await callGemini(prompt);

    if (text) {
      try {
        const cleanedText = text
          .replace(/```json\n?|\n?```/g, '')
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/\n\s*/g, ' ')
          .trim();
        
        // Validate that we have a valid JSON response
        const parsedResponse = JSON.parse(cleanedText);
        
        // Validate that the response has the required structure and provide defaults for missing fields
        const validatedResponse: AnalysisResponse = {
          conditions: Array.isArray(parsedResponse.conditions) ? parsedResponse.conditions : DEFAULT_ANALYSIS_RESPONSE.conditions,
          urgencyLevel: parsedResponse.urgencyLevel && typeof parsedResponse.urgencyLevel === 'object' 
            ? {
                level: parsedResponse.urgencyLevel.level || DEFAULT_ANALYSIS_RESPONSE.urgencyLevel.level,
                reasoning: Array.isArray(parsedResponse.urgencyLevel.reasoning) ? parsedResponse.urgencyLevel.reasoning : DEFAULT_ANALYSIS_RESPONSE.urgencyLevel.reasoning,
                timeframe: parsedResponse.urgencyLevel.timeframe || DEFAULT_ANALYSIS_RESPONSE.urgencyLevel.timeframe
              }
            : DEFAULT_ANALYSIS_RESPONSE.urgencyLevel,
          lifestyleImpact: Array.isArray(parsedResponse.lifestyleImpact) ? parsedResponse.lifestyleImpact : DEFAULT_ANALYSIS_RESPONSE.lifestyleImpact,
          remedyRecommendations: Array.isArray(parsedResponse.remedyRecommendations) ? parsedResponse.remedyRecommendations : DEFAULT_ANALYSIS_RESPONSE.remedyRecommendations,
          preventiveMeasures: Array.isArray(parsedResponse.preventiveMeasures) ? parsedResponse.preventiveMeasures : DEFAULT_ANALYSIS_RESPONSE.preventiveMeasures,
          followUpRecommendations: Array.isArray(parsedResponse.followUpRecommendations) ? parsedResponse.followUpRecommendations : DEFAULT_ANALYSIS_RESPONSE.followUpRecommendations,
          specialistReferrals: Array.isArray(parsedResponse.specialistReferrals) ? parsedResponse.specialistReferrals : DEFAULT_ANALYSIS_RESPONSE.specialistReferrals,
          redFlags: Array.isArray(parsedResponse.redFlags) ? parsedResponse.redFlags : DEFAULT_ANALYSIS_RESPONSE.redFlags,
          disclaimer: typeof parsedResponse.disclaimer === 'string' ? parsedResponse.disclaimer : DEFAULT_ANALYSIS_RESPONSE.disclaimer
        };
        
        return validatedResponse;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw AI response:', text);
        // Return a default response with error information
        return {
          ...DEFAULT_ANALYSIS_RESPONSE,
          conditions: [{
            condition: "Analysis Error",
            probability: "Low",
            description: "We encountered an issue processing your symptoms analysis.",
            reasoning: ["The AI service response could not be parsed correctly."],
            commonSymptoms: ["System error", "Processing failure"],
            riskFactors: ["Service unavailability", "Network issues"],
            suggestedTests: ["Retry the analysis", "Check internet connection"]
          }],
          redFlags: ["System error occurred during analysis. Please try again."],
          disclaimer: "An error occurred during analysis. This response is a fallback. Please try again or consult with a healthcare provider for proper diagnosis and treatment."
        };
      }
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error: any) {
    console.error('Error analyzing symptoms with Gemini:', error);
    
    // Provide more specific error messages based on the type of error
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Return a default response with error information
    return {
      ...DEFAULT_ANALYSIS_RESPONSE,
      conditions: [{
        condition: "Connection Error",
        probability: "Low",
        description: "We encountered an issue connecting to the analysis service.",
        reasoning: [errorMessage],
        commonSymptoms: ["Connection failure", "Service unavailable"],
        riskFactors: ["Network issues", "Service downtime"],
        suggestedTests: ["Check internet connection", "Retry the analysis"]
      }],
      redFlags: [`Connection error: ${errorMessage}`],
      disclaimer: `An error occurred during analysis: ${errorMessage}. This response is a fallback. Please try again or consult with a healthcare provider for proper diagnosis and treatment.`
    };
  }
}
