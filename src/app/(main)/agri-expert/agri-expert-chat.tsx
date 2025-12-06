"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getExpertResponse } from "./actions";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Sparkles, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  role: "user" | "expert";
  content: string;
};

export function AgriExpertChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await getExpertResponse({ query: input });

    if ("answer" in response) {
      const expertMessage: Message = {
        id: Date.now() + 1,
        role: "expert",
        content: response.answer,
      };
      setMessages((prev) => [...prev, expertMessage]);
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

  return (
    <div className="flex flex-col flex-1 bg-card">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 space-y-6">
            {messages.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    <Sparkles className="mx-auto h-12 w-12 mb-4"/>
                    <h3 className="text-lg font-semibold">Ask the Expert</h3>
                    <p>Ask detailed questions about crop management, soil health, or market analysis.</p>
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
                {message.role === "expert" && (
                <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <UserCheck className="h-5 w-5 text-primary" />
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
                        <UserCheck className="h-5 w-5 text-primary" />
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
            placeholder="Type your question for the expert here..."
            className="pr-16 min-h-[60px] resize-none"
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
