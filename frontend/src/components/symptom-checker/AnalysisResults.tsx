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
import { motion } from "framer-motion";

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
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-800/40 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
                          {condition.condition}
                        </CardTitle>
                        <Badge className={`font-bold px-3 py-1 ${
                          condition.probability === "High" ? "bg-red-500/90 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" :
                          condition.probability === "Moderate" ? "bg-amber-500/90 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
                          "bg-emerald-500/90 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        }`}>
                          {condition.probability} Match Match
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-600 dark:text-slate-300 font-medium mt-2">{condition.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 font-medium">
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
                </motion.div>
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
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-2xl group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80" />
                    <CardHeader className="bg-white/40 dark:bg-slate-800/40 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">{impact.factor}</CardTitle>
                      </div>
                      <CardDescription className="ml-[44px]">{impact.impact}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 p-6">
                      <ul className="space-y-2">
                        {impact.recommendations?.map((rec, idx) => (
                          <li key={idx} className="text-sm flex items-start text-slate-700 dark:text-slate-300"><span className="text-blue-500 mr-2 mt-0.5">•</span> {rec}</li>
                        )) || <li className="text-sm">No recommendations provided</li>}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
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
                <motion.div key={index} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                  <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-2xl group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80" />
                    <CardHeader className="bg-white/40 dark:bg-slate-800/40 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">{remedy.type}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                      {remedy.warning && (
                        <Alert variant="destructive" className="mb-4 bg-red-50/50 dark:bg-red-900/20 shadow-sm border-red-200/50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>{remedy.warning}</AlertDescription>
                        </Alert>
                      )}
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{remedy.recommendation || 'No recommendation provided'}</p>
                    </CardContent>
                  </Card>
                </motion.div>
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg rounded-2xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-80" />
                  <CardHeader className="bg-white/40 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>Preventive Measures</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {preventiveMeasures.map((measure, index) => (
                        <li key={index} className="text-sm flex items-start text-slate-700 dark:text-slate-300"><span className="text-blue-500 mr-2 mt-0.5">•</span> {measure}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {followUpRecommendations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg rounded-2xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-400 to-pink-500 opacity-80" />
                  <CardHeader className="bg-white/40 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Follow-up Recommendations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {followUpRecommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start text-slate-700 dark:text-slate-300"><span className="text-purple-500 mr-2 mt-0.5">•</span> {rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {specialistReferrals.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-lg rounded-2xl overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 opacity-80" />
                  <CardHeader className="bg-white/40 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                        <Stethoscope className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle>Specialist Referrals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {specialistReferrals.map((specialist, index) => (
                        <li key={index} className="text-sm flex items-start text-slate-700 dark:text-slate-300"><span className="text-amber-500 mr-2 mt-0.5">•</span> {specialist}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
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