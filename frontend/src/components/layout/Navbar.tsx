import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-600 text-white p-2 rounded-lg font-bold text-lg">
                HN
              </div>
              <span className="text-xl font-bold text-emerald-600">HealerAi</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/education" >
            <Button variant="outline">
              Education
            </Button>
            </Link>

            

            <Link
              to="/medical-bot"
              className="flex items-center gap-2"
              >
            <Button variant="outline" size="icon" className="rounded-full">
              <Bot className="w-5 h-5" />
              </Button>
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}