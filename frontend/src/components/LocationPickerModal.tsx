import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationPickerModalProps {
  onConfirm: (city: string, region?: string, country?: string) => void;
}

export function LocationPickerModal({ onConfirm }: LocationPickerModalProps) {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [detectLoading, setDetectLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }
    onConfirm(city, region, country);
  };

  const handleAutoDetect = async () => {
    setDetectLoading(true);
    setError("");
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data?.city) {
        setCity(data.city);
        setRegion(data.region || "");
        setCountry(data.country_name || "");
      } else {
        setError("Could not detect location automatically. Please type your city.");
      }
    } catch {
      setError("Auto-detect failed. Please enter your city manually.");
    } finally {
      setDetectLoading(false);
    }
  };

  const suggestions = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow",
    "New York", "London", "Dubai", "Singapore", "Sydney",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/60 dark:border-slate-700/40"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 px-8 pt-8 pb-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold leading-tight">Where are you located?</h2>
                <p className="text-sm text-teal-100">For personalized health insights</p>
              </div>
            </div>
            <p className="text-sm text-teal-50/90 leading-relaxed">
              HealAI uses your location to generate real-time, location-specific health updates, daily insights, and local health alerts powered by Gemini AI.
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Jaipur, Mumbai, London..."
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setError(""); }}
                  className="rounded-xl border-slate-200 dark:border-slate-700 focus:ring-teal-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    State / Region
                  </label>
                  <Input
                    placeholder="e.g. Rajasthan"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-700 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
                    Country
                  </label>
                  <Input
                    placeholder="e.g. India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-700 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-3">{error}</p>
            )}

            {/* Quick suggestions */}
            <div className="mb-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setCity(s); setError(""); }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      city === s
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-sm"
                onClick={handleAutoDetect}
                disabled={detectLoading}
              >
                {detectLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                Auto-detect
              </Button>
              <Button
                className="flex-1 rounded-xl text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                onClick={handleSubmit}
                disabled={!city.trim()}
              >
                Generate Insights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
              Your location is used only to personalize health content. It is never stored on our servers.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
