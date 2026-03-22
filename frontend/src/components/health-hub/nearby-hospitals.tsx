import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Star,
  Navigation,
  Hospital,
  Building,
  CheckCircle,
  Ambulance,
  ExternalLink
} from "lucide-react";
import { HealthcareFacility } from "@/types/healthcare";
import { cn } from "@/lib/utils";
import healthcareData from "@/data/healthcare_data.json";

interface NearbyHospitalsProps {
  className?: string;
}

export function NearbyHospitals({ className }: NearbyHospitalsProps) {
  const [hospitals, setHospitals] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate loading local Excel data
    const timer = setTimeout(() => {
      setHospitals(healthcareData as any[]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse h-40 rounded-3xl border-slate-200 dark:border-slate-800"></Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Healthcare Directory</h2>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 gap-1.5 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900 font-black text-[10px] px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED DATA
          </Badge>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted facilities in Bhubaneswar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="group relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300">
            {/* Ownership Accent */}
            <div className={cn("absolute top-0 left-0 w-2 h-full opacity-60", hospital.ownership === "public" ? "bg-blue-500" : "bg-emerald-500")} />
            
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <CardTitle className="text-lg font-black tracking-tight group-hover:text-teal-600 transition-colors">
                      {hospital.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    {hospital.address.split(',')[0]}
                  </div>
                </div>
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/10 transition-transform group-hover:rotate-6", hospital.ownership === "public" ? "bg-blue-500" : "bg-emerald-500")}>
                  {hospital.ownership === "public" ? (
                    <Building className="w-5 h-5" />
                  ) : (
                    <Hospital className="w-5 h-5" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap gap-2.5 mb-6 text-[11px] font-black">
                <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  {hospital.distance} AWAY
                </Badge>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-amber-100 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/50">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {hospital.rating}
                </div>
                <Badge className={cn("px-2 py-0.5 rounded-lg font-black", hospital.ownership === "public" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-emerald-100 text-emerald-700 border-emerald-200")}>
                  {hospital.ownership.toUpperCase()}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black gap-2 flex-1 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`, '_blank')}
                >
                  <Navigation className="w-4 h-4" />
                  DIRECTIONS
                </Button>
                {hospital.phone && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 w-10 p-0 rounded-2xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95" 
                    onClick={() => window.open(`tel:${hospital.phone}`)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-[32px] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 flex flex-col sm:flex-row items-center gap-4 group">
        <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-transform group-hover:scale-110">
          <Ambulance className="w-7 h-7" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-base font-black text-red-700 dark:text-red-400 uppercase tracking-tight">Need Immediate Assistance?</h3>
          <p className="text-xs font-bold text-red-600/70 dark:text-red-500/60 uppercase tracking-widest mt-1">24/7 National Emergency Helpline · Call 112</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white font-black text-xs h-11 px-8 rounded-2xl shadow-xl active:scale-95 transition-all gap-2" onClick={() => window.open('tel:112')}>
          <Phone className="w-4 h-4" />
          CALL 112
        </Button>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}