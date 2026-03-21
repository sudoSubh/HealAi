import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Syringe, Baby, Calendar, AlertTriangle, Info, Users, Globe } from "lucide-react";

export default function Vaccinations() {
  const schedules = [
    {
      title: "Infants & Children (0-6 years)",
      icon: Baby,
      color: "bg-blue-100 text-blue-700",
      items: [
        "BCG at birth",
        "OPV at birth, 6, 10, 14 weeks",
        "Pentavalent (DPT-HepB-Hib) at 6, 10, 14 weeks",
        "MR at 9-12 months and 16-24 months",
        "JE in endemic districts as per NVBDCP guidance",
      ],
    },
    {
      title: "Adolescents (7-18 years)",
      icon: Users,
      color: "bg-emerald-100 text-emerald-700",
      items: [
        "Td at 10 years and 16 years",
        "HPV (girls) per national/State program guidance",
      ],
    },
    {
      title: "Adults & Older Adults",
      icon: Globe,
      color: "bg-amber-100 text-amber-700",
      items: [
        "Annual influenza for elderly/at-risk",
        "Td booster every 10 years",
        "COVID-19 per current MoHFW advisories",
      ],
    },
  ];

  const tips = [
    {
      title: "Before vaccination",
      points: [
        "Carry previous immunization records",
        "Inform provider about allergies/illness",
        "Ensure the vial is from a cold-chain compliant facility",
      ],
    },
    {
      title: "After vaccination",
      points: [
        "Wait 30 minutes for observation",
        "Mild fever/pain is common; use cold compress & fluids",
        "Seek care for high fever, rash, breathing difficulty",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <Syringe className="w-6 h-6 mr-2 text-primary" /> Vaccinations & Immunization
          </h1>
          <p className="text-muted-foreground mt-2">General awareness based on India’s Universal Immunization Programme (UIP). Always follow your doctor and MoHFW/State advisories.</p>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" /> Why vaccines matter
            </CardTitle>
            <CardDescription>Vaccines protect individuals and communities by preventing serious diseases and outbreaks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-primary/5 border">
              <div className="text-sm font-medium">Community protection</div>
              <p className="text-sm text-muted-foreground mt-1">Higher coverage reduces spread to infants, elderly, and immunocompromised.</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border">
              <div className="text-sm font-medium">Prevents severe illness</div>
              <p className="text-sm text-muted-foreground mt-1">Lowers chances of hospitalization, complications, and long-term effects.</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border">
              <div className="text-sm font-medium">Safe & monitored</div>
              <p className="text-sm text-muted-foreground mt-1">Approved vaccines undergo rigorous trials and ongoing safety monitoring.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" /> Recommended schedules (overview)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schedules.map((s, idx) => (
              <Card key={idx} className="rounded-3xl">
                <div className={`h-2 bg-gradient-to-r from-primary to-primary/70`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">{s.title}</div>
                      <Badge variant="secondary" className="mt-1">UIP India</Badge>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-sm text-foreground space-y-1">
                    {s.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" /> Eligibility, access, and documentation
            </CardTitle>
            <CardDescription>General guidance; check local government health facilities for availability.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-semibold">Where to get vaccinated</div>
              <p className="text-sm text-muted-foreground mt-1">Government PHCs/CHCs, Anganwadi/Immunization outreach, and accredited private facilities.</p>
            </div>
            <div>
              <div className="font-semibold">What to carry</div>
              <p className="text-sm text-muted-foreground mt-1">ID proof, child’s Mother-Child Protection (MCP) card, previous records, and prescriptions if any.</p>
            </div>
            <div>
              <div className="font-semibold">Special groups</div>
              <p className="text-sm text-muted-foreground mt-1">Pregnant women, elderly, and people with chronic conditions should consult their doctor for tailored schedules.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-primary" /> Common side effects vs. emergencies
            </CardTitle>
            <CardDescription>Most side effects are mild and resolve in 1-2 days.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-muted border">
              <div className="font-semibold">Common and mild</div>
              <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>Pain/redness at injection site</li>
                <li>Low-grade fever, fatigue</li>
                <li>Body ache, headache</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-muted border">
              <div className="font-semibold">Seek urgent care for</div>
              <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1 mt-2">
                <li>Difficulty breathing, swelling of face/throat</li>
                <li>High fever not responding to medicines</li>
                <li>Severe rash, persistent vomiting, seizures</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="rounded-full">Find nearest immunization center</Button>
          <p className="text-xs text-muted-foreground mt-2">Use your local health department portal or call national helplines for guidance.</p>
        </div>
      </div>
    </div>
  );
}


