import { Separator } from "@radix-ui/react-separator";

export function Footer() {
  return (
    <footer className="bg-emerald-800 text-gray-300">
      <div className="border-t border-emerald-600 text-center text-sm px-4 py-4 flex items-center justify-center">
        <p>&copy; {new Date().getFullYear()} HealerAi</p>
        <Separator className=" mx-4 w-[0.1px] h-6 bg-gray-300" orientation="vertical" />
        <p>Made by <a href="" target="_blank" className="text-gray-300 hover:text-emerald-400 transition-colors animate-pulse" rel="noopener noreferrer">Synapse Forge</a></p>
      </div>
    </footer>
  );
}
