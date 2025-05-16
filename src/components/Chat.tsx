
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const targetUrl = "/langflow";

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer AstraCS:vwmwMjWBiIapfZMefxTvyrtv:a7ddb793fe1f964a6eaf0dcd7aaf7a9f6545b758e1405e51b1894526e9fe4577",
        },
        body: JSON.stringify({
          input_value: input,
          output_type: "chat",
          input_type: "chat",
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        role: "assistant" as const,
        content:
          data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
          "I'm not sure how to respond to that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
            <MessageCircle size={48} className="opacity-50" />
            <div>
              <h3 className="text-lg font-semibold">Welcome to the AI Chat!</h3>
              <p>Ask me anything and I'll try to help you.</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-full max-w-[80%] rounded-lg p-4",
              message.role === 'user'
                ? "ml-auto bg-chat-user text-foreground"
                : "mr-auto bg-chat-bot text-foreground"
            )}
          >
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 max-w-[80%] rounded-lg p-4 bg-chat-bot">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[50px] max-h-[200px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={18} />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
