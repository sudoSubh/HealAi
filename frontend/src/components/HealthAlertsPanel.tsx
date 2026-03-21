import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ExternalLink,
  X,
  Bell,
  Info,
  Users,
  Activity,
  WifiOff,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { HealthAlert, HealthAlertsService } from "@/services/healthAlerts";
import { GeneralHealthData, HealthUpdatesService } from "@/services/healthUpdates";

interface HealthAlertsPanelProps {
  className?: string;
}

export function HealthAlertsPanel({ className }: HealthAlertsPanelProps) {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [generalHealthData, setGeneralHealthData] = useState<GeneralHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      // Fetch real data from government health APIs
      const [fetchedAlerts, fetchedGeneralData] = await Promise.all([
        HealthAlertsService.getActiveAlerts(),
        HealthUpdatesService.getBhubaneswarHealthData()
      ]);
      
      setAlerts(fetchedAlerts);
      setGeneralHealthData(fetchedGeneralData);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Fetch fresh data using the new refresh method
      const { alerts: fetchedAlerts } = await HealthAlertsService.refreshHealthAlerts();
      const fetchedGeneralData = await HealthUpdatesService.refreshHealthUpdates();
      
      setAlerts(fetchedAlerts);
      setGeneralHealthData(fetchedGeneralData);
    } catch (error) {
      console.error('Error refreshing health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Critical Alerts Banner */}
      {alerts.some(alert => alert.severity === 'critical') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Critical Health Alert
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {alerts.find(alert => alert.severity === 'critical')?.title}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => setSelectedAlert(alerts.find(alert => alert.severity === 'critical') || null)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Alerts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Health Alerts
                <Badge variant="secondary" className="ml-auto">
                  {alerts.length} Active
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No Real-Time Health Alerts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Currently, no real-time health alerts are available from government sources for Odisha.
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      This system only displays verified real-time alerts from official government health departments.
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
                  <div className="space-y-3">
                    {alerts.slice(0, showAll ? alerts.length : 3).map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          HealthAlertsService.getSeverityColor(alert.severity)
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {alert.title}
                            </h4>
                            <p className="text-xs opacity-80 line-clamp-2 mt-1">
                              {alert.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs">{alert.location}</span>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs capitalize"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {alerts.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `View All ${alerts.length} Alerts`}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* General Disease Awareness */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Disease Awareness
                <Badge variant="secondary" className="ml-auto">
                  {generalHealthData?.diseaseAwareness?.length || 0} Topics
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                {!generalHealthData || generalHealthData.diseaseAwareness.length === 0 ? (
                  <div className="text-center py-8">
                    <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No Disease Awareness Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Currently, no disease awareness information is available.
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      This system monitors official government health departments for disease awareness notifications.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open("https://health.gov/", "_blank")}
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
                    {generalHealthData.diseaseAwareness.map((disease: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-sm">{disease.diseaseName}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" />
                              General Area
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-blue-600">
                              {disease.casesReported} Cases
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Reported
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="font-medium text-xs mb-1 flex items-center">
                            <Activity className="w-3 h-3 mr-1" />
                            Key Symptoms
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {disease.symptoms.slice(0, 3).map((symptom: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs py-0.5">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <h5 className="font-medium text-xs mb-1 flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Prevention Tips
                          </h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {disease.preventionTips.slice(0, 2).map((tip: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Updated {new Date(disease.lastUpdated).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            Learn More
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* General Health Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Health Updates
              <Badge variant="secondary" className="ml-auto">
                {generalHealthData?.updates?.length || 0} Updates
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60">
              {!generalHealthData || generalHealthData.updates.length === 0 ? (
                <div className="text-center py-8">
                  <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Health Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Currently, no health updates are available.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generalHealthData.updates.slice(0, 5).map((update: any, index: number) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-lg border bg-card hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {update.priority === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : update.priority === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          ) : update.category === 'advisory' ? (
                            <Bell className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Info className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {update.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {update.summary}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {update.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(update.url, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Detail Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(selectedAlert.severity)}
                    <div>
                      <h2 className="text-xl font-semibold">{selectedAlert.title}</h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {selectedAlert.location}
                        <Badge className={HealthAlertsService.getSeverityColor(selectedAlert.severity)}>
                          {selectedAlert.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAlert(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedAlert.description}</p>
                  </div>

                  {selectedAlert.actionRequired && (
                    <div>
                      <h3 className="font-semibold mb-2">Action Required</h3>
                      <p className="text-muted-foreground">{selectedAlert.actionRequired}</p>
                    </div>
                  )}

                  {selectedAlert.symptoms && selectedAlert.symptoms.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Symptoms to Watch For</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedAlert.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAlert.preventionTips && selectedAlert.preventionTips.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Prevention Tips</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedAlert.preventionTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAlert.affectedAreas && selectedAlert.affectedAreas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Affected Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAlert.affectedAreas.map((area, index) => (
                          <Badge key={index} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Source:</span>
                      <p className="text-muted-foreground">{selectedAlert.source}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">
                        {new Date(selectedAlert.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedAlert.relatedLinks && selectedAlert.relatedLinks.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Related Resources</h3>
                      <div className="space-y-2">
                        {selectedAlert.relatedLinks.map((link, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            asChild
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {link.title}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}