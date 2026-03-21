import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, Shield, Printer, 
  AlertTriangle, Heart, Stethoscope, Calendar, 
  Leaf, Siren, MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { AnalysisResponse } from "@/services/symptom-checker-gemini-service";
import { useNavigate } from "react-router-dom";

interface AnalysisResultsProps {
  data: AnalysisResponse | null | undefined;
  onReset: () => void;
}

// Helper function to validate the analysis response
const isValidAnalysisResponse = (data: any): data is AnalysisResponse => {
  return (
    data &&
    typeof data === 'object' &&
    data.urgencyLevel &&
    typeof data.urgencyLevel === 'object' &&
    data.urgencyLevel.level &&
    Array.isArray(data.conditions) &&
    Array.isArray(data.redFlags)
  );
};

export function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  const navigate = useNavigate();

  // Handle case where data is null, undefined, or missing urgencyLevel
  if (!data || !data.urgencyLevel) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
              <div>
                <h3 className="text-lg font-semibold">Analysis Error</h3>
                <p className="text-muted-foreground mt-2">
                  We encountered an issue with the analysis results. This could be due to incomplete data, a network error, or processing issue.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Possible solutions:
                  </p>
                  <ul className="text-sm text-left text-muted-foreground space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Try submitting your symptoms again</li>
                    <li>• Simplify your symptom description</li>
                  </ul>
                </div>
                <Button onClick={onReset} className="mt-6">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrintReport = () => {
    const report = `
MEDICAL ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

URGENCY LEVEL: ${data.urgencyLevel.level}
Timeframe: ${data.urgencyLevel.timeframe}
${data.urgencyLevel.reasoning?.map(r => `- ${r}`).join('\n') || 'No reasoning provided'}

POTENTIAL CONDITIONS
${data.conditions?.map(c => `
${c.condition} (${c.probability} Probability)
Description: ${c.description}
Reasoning:
${c.reasoning?.map(r => `- ${r}`).join('\n') || 'No reasoning provided'}
Risk Factors:
${c.riskFactors?.map(r => `- ${r}`).join('\n') || 'No risk factors provided'}
${c.suggestedTests ? `\nSuggested Tests:\n${c.suggestedTests.map(t => `- ${t}`).join('\n')}` : ''}
${c.commonSymptoms ? `\nCommon Symptoms:\n${c.commonSymptoms.map(s => `- ${s}`).join('\n')}` : ''}
`).join('\n') || 'No conditions provided'}

LIFESTYLE IMPACT ANALYSIS
${data.lifestyleImpact?.map(l => `
${l.factor}:
Impact: ${l.impact}
Recommendations:
${l.recommendations?.map(r => `- ${r}`).join('\n') || 'No recommendations provided'}
`).join('\n') || 'No lifestyle impact analysis provided'}

REMEDY RECOMMENDATIONS
${data.remedyRecommendations?.map(m => `
${m.type}:
Warning: ${m.warning}
Recommendation: ${m.recommendation}
`).join('\n') || 'No remedy recommendations provided'}

PREVENTIVE MEASURES
${data.preventiveMeasures?.map(m => `- ${m}`).join('\n') || 'No preventive measures provided'}

FOLLOW-UP RECOMMENDATIONS
${data.followUpRecommendations?.map(r => `- ${r}`).join('\n') || 'No follow-up recommendations provided'}

${data.specialistReferrals?.length ? `\nSPECIALIST REFERRALS\n${data.specialistReferrals.map(s => `- ${s}`).join('\n')}` : ''}

⚠️ RED FLAGS - IMPORTANT WARNINGS
${data.redFlags?.map(r => `- ${r}`).join('\n') || 'No red flags identified'}

DISCLAIMER
${data.disclaimer || 'No disclaimer provided'}
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Analysis Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                padding: 40px;
                white-space: pre-wrap;
              }
              h1, h2 { color: #2563eb; }
              .warning { color: #dc2626; }
              .section { margin: 20px 0; }
              .disclaimer {
                margin-top: 20px;
                padding: 10px;
                background: #fee2e2;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>${report}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleFindNearbyFacilities = () => {
    navigate(`/resources`);
  };

  // Return a comprehensive disclaimer that protects the app while serving its purpose
  const getDisclaimer = () => {
    return "This tool provides health information, disease awareness and preventive measures for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. The information provided should not be used for self-diagnosis or self-treatment. Always consult with a qualified healthcare provider for any medical concerns. In case of a medical emergency, seek immediate professional help. While we strive to provide accurate information, we make no guarantees about the completeness or accuracy of the content. Use of this tool does not create a doctor-patient relationship. Your health is important - professional medical consultation is always recommended for personalized care. By using this service, you acknowledge and agree to these terms and conditions.";
  };

  // Safely access data properties with fallbacks
  const conditions = data.conditions || [];
  const lifestyleImpact = data.lifestyleImpact || [];
  const remedyRecommendations = data.remedyRecommendations || [];
  const preventiveMeasures = data.preventiveMeasures || [];
  const followUpRecommendations = data.followUpRecommendations || [];
  const specialistReferrals = data.specialistReferrals || [];
  const redFlags = data.redFlags || [];

  // Check for error conditions in the response
  const isErrorCondition = data.conditions.some(condition => 
    condition.condition.includes("Error") || 
    condition.condition.includes("Connection")
  );

  if (isErrorCondition) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-500">Analysis Failed</h3>
                <p className="text-muted-foreground mt-2">
                  {data.conditions[0]?.reasoning?.[0] || "An unknown error occurred during analysis."}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Possible solutions:
                  </p>
                  <ul className="text-sm text-left text-muted-foreground space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Try submitting your symptoms again</li>
                    <li>• Simplify your symptom description</li>
                    <li>• Wait a few minutes and try again</li>
                  </ul>
                </div>
                <Button onClick={onReset} className="mt-6">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Notice</AlertTitle>
          <AlertDescription>{getDisclaimer()}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant={data.urgencyLevel.level === "Emergency" ? "destructive" : "default"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Urgency Level: {data.urgencyLevel.level}</AlertTitle>
        <AlertDescription>
          {data.urgencyLevel.timeframe}
          <ul className="mt-2 space-y-1">
            {data.urgencyLevel.reasoning?.map((reason, index) => (
              <li key={index}>• {reason}</li>
            )) || <li>No reasoning provided</li>}
          </ul>
        </AlertDescription>
      </Alert>

      {redFlags.length > 0 && (
        <Alert variant="destructive">
          <Siren className="h-4 w-4" />
          <AlertTitle>Important Warning Signs</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {redFlags.map((flag, index) => (
                <li key={index}>• {flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="conditions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="remedies">Remedies</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions">
          <div className="space-y-4">
            {conditions.length > 0 ? (
              conditions.map((condition, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{condition.condition}</CardTitle>
                      <Badge className={
                        condition.probability === "High" ? "bg-red-500 hover:bg-red-600 text-white" :
                        condition.probability === "Moderate" ? "bg-yellow-500 hover:bg-yellow-600 text-white" :
                        "bg-green-500 hover:bg-green-600 text-white"
                      }>
                        {condition.probability} Probability
                      </Badge>
                    </div>
                    <CardDescription>{condition.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Reasoning</h4>
                        <ul className="space-y-1">
                          {condition.reasoning?.map((reason, idx) => (
                            <li key={idx} className="text-sm">• {reason}</li>
                          )) || <li className="text-sm">No reasoning provided</li>}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {condition.riskFactors?.map((factor, idx) => (
                            <Badge key={idx} variant="outline">{factor}</Badge>
                          )) || <span className="text-sm text-muted-foreground">No risk factors provided</span>}
                        </div>
                      </div>
                      {condition.suggestedTests && condition.suggestedTests.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Suggested Tests</h4>
                          <ul className="space-y-1">
                            {condition.suggestedTests.map((test, idx) => (
                              <li key={idx} className="text-sm">• {test}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {condition.commonSymptoms && condition.commonSymptoms.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Common Symptoms</h4>
                          <ul className="space-y-1">
                            {condition.commonSymptoms.map((symptom, idx) => (
                              <li key={idx} className="text-sm">• {symptom}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No conditions identified</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lifestyle">
          <div className="space-y-4">
            {lifestyleImpact.length > 0 ? (
              lifestyleImpact.map((impact, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      <CardTitle>{impact.factor}</CardTitle>
                    </div>
                    <CardDescription>{impact.impact}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {impact.recommendations?.map((rec, idx) => (
                        <li key={idx} className="text-sm">• {rec}</li>
                      )) || <li className="text-sm">No recommendations provided</li>}
                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No lifestyle impact analysis available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="remedies">
          <div className="space-y-4">
            {remedyRecommendations.length > 0 ? (
              remedyRecommendations.map((remedy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      <CardTitle>{remedy.type}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>{remedy.warning || 'No warning provided'}</AlertDescription>
                    </Alert>
                    <p className="text-sm">{remedy.recommendation || 'No recommendation provided'}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No remedy recommendations available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {preventiveMeasures.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Preventive Measures</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {preventiveMeasures.map((measure, index) => (
                      <li key={index} className="text-sm">• {measure}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {followUpRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle>Follow-up Recommendations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {followUpRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm">• {rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {specialistReferrals.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    <CardTitle>Specialist Referrals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {specialistReferrals.map((specialist, index) => (
                      <li key={index} className="text-sm">• {specialist}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {preventiveMeasures.length === 0 && 
             followUpRecommendations.length === 0 && 
             specialistReferrals.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No additional recommendations available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button className="w-full" onClick={handlePrintReport}>
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
        <Button 
          variant="default" 
          className="w-full"
          onClick={handleFindNearbyFacilities}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Find Nearby Facilities
        </Button>
        <Button variant="outline" className="w-full" onClick={onReset}>
          Check New Symptoms
        </Button>
      </div>

      <Alert className="border-amber-500/50 bg-amber-500/5 rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-500/80"></div>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <AlertTitle className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Medical Disclaimer
              </AlertTitle>
              <AlertDescription className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1">
                {data.disclaimer || getDisclaimer()}
              </AlertDescription>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}