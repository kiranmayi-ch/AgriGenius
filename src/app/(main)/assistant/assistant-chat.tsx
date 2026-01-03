"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getAssistantResponse, getSpeechFromText } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Send, Sparkles, Sprout, Volume2, User, Loader, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnswerFarmerQuestionsInput } from "@/ai/flows/answer-farmer-questions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
};

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<AnswerFarmerQuestionsInput['language']>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);

  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSpeak = async (text: string, messageId: number) => {
    if (isSpeaking) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsSpeaking(null);
      if (isSpeaking === messageId) return;
    }

    setIsSpeaking(messageId);
    try {
      const response = await getSpeechFromText({ text, language });
      if ("audioDataUri" in response) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(response.audioDataUri);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => {
          setIsSpeaking(null);
        };
      } else {
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: response.error,
        });
        setIsSpeaking(null);
      }
    } catch (error) {
      console.error("Speech synthesis error:", error);
      toast({
        variant: "destructive",
        title: "Audio Error",
        description: "Failed to generate audio.",
      });
      setIsSpeaking(null);
    }
  };
  
  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Voice input is not supported in your browser.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast({
        variant: "destructive",
        title: "Voice Input Error",
        description: `An error occurred: ${event.error}`,
      });
    };

    recognitionRef.current = recognition;
  }, [language, toast]);

  useEffect(() => {
    setupSpeechRecognition();
  }, [setupSpeechRecognition]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await getAssistantResponse({ query: input, language });

    if ("answer" in response) {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer,
        confidenceScore: response.confidenceScore,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove the user message on error
    }

    setIsLoading(false);
  };
  
  const getConfidenceColor = (score: number) => {
    if (score > 75) return "bg-green-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  }


  return (
    <div className="flex flex-col flex-1 bg-card">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 space-y-6">
            {messages.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    <Sparkles className="mx-auto h-12 w-12 mb-4"/>
                    <h3 className="text-lg font-semibold">Start a conversation</h3>
                    <p>Ask about crop prices, weather, or pest control.</p>
                </div>
            )}
            {messages.map((message) => (
            <div
                key={message.id}
                className={cn(
                "flex items-start gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
                )}
            >
                {message.role === "assistant" && (
                <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <Sprout className="h-5 w-5 text-primary" />
                    </div>
                </Avatar>
                )}
                <div
                className={cn(
                    "max-w-md rounded-2xl p-3 text-sm",
                    message.role === "user"
                    ? "bg-primary/90 text-primary-foreground rounded-br-none"
                    : "bg-secondary rounded-bl-none"
                )}
                >
                <p className="whitespace-pre-wrap">{message.content}</p>
                 {message.role === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted-foreground/10">
                        {message.confidenceScore !== undefined && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                                            <div className="w-20">
                                               <Progress value={message.confidenceScore} className={`h-1.5 [&>div]:${getConfidenceColor(message.confidenceScore)}`} />
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Confidence: {message.confidenceScore}%</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSpeak(message.content, message.id)}>
                            {isSpeaking === message.id ? <Loader className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                    </div>
                )}
                </div>
                 {message.role === "user" && (
                     <Avatar className="h-9 w-9">
                         <div className="h-full w-full flex items-center justify-center bg-muted rounded-full">
                            <User className="h-5 w-5 text-muted-foreground" />
                         </div>
                     </Avatar>
                )}
            </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <Sprout className="h-5 w-5 text-primary" />
                        </div>
                    </Avatar>
                    <div className="bg-secondary rounded-2xl rounded-bl-none p-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="pr-24 min-h-[60px] resize-none"
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
             <Button type="button" size="icon" variant={isListening ? "destructive" : "secondary"} onClick={handleMicClick} disabled={isLoading}>
                <Mic className="h-4 w-4" />
              </Button>
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
         <RadioGroup value={language} onValueChange={(val: AnswerFarmerQuestionsInput['language']) => setLanguage(val)} className="flex items-center gap-4 mt-2">
            <Label>Language:</Label>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="te" id="te" />
                <Label htmlFor="te">Telugu</Label>
            </div>
             <div className="flex items-center space-x-2">
                <RadioGroupItem value="hi" id="hi" />
                <Label htmlFor="hi">Hindi</Label>
            </div>
        </RadioGroup>
      </div>
    </div>
  );
}
