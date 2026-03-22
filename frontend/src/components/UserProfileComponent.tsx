import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Heart, Activity, Calendar, Edit2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  recentReports: string[];
}

const defaultProfile: UserProfile = {
  name: "",
  email: "",
  age: 0,
  gender: "male",
  medicalConditions: [],
  allergies: [],
  medications: [],
  recentReports: [],
};

export function UserProfileComponent() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile(profile);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    localStorage.setItem("userProfile", JSON.stringify(tempProfile));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 border-purple-200/50 dark:border-purple-800/30 shadow-lg rounded-2xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            <div>
              <CardTitle className="text-foreground">User Profile</CardTitle>
              <CardDescription>Your health information and records</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit} className="rounded-full">
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input
                  value={tempProfile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your name"
                  className="mt-1 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Age</label>
                <Input
                  type="number"
                  value={tempProfile.age}
                  onChange={(e) => handleInputChange("age", parseInt(e.target.value))}
                  placeholder="Age"
                  className="mt-1 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  value={tempProfile.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Medical Conditions</label>
              <Input
                value={tempProfile.medicalConditions.join(", ")}
                onChange={(e) => handleInputChange("medicalConditions", e.target.value.split(", "))}
                placeholder="Diabetes, Hypertension (comma-separated)"
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Allergies</label>
              <Input
                value={tempProfile.allergies.join(", ")}
                onChange={(e) => handleInputChange("allergies", e.target.value.split(", "))}
                placeholder="Peanuts, Penicillin (comma-separated)"
                className="mt-1 rounded-lg"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} className="rounded-full">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.name && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">{profile.name}</p>
                </motion.div>
              )}
              {profile.email && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{profile.email}</p>
                </motion.div>
              )}
              {profile.age > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="text-sm font-medium text-foreground">{profile.age} years</p>
                </motion.div>
              )}
              {profile.medicalConditions.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-muted-foreground">Medical Conditions</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.medicalConditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
