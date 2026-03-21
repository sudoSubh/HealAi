import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="search"
        placeholder="Search symptoms, resources, or health topics..."
        className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
      />
    </div>
  );
}