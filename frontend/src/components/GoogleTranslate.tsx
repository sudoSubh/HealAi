import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

// Indian regional languages with their Google Translate codes and flags
const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'mai', name: 'Maithili', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'sd', name: 'Sindhi', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', flag: '🇮🇳' },
  { code: 'brx', name: 'Bodo', flag: '🇮🇳' },
  { code: 'gom', name: 'Konkani', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', flag: '🇮🇳' },
];

export function GoogleTranslate() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setSelectedLanguage(savedLanguage);
    
    // Check for Google Translate cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('googtrans=')) {
        const lang = cookie.split('/')[2];
        if (lang) {
          setSelectedLanguage(lang);
        }
        break;
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${languageCode}; path=/`;
    document.cookie = `googtrans=/en/${languageCode}; path=/; domain=` + window.location.hostname;
    
    // Try to change the language using Google Translate API
    try {
      // Create a new script element to force reload Google Translate
      const reloadGoogleTranslate = () => {
        // Remove any existing Google Translate elements
        const existingFrame = document.querySelector('iframe.goog-te-banner-frame');
        if (existingFrame) {
          existingFrame.remove();
        }
        
        // Set page language attribute
        document.documentElement.lang = languageCode;
        
        // Force Google Translate to reload with new language
        window.location.reload();
      };
      
      reloadGoogleTranslate();
    } catch (e) {
      console.warn('Failed to change language with Google Translate API, reloading page:', e);
      window.location.reload();
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Select open={isOpen} onOpenChange={setIsOpen} value={selectedLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur border-muted-foreground/20 hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {INDIAN_LANGUAGES.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="cursor-pointer hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}