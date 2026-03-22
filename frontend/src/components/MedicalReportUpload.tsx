import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReportFile {
  id: string;
  name: string;
  type: "lab" | "mri" | "ct_scan" | "xray";
  uploadedAt: Date;
  status: "uploaded" | "analyzing" | "analyzed";
}

export function MedicalReportUpload() {
  const [files, setFiles] = useState<ReportFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36),
      name: file.name,
      type: "lab" as const,
      uploadedAt: new Date(),
      status: "uploaded" as const,
    }));
    setFiles([...files, ...newFiles]);
  };

  const analyzeReports = async () => {
    if (files.length === 0) return;
    setAnalyzing(true);
    setTimeout(() => {
      setFiles(files.map(f => ({ ...f, status: "analyzed" as const })));
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/20 dark:to-cyan-900/10 border-blue-200/50 dark:border-blue-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600" />
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Upload Medical Reports
        </CardTitle>
        <CardDescription>
          Upload your lab tests, MRI, CT scans, or X-ray reports for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative px-6 py-12 border-2 border-dashed rounded-xl transition-colors",
            dragging
              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
              : "border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10"
          )}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drag and drop your medical reports here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported: PDF, JPG, PNG (Max 10MB each)
            </p>
            <Button variant="outline" className="rounded-full" size="sm">
              <Upload className="w-3 h-3 mr-2" />
              Browse Files
            </Button>
          </div>
        </motion.div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Uploaded Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-blue-200/30 dark:border-blue-800/20"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Image className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.uploadedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  {file.status === "analyzed" && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Analyzed
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <Button
            onClick={analyzeReports}
            disabled={analyzing}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Reports...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Analyze Medical Reports
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
