import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Search for health videos, courses, and topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-12 pr-12 py-6 text-base rounded-full shadow-lg focus:shadow-xl transition-shadow"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <Search className="h-5 w-5" />
      </div>
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      <Button type="submit" className="sr-only">
        Search
      </Button>
    </form>
  );
}