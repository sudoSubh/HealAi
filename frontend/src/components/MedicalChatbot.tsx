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
import { generateMedicalResponse, generateMedicalResponseWithImage } from "@/services/medical-bot-fallback-service"; // Use fallback service

// Import franc-min at the top level instead of dynamically
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
  content: "Hello! I'm your medical assistant powered by advanced AI technology. I'm here to provide you with reliable health information and guidance. How can I help you with your health questions today?",
  timestamp: new Date()
};

const MEDICAL_CONTEXT = `You are an advanced medical AI assistant named HealerAi Assistant. Format your responses using proper markdown:

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

// Add typing animation component
const TypingIndicator = () => (
  <div className="flex gap-1 p-2 bg-gray-100 rounded-lg w-fit">
    {[1, 2, 3].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-emerald-600 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: dot * 0.1,
        }}
      />
    ))}
  </div>
);

interface MedicalChatbotProps {
  initialQuestion?: string | null;
}

export function MedicalChatbot({ initialQuestion = null }: MedicalChatbotProps) {
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

  // Add new states for enhanced features
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Set initial question if provided
  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
    }
  }, [initialQuestion]);

  // Auto-send initial question if provided
  useEffect(() => {
    if (initialQuestion && input === initialQuestion) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        handleSendMessage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [input, initialQuestion]);

  useEffect(() => {
    // Load chat history from localStorage on component mount
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Convert string dates back to Date objects
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

  const handleImageAnalysis = async (imageData: string) => {
    setIsThinking(true);
    
    try {
      // Create a prompt for image analysis
      const prompt = "You are a medical professional. Please analyze this medical image and provide insights about: 1) What it shows 2) Any concerns 3) Recommendations. Include medical disclaimers.";
      
      // Use Gemini with image for analysis
      const response = await generateMedicalResponseWithImage(imageData, prompt, MEDICAL_CONTEXT);
      
      const botMessage: Message = {
        id: Date.now().toString(), // Generate unique ID for the message
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

  // Add scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced message handling with multilingual support
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

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Text-to-speech function with enhanced features
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


  return (
    <div className="relative">
      <div className="w-full max-w-4xl mx-auto shadow-xl bg-gradient-to-b from-white to-emerald-50/30 border border-emerald-100 rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">HealerAi Assistant</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-medium">AI-Powered</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Chat History
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    {chatHistory.length === 0 ? (
                      <div className="text-center py-10">
                        <History className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No chat history available</p>
                      </div>
                    ) : (
                      [...chatHistory].reverse().map((chat) => (
                        <div
                          key={chat.id}
                          className="p-4 border-b cursor-pointer hover:bg-emerald-50/50 rounded-lg mb-2 bg-white shadow-sm transition-colors"
                          onClick={() => loadPreviousChat(chat)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {chat.date.toLocaleDateString()} at {chat.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {chat.messages.length} messages
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-2">
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                aria-label="Clear chat history"
                className="rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <Alert variant="destructive" className="mx-5 mt-5 border-l-4 border-red-500 rounded-xl bg-red-50">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <AlertDescription className="text-sm">
                <span className="font-semibold">Medical Disclaimer:</span> This AI assistant provides general information for awareness and educational purposes only. 
                Always consult healthcare professionals for medical advice. In case of emergency, call your local emergency number immediately.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Chat Area */}
        <ScrollArea 
          className="h-[500px] p-5 md:h-[600px] bg-gradient-to-b from-white to-emerald-50/30" 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="space-y-6">
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={`rounded-2xl p-4 shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-none shadow-md'
                          : 'bg-white border border-emerald-100 rounded-tl-none shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-3 relative">
                          <img 
                            src={message.image} 
                            alt="Uploaded medical image"
                            className="max-w-[300px] rounded-xl shadow-md"
                          />
                          {message.type === 'user' && isThinking && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                              <div className="text-white text-sm flex items-center gap-2">
                                <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing image...
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <ReactMarkdown 
                        className="text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:mb-3 prose-p:mb-3 prose-ul:mb-3"
                        components={{
                          h2: ({children}) => <h2 className="text-lg font-bold mt-4 mb-3 text-foreground border-b border-gray-200 pb-2">{children}</h2>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-emerald-500 pl-4 my-3 italic bg-emerald-50/50 py-2 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100/50">
                        <span className="text-xs opacity-80">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {message.language && (
                            <span className="ml-2 bg-emerald-100 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-800">
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
                                  className="opacity-70 hover:opacity-100 text-emerald-500 p-1 rounded-full hover:bg-emerald-50"
                                  aria-label="Resume speaking"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={togglePauseSpeaking}
                                  className="opacity-70 hover:opacity-100 text-red-500 p-1 rounded-full hover:bg-red-50"
                                  aria-label="Stop speaking"
                                >
                                  <Square className="w-4 h-4" />
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => speakMessage(message.content, message.id!)}
                                disabled={!!speakingMessageId}
                                className={`opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-emerald-50 ${speakingMessageId === message.id ? 'text-emerald-500' : ''}`}
                                aria-label="Speak message"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleFeedback(messages.indexOf(message), 'positive')}
                              className={`opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-emerald-50 ${message.feedback === 'positive' ? 'text-green-500' : ''}`}
                              aria-label="Positive feedback"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleFeedback(messages.indexOf(message), 'negative')}
                              className={`opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-emerald-50 ${message.feedback === 'negative' ? 'text-red-500' : ''}`}
                              aria-label="Negative feedback"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ml-3 flex-shrink-0">
                      <span className="text-sm font-medium text-white">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {(isTyping || isThinking) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-none p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center">
                  <div className="flex gap-1 mr-2">
                    <motion.div
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm text-emerald-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-5 border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50/30 backdrop-blur-sm rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-3 items-end"
          >
            <div className="flex-1 space-y-2">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your health question or describe your symptoms..."
                  className="min-h-[56px] text-base pl-4 pr-12 rounded-2xl border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 shadow-sm"
                  disabled={isThinking}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
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
                    variant="ghost"
                    onClick={handleImageButtonClick}
                    disabled={isThinking}
                    className="hover:bg-emerald-100 rounded-full h-8 w-8"
                  >
                    <ImageIcon className="h-4 w-4 text-emerald-600" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`hover:bg-emerald-100 rounded-full h-8 w-8 ${isRecording ? 'animate-pulse bg-red-100 text-red-600' : 'text-emerald-600'}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isThinking && (
                <div className="text-xs text-emerald-600 animate-pulse flex items-center gap-1">
                  <div className="w-2 h-2 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  Generating response...
                </div>
              )}

            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={isThinking || !input.trim()}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-3">
            Powered by advanced AI technology • Information & awareness only
          </p>

        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-24 right-6 rounded-full shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

export default MedicalChatbot;