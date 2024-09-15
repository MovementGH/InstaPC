"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, X } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatBotComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(''); // Clear input field
      setLoading(true); // Set loading state

      try {
        // Call the Next.js API route using fetch
        const response = await fetch('/api/InstaPCBot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: newMessage.text }), // Send user's question
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI response');
        }

        const AIoutput = await response.json();

        // Add bot's response to the messages
        const botMessage: Message = {
          id: messages.length + 2,
          text: AIoutput.botresponse || 'Sorry, I could not generate a valid response.',
          sender: 'bot',
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          text: 'There was an error processing your request. Please try again later.',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">Open chat</span>
        </Button>
      )}

      <div
        className={`fixed bottom-0 left-0 w-96 h-[600px] bg-background border rounded-tl-lg shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center bg-primary p-4 text-primary-foreground">
          <h2 className="text-2xl font-bold">Talk to InstaPC Bot</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>

        <ScrollArea className="flex-grow p-4 h-[calc(100%-8rem)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`flex items-start ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                  <AvatarImage
                    src={message.sender === 'user'
                      ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      : 'https://cdn-icons-png.freepik.com/512/8943/8943377.png'}
                  />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={loading} // Disable input while loading
            />
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
