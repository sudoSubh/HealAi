import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, AlertTriangle, Trash2, ThumbsUp, ThumbsDown, Mic, Image as ImageIcon, History, ChevronDown, Volume2, Square, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import { generateMedicalResponse, generateMedicalResponseWithImage } from "@/services/medical-bot-fallback-service";

// Import franc-min at the top level
import { franc } from 'franc-min';

// Language mapping
const LANGUAGE_MAP: Record<string, { name: string; code: string }> = {
  'eng': { name: 'English', code: 'en' },
  'hin': { name: 'Hindi', code: 'hi' },
  'ben': { name: 'Bengali', code: 'bn' },
  'tel': { name: 'Telugu', code: 'te' },
  'mar': { name: 'Marathi', code: 'mr' },
  'tam': { name: 'Tamil', code: 'ta' },
  'urd': { name: 'Urdu', code: 'ur' },
  'guj': { name: 'Gujarati', code: 'gu' },
  'kan': { name: 'Kannada', code: 'kn' },
  'ori': { name: 'Odia', code: 'or' },
  'mal': { name: 'Malayalam', code: 'ml' },
  'pan': { name: 'Punjabi', code: 'pa' },
  'asm': { name: 'Assamese', code: 'as' },
  'nep': { name: 'Nepali', code: 'ne' },
  'san': { name: 'Sanskrit', code: 'sa' },
  'spa': { name: 'Spanish', code: 'es' },
  'fra': { name: 'French', code: 'fr' },
  'deu': { name: 'German', code: 'de' },
  'ita': { name: 'Italian', code: 'it' },
  'por': { name: 'Portuguese', code: 'pt' },
  'rus': { name: 'Russian', code: 'ru' },
  'jpn': { name: 'Japanese', code: 'ja' },
  'kor': { name: 'Korean', code: 'ko' },
  'ara': { name: 'Arabic', code: 'ar' },
  'tur': { name: 'Turkish', code: 'tr' },
  'pol': { name: 'Polish', code: 'pl' },
  'ukr': { name: 'Ukrainian', code: 'uk' },
  'vie': { name: 'Vietnamese', code: 'vi' },
  'ind': { name: 'Indonesian', code: 'id' },
  'tha': { name: 'Thai', code: 'th' },
  'msa': { name: 'Malay', code: 'ms' },
  'fil': { name: 'Filipino', code: 'fil' },
  'zho': { name: 'Chinese', code: 'zh' },
  'fas': { name: 'Persian', code: 'fa' },
  'swa': { name: 'Swahili', code: 'sw' },
  'afr': { name: 'Afrikaans', code: 'af' },
  'sqi': { name: 'Albanian', code: 'sq' },
  'amh': { name: 'Amharic', code: 'am' },
  'hye': { name: 'Armenian', code: 'hy' },
  'aze': { name: 'Azerbaijani', code: 'az' },
  'eus': { name: 'Basque', code: 'eu' },
  'bel': { name: 'Belarusian', code: 'be' },
  'bul': { name: 'Bulgarian', code: 'bg' },
  'mya': { name: 'Burmese', code: 'my' },
  'cat': { name: 'Catalan', code: 'ca' },
  'hrv': { name: 'Croatian', code: 'hr' },
  'ces': { name: 'Czech', code: 'cs' },
  'dan': { name: 'Danish', code: 'da' },
  'nld': { name: 'Dutch', code: 'nl' },
  'epo': { name: 'Esperanto', code: 'eo' },
  'est': { name: 'Estonian', code: 'et' },
  'fin': { name: 'Finnish', code: 'fi' },
  'glg': { name: 'Galician', code: 'gl' },
  'kat': { name: 'Georgian', code: 'ka' },
  'ell': { name: 'Greek', code: 'el' },
  'heb': { name: 'Hebrew', code: 'he' },
  'hun': { name: 'Hungarian', code: 'hu' },
  'isl': { name: 'Icelandic', code: 'is' },
  'ibo': { name: 'Igbo', code: 'ig' },
  'gle': { name: 'Irish', code: 'ga' },
  'kaz': { name: 'Kazakh', code: 'kk' },
  'khm': { name: 'Khmer', code: 'km' },
  'kir': { name: 'Kyrgyz', code: 'ky' },
  'lao': { name: 'Lao', code: 'lo' },
  'lav': { name: 'Latvian', code: 'lv' },
  'lit': { name: 'Lithuanian', code: 'lt' },
  'ltz': { name: 'Luxembourgish', code: 'lb' },
  'mkd': { name: 'Macedonian', code: 'mk' },
  'mlg': { name: 'Malagasy', code: 'mg' },
  'mlt': { name: 'Maltese', code: 'mt' },
  'mon': { name: 'Mongolian', code: 'mn' },
  'nno': { name: 'Norwegian Nynorsk', code: 'nn' },
  'nob': { name: 'Norwegian Bokmål', code: 'nb' },
  'pus': { name: 'Pashto', code: 'ps' },
  'ron': { name: 'Romanian', code: 'ro' },
  'srp': { name: 'Serbian', code: 'sr' },
  'slk': { name: 'Slovak', code: 'sk' },
  'slv': { name: 'Slovenian', code: 'sl' },
  'som': { name: 'Somali', code: 'so' },
  'sot': { name: 'Southern Sotho', code: 'st' },
  'swe': { name: 'Swedish', code: 'sv' },
  'tgk': { name: 'Tajik', code: 'tg' },
  'tat': { name: 'Tatar', code: 'tt' },
  'tir': { name: 'Tigrinya', code: 'ti' },
  'tsn': { name: 'Tswana', code: 'tn' },
  'tuk': { name: 'Turkmen', code: 'tk' },
  'uzb': { name: 'Uzbek', code: 'uz' },
  'cym': { name: 'Welsh', code: 'cy' },
  'xho': { name: 'Xhosa', code: 'xh' },
  'yor': { name: 'Yoruba', code: 'yo' },
  'zul': { name: 'Zulu', code: 'zu' },
};

interface Message {
  id?: string; // Add optional ID field
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
  image?: string;
  language?: string;
  isSpeaking?: boolean;
}

interface ChatHistory {
  id: string;
  messages: Message[];
  date: Date;
}

// Define SpeechRecognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}

interface IWindow extends Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognition: typeof SpeechRecognition;
}

declare const window: IWindow;

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  type: 'bot',
  content: "Hello! I'm your medical assistant powered by Google's Gemini 2.0 Flash API. How can I help you with your health questions today?",
  timestamp: new Date()
};

const MEDICAL_CONTEXT = `You are an advanced medical AI assistant named HealerAi Assistant powered by Google's Gemini 2.0 Flash API. Format your responses using proper medical terminology:

Formatting Guidelines:
- Use ## for section headers
- Use **bold** for emphasis
- Use proper bullet points with "-" or numbered lists with "1."
- Use > for important quotes or warnings
- Use proper line breaks between sections

Your responses should be:
1. Professional yet friendly and empathetic
2. Structured with clear sections
3. Include relevant medical terminology with layman explanations
4. Use proper formatting for clarity
5. Provide actionable recommendations

Focus on natural remedies, home treatments, and lifestyle changes rather than medications. Provide holistic health advice that empowers users to take charge of their well-being through:
- Dietary recommendations
- Exercise and movement suggestions
- Stress management techniques
- Sleep hygiene tips
- Herbal and natural remedies (when appropriate)
- Preventive care measures

Remember to:
- Immediately identify emergency situations
- Cite general medical guidelines when relevant
- Explain both benefits and risks
- Use simple language while being thorough
- Never recommend specific medications or dosages

Example format:
## Symptoms
- First symptom
- Second symptom

**Important:** Key information here

> Warning: Emergency information here`;

export function GeminiMedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      const historyWithDates = parsed.map((chat: ChatHistory) => ({
        ...chat,
        date: new Date(chat.date)
      }));
      setChatHistory(historyWithDates);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const simulateTyping = async (text: string) => {
    const minDelay = 500;
    const maxDelay = 1500;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
    return text;
  };

  const handleFeedback = (messageIndex: number, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, feedback } : msg
    ));
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve our responses.",
    });
  };

  const clearChat = () => {
    if (messages.length > 1) {
      const newHistory: ChatHistory = {
        id: Date.now().toString(),
        messages: [...messages],
        date: new Date(),
      };
      const updatedHistory = [...chatHistory, newHistory];
      setChatHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    }
    setMessages([INITIAL_MESSAGE]);
    toast({
      title: "Chat cleared",
      description: "The conversation has been saved to history and reset.",
    });
  };

  const loadPreviousChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported in this browser');
        }
        
        const recognition = new SpeechRecognition();
        
        // Set language based on user input or default to English
        const lastUserMessage = messages.filter(msg => msg.type === 'user').pop();
        const detectedLanguageCode = lastUserMessage?.language || 'en';
        
        // Map language codes to speech recognition language codes
        const speechLangMap: Record<string, string> = {
          'en': 'en-US',
          'hi': 'hi-IN',
          'bn': 'bn-IN',
          'te': 'te-IN',
          'mr': 'mr-IN',
          'ta': 'ta-IN',
          'ur': 'ur-PK',
          'gu': 'gu-IN',
          'kn': 'kn-IN',
          'or': 'or-IN',
          'ml': 'ml-IN',
          'pa': 'pa-IN',
          'as': 'as-IN',
          'ne': 'ne-NP',
          'sa': 'sa-IN',
          'es': 'es-ES',
          'fr': 'fr-FR',
          'de': 'de-DE',
          'it': 'it-IT',
          'pt': 'pt-PT',
          'ru': 'ru-RU',
          'ja': 'ja-JP',
          'ko': 'ko-KR',
          'ar': 'ar-SA',
          'tr': 'tr-TR',
          'pl': 'pl-PL',
          'uk': 'uk-UA',
          'vi': 'vi-VN',
          'id': 'id-ID',
          'th': 'th-TH',
          'ms': 'ms-MY',
          'fil': 'fil-PH',
          'zh': 'zh-CN',
          'fa': 'fa-IR',
          'sw': 'sw-KE',
        };
        
        recognition.lang = speechLangMap[detectedLanguageCode] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          toast({
            title: "Voice recording transcribed",
            description: "You can now edit or send your message.",
          });
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast({
            variant: "destructive",
            title: "Transcription failed",
            description: "Could not convert your speech to text. Please try again or type manually.",
          });
        };

        recognition.start();
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input.",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Converting speech to text...",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Text-to-speech function
  const speakMessage = (text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Remove markdown tags and clean the text for speaking
      const cleanText = text
        .replace(/#{1,6}\s?/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italics
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/`{1,3}.*?`{1,3}/g, '') // Remove code blocks
        .replace(/\n{2,}/g, '. ') // Replace multiple newlines with period and space
        .replace(/\n/g, ' ') // Replace single newlines with space
        .replace(/>\s?/g, '') // Remove blockquotes
        .replace(/\*\s/g, '') // Remove bullet points
        .replace(/\d+\.\s/g, '') // Remove numbered lists
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Set language based on message language
      const message = messages.find(msg => 
        msg.type === 'bot' && msg.id === messageId
      );
      
      if (message?.language) {
        utterance.lang = message.language;
      } else {
        utterance.lang = 'en-US';
      }
      
      // Enhanced voice settings for better conversational tone
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.1; // Slightly higher pitch for more natural sound
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setSpeakingMessageId(messageId);
        // Update message to show it's speaking
        setMessages(prev => prev.map((msg) => 
          msg.id === messageId ? { ...msg, isSpeaking: true } : msg
        ));
      };
      
      utterance.onend = () => {
        setSpeakingMessageId(null);
        // Update message to show it's finished speaking
        setMessages(prev => prev.map((msg) => 
          msg.id === messageId ? { ...msg, isSpeaking: false } : msg
        ));
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingMessageId(null);
        setMessages(prev => prev.map((msg) => 
          msg.id === messageId ? { ...msg, isSpeaking: false } : msg
        ));
        toast({
          variant: "destructive",
          title: "Speech Error",
          description: "Failed to speak the message. Please try again.",
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Speech Not Supported",
        description: "Text-to-speech is not supported in your browser.",
      });
    }
  };

  // Stop speaking function
  const stopSpeaking = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      // Reset all speaking states
      setMessages(prev => prev.map(msg => 
        msg.isSpeaking ? { ...msg, isSpeaking: false } : msg
      ));
    }
  };

  // Pause speaking function
  const pauseSpeaking = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      // Don't reset speaking state here, as we might resume
    }
  };

  // Resume speaking function
  const resumeSpeaking = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  // Toggle pause/resume speaking or stop if user clicks during speech
  const togglePauseSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        resumeSpeaking();
      } else if (window.speechSynthesis.speaking) {
        // Allow user to interrupt/stop the speech by clicking the button
        stopSpeaking();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsThinking(true);
    setIsTyping(true);

    try {
      // Detect language with confidence checking
      const detectedLanguageCode = franc(input);
      console.log('Detected language code:', detectedLanguageCode);
      
      // Default to English if language detection fails or is unreliable
      const languageInfo = LANGUAGE_MAP[detectedLanguageCode] || { name: 'English', code: 'en' };
      
      const userMessage: Message = {
        id: Date.now().toString(), // Generate unique ID for the message
        type: 'user',
        content: input,
        timestamp: new Date(),
        language: languageInfo.code
      };

      setMessages(prev => [...prev, userMessage]);
      setInput("");

      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const languageSpecificContext = `${MEDICAL_CONTEXT}
      
      IMPORTANT: The user has asked a question in ${languageInfo.name}. 
      You MUST respond in the SAME LANGUAGE as the user's question.
      Language code: ${languageInfo.code}
      Language name: ${languageInfo.name}
      
      If the user's language is not English, provide responses in their native language while maintaining medical accuracy.
      If you're not confident in your ability to provide accurate medical information in the user's language, 
      politely inform them and offer to continue in English.`;

      const response = await generateMedicalResponse(input, languageSpecificContext);

      const botResponse = await simulateTyping(response || "I couldn't process that request. Please try again.");

      const botMessage: Message = {
        id: Date.now().toString(), // Generate unique ID for the message
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        language: languageInfo.code
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response automatically after it's received
      setTimeout(() => {
        speakMessage(botResponse, botMessage.id!); // Pass the message ID
      }, 1000);

      const emergencyKeywords = ['emergency', 'immediate', '911', 'urgent care', 'hospital'];
      if (emergencyKeywords.some(keyword => botResponse.toLowerCase().includes(keyword))) {
        toast({
          variant: "destructive",
          title: "Emergency Alert",
          description: "Please seek immediate medical attention or call emergency services.",
        });
      }
    } catch (error: any) {
      console.error('Error generating response:', error);
      const errorMessage = error?.message || "Failed to get response. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        action: <Button onClick={() => handleSendMessage()}>Retry</Button>
      });
    } finally {
      setIsThinking(false);
      setIsTyping(false);
    }
  };

  const handleImageAnalysis = async (imageData: string) => {
    setIsThinking(true);
    
    try {
      // Create a prompt for image analysis
      const prompt = "You are a medical professional. Please analyze this medical image and provide insights about: 1) What it shows 2) Any concerns 3) Recommendations. Include medical disclaimers.";
      
      // Use Gemini with image for analysis
      const response = await generateMedicalResponseWithImage(imageData, prompt, MEDICAL_CONTEXT);
      
      const botMessage: Message = {
        type: 'bot',
        content: response || "I couldn't analyze the image. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response automatically after it's received
      setTimeout(() => {
        speakMessage(response, botMessage.id!); // Pass the message ID
      }, 1000);
    } catch (error: any) {
      console.error('Error in handleImageAnalysis:', error);
      toast({
        title: "Image Analysis Failed",
        description: error?.message || "Could not analyze the image. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Add user message with image
        const userMessage: Message = {
          id: Date.now().toString(), // Generate unique ID for the message
          type: 'user',
          content: "I've uploaded a medical image for analysis",
          timestamp: new Date(),
          image: base64Image
        };

        setMessages(prev => [...prev, userMessage]);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Analyze the image
        await handleImageAnalysis(base64Image);
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the image file",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="w-full max-w-3xl mx-auto shadow-xl bg-gradient-to-b from-emerald-50 to-white border-emerald-100 rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="p-4 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-emerald-600" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">HealerAi Assistant (Gemini)</h2>
                <p className="text-xs text-gray-500">Powered by Google's Gemini API</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat History</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px]">
                    {chatHistory.length === 0 ? (
                      <p className="text-center text-gray-500 p-4">No chat history available</p>
                    ) : (
                      chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className="p-4 border-b cursor-pointer hover:bg-gray-100 rounded-lg mb-2 bg-white shadow-sm"
                          onClick={() => loadPreviousChat(chat)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {chat.date.toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {chat.messages.length} messages
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <span className="text-sm text-gray-500">
                {currentTime.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <Alert variant="destructive" className="m-4 border-l-4 border-red-500 w-fit">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Medical Disclaimer:</span> This AI assistant provides general information only. 
            Always consult healthcare professionals for medical advice.
          </AlertDescription>
        </Alert>

        {/* Chat Area */}
        <ScrollArea 
          className="h-[500px] p-4 md:h-[600px]" 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center mr-2">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-transparent shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-emerald-100'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2 relative">
                          <img 
                            src={message.image} 
                            alt="Uploaded medical image"
                            className="max-w-[300px] rounded-lg shadow-md"
                          />
                          {message.type === 'user' && isThinking && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <div className="text-white text-sm">Analyzing image...</div>
                            </div>
                          )}
                        </div>
                      )}
                      <ReactMarkdown 
                        className="text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:mb-2 prose-ul:mb-2"
                        components={{
                          h2: ({children}) => <h2 className="text-lg font-bold mt-4">{children}</h2>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-emerald-500 pl-4 my-2 italic bg-emerald-50/10 py-1">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                          {message.language && (
                            <span className="ml-2 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                              {(() => {
                                const key = Object.keys(LANGUAGE_MAP).find(key => LANGUAGE_MAP[key].code === message.language);
                                return key ? LANGUAGE_MAP[key].name : message.language;
                              })()}
                            </span>
                          )}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex gap-2">
                            {speakingMessageId === message.id ? (
                              window.speechSynthesis && window.speechSynthesis.paused ? (
                                <button
                                  onClick={resumeSpeaking}
                                  className="opacity-50 hover:opacity-100 text-emerald-500"
                                  aria-label="Resume speaking"
                                >
                                  <Play className="w-3 h-3" />
                                </button>
                              ) : (
                                <button
                                  onClick={togglePauseSpeaking}
                                  className="opacity-50 hover:opacity-100 text-red-500"
                                  aria-label="Stop speaking"
                                >
                                  <Square className="w-3 h-3" />
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => speakMessage(message.content, message.id!)}
                                disabled={!!speakingMessageId}
                                className={`opacity-50 hover:opacity-100 ${speakingMessageId === message.id ? 'text-emerald-500' : ''}`}
                                aria-label="Speak message"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleFeedback(messages.indexOf(message), 'positive')}
                              className={`opacity-50 hover:opacity-100 ${message.feedback === 'positive' ? 'text-green-500' : ''}`}
                              aria-label="Positive feedback"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(messages.indexOf(message), 'negative')}
                              className={`opacity-50 hover:opacity-100 ${message.feedback === 'negative' ? 'text-red-500' : ''}`}
                              aria-label="Negative feedback"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center ml-2">
                      <span className="text-sm font-medium">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                       transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-emerald-100 bg-white/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 items-end"
          >
            <div className="flex-1 space-y-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a health question..."
                className="min-h-[50px] text-base"
                disabled={isThinking}
              />
              {isThinking && (
                <div className="text-xs text-emerald-600 animate-pulse">
                  Generating response with Gemini 1.5 Pro...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleImageButtonClick}
                disabled={isThinking}
                className="hover:bg-emerald-500"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`hover:bg-emerald-500 ${isRecording ? 'animate-pulse bg-red-500' : ''}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon"
                disabled={isThinking || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-20 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default GeminiMedicalChatbot;