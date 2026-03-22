import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  bloodGroup: string;
}

const EMPTY: UserProfile = {
  name: "",
  age: "",
  gender: "male",
  height: "",
  weight: "",
  medicalConditions: [],
  allergies: [],
  medications: [],
  bloodGroup: "",
};

function loadProfile(): UserProfile {
  try {
    return JSON.parse(localStorage.getItem("userProfile") || "null") ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

interface UserProfileComponentProps {
  onChange?: (profile: UserProfile) => void;
}

export function UserProfileComponent({ onChange }: UserProfileComponentProps) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMed, setNewMed] = useState("");

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    onChange?.(profile);
  }, [profile]);

  const save = () => {
    setProfile(draft);
    setEditing(false);
  };

  const field = (label: string, key: keyof UserProfile, type = "text", placeholder = "") => (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input
        type={type}
        value={draft[key] as string}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        placeholder={placeholder || label}
        className="mt-1 h-9 rounded-lg text-sm"
      />
    </div>
  );

  const tagList = (
    items: string[],
    setter: (v: string[]) => void,
    newVal: string,
    setNew: (v: string) => void,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1">
            {item}
            {editing && (
              <button onClick={() => setter(items.filter((_, idx) => idx !== i))}>
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2">
          <Input
            value={newVal}
            onChange={(e) => setNew(e.target.value)}
            placeholder={placeholder}
            className="h-8 rounded-lg text-xs flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newVal.trim()) {
                setter([...items, newVal.trim()]);
                setNew("");
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 rounded-lg"
            onClick={() => {
              if (newVal.trim()) {
                setter([...items, newVal.trim()]);
                setNew("");
              }
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );

  const hasData = profile.name || profile.age || profile.medicalConditions.length > 0;

  return (
    <Card className="bg-gradient-to-br from-violet-50/50 to-purple-50/30 dark:from-violet-900/20 dark:to-purple-900/10 border-violet-200/50 dark:border-violet-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-600" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <div>
              <CardTitle className="text-foreground">Health Profile</CardTitle>
              <CardDescription>Your personal health information</CardDescription>
            </div>
          </div>
          {!editing ? (
            <Button variant="ghost" size="sm" onClick={() => { setDraft(profile); setEditing(true); }} className="rounded-full gap-1">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="rounded-full">
                <X className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" onClick={save} className="rounded-full bg-violet-600 hover:bg-violet-700 text-white gap-1">
                <Save className="w-3.5 h-3.5" /> Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {field("Full Name", "name", "text", "Your name")}
              {field("Age", "age", "number", "Age")}
              {field("Height (cm)", "height", "number", "e.g. 170")}
              {field("Weight (kg)", "weight", "number", "e.g. 65")}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Gender</label>
                <select
                  value={draft.gender}
                  onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                  className="mt-1 w-full h-9 px-3 rounded-lg border border-input bg-background text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Blood Group</label>
                <select
                  value={draft.bloodGroup}
                  onChange={(e) => setDraft({ ...draft, bloodGroup: e.target.value })}
                  className="mt-1 w-full h-9 px-3 rounded-lg border border-input bg-background text-sm"
                >
                  <option value="">Unknown</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Medical Conditions</p>
              {tagList(draft.medicalConditions, (v) => setDraft({ ...draft, medicalConditions: v }), newCondition, setNewCondition, "Add condition + Enter")}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Allergies</p>
              {tagList(draft.allergies, (v) => setDraft({ ...draft, allergies: v }), newAllergy, setNewAllergy, "Add allergy + Enter")}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Current Medications</p>
              {tagList(draft.medications, (v) => setDraft({ ...draft, medications: v }), newMed, setNewMed, "Add medication + Enter")}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!hasData ? (
              <div className="text-center py-6">
                <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No profile saved yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Click Edit to add your health information.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Name", value: profile.name },
                    { label: "Age", value: profile.age ? `${profile.age} yrs` : "" },
                    { label: "Gender", value: profile.gender },
                    { label: "Height", value: profile.height ? `${profile.height} cm` : "" },
                    { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "" },
                    { label: "Blood Group", value: profile.bloodGroup },
                  ].filter(i => i.value).map(({ label, value }) => (
                    <div key={label} className="p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/30 border border-violet-200/30">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                {profile.medicalConditions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Medical Conditions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.medicalConditions.map((c) => (
                        <Badge key={c} className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.allergies.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Allergies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.allergies.map((a) => (
                        <Badge key={a} className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.medications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Medications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.medications.map((m) => (
                        <Badge key={m} variant="outline">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
