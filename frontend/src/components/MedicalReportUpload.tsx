import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ImageIcon, Loader2, CheckCircle2, Trash2, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { callGemini } from "@/services/gemini";
import ReactMarkdown from "react-markdown";

export interface ReportFile {
  id: string;
  name: string;
  size: number;
  base64: string;
  mimeType: string;
  uploadedAt: string;
  status: "uploaded" | "analyzing" | "analyzed" | "error";
  analysisResult?: string;
}

interface MedicalReportUploadProps {
  onAnalysisComplete?: (files: ReportFile[]) => void;
}

export function MedicalReportUpload({ onAnalysisComplete }: MedicalReportUploadProps) {
  const [files, setFiles] = useState<ReportFile[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("medicalReports") || "[]");
    } catch {
      return [];
    }
  });
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("medicalReports", JSON.stringify(files));
  }, [files]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (fileList: FileList) => {
    const incoming: ReportFile[] = [];
    for (const file of Array.from(fileList)) {
      const base64 = await toBase64(file);
      incoming.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        base64,
        mimeType: file.type || "image/jpeg",
        uploadedAt: new Date().toISOString(),
        status: "uploaded",
      });
    }
    setFiles((prev) => [...prev, ...incoming]);
  };

  const analyzeFile = async (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "analyzing" } : f))
    );
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    try {
      const prompt = `You are a medical AI assistant. Analyze this medical report/scan image thoroughly.
Provide a structured analysis with:
1. **Report Type** (lab test / MRI / CT scan / X-ray)
2. **Key Findings** - list all abnormal or notable values
3. **Normal Values** - values within normal range
4. **Conditions Detected or Suspected**
5. **Severity Level** (Normal / Mild / Moderate / Severe)
6. **Immediate Actions Recommended**
7. **Follow-up Required** (Yes/No + reason)

Be precise, use medical terminology but also provide plain-language explanations.`;

      const result = await callGemini(prompt, file.base64, file.mimeType, "report-analyzer");
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "analyzed", analysisResult: result } : f
        )
      );
      const updatedFiles = files.map((f) =>
        f.id === fileId ? { ...f, status: "analyzed" as const, analysisResult: result } : f
      );
      onAnalysisComplete?.(updatedFiles);
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", analysisResult: "Analysis failed. Please try again." }
            : f
        )
      );
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/20 dark:to-cyan-900/10 border-blue-200/50 dark:border-blue-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600" />
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Microscope className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Upload Medical Reports
        </CardTitle>
        <CardDescription>
          Upload lab tests, MRI, CT scans, or X-rays — AI will analyze and extract key findings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop zone */}
        <div
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "relative px-6 py-12 border-2 border-dashed rounded-xl transition-all cursor-pointer",
            dragging
              ? "border-blue-500 bg-blue-100/50 dark:bg-blue-900/40 scale-[1.01]"
              : "border-blue-200/60 dark:border-blue-700/40 bg-blue-50/40 dark:bg-blue-900/10 hover:border-blue-400"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="text-center pointer-events-none">
            <Upload className="w-8 h-8 mx-auto mb-3 text-blue-500 dark:text-blue-400" />
            <p className="text-sm font-semibold text-foreground mb-1">
              Drag and drop your reports, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports images (JPG, PNG) and PDFs — up to 20 MB each
            </p>
          </div>
        </div>

        {/* File list */}
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-xl border border-blue-200/40 dark:border-blue-800/30 bg-white/60 dark:bg-slate-800/40 overflow-hidden"
            >
              {/* File header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    {file.mimeType.startsWith("image") ? (
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {file.status === "uploaded" && (
                    <Button
                      size="sm"
                      className="rounded-full h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => analyzeFile(file.id)}
                    >
                      Analyze
                    </Button>
                  )}
                  {file.status === "analyzing" && (
                    <Badge className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing…
                    </Badge>
                  )}
                  {file.status === "analyzed" && (
                    <Badge className="rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                    </Badge>
                  )}
                  {file.status === "error" && (
                    <Badge className="rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      Error
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 p-0"
                    onClick={() => removeFile(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Analysis result */}
              <AnimatePresence>
                {file.analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/30 p-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">AI Analysis</p>
                      <div className="text-sm text-foreground leading-relaxed">
                        <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                          {file.analysisResult}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {files.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-2">
            No reports uploaded yet. Upload your first report above.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
