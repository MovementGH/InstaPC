"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_ROUTE } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuthInfo } from '@propelauth/react';
import { createVM } from '@/components/create-vm-form';
import { vmFormSchema } from '@/components/vm-form';
import {z} from 'zod';
type Message = {
  id: number;
  text: any;
  sender: 'user' | 'bot';
};

type VMFormValues = z.infer<typeof vmFormSchema>;


const handleYesNoinit = async (vmjson: VMFormValues | null, authinfo: ReturnType<typeof useAuthInfo>) => {
    if (vmjson && Object.keys(vmjson).length !== 0) {
      // Call createVM only if vmjson is valid and not empty
      createVM(vmjson, authinfo);
    } else {
      console.log("VM JSON is empty or invalid");
    }
  };
export default function ChatBotComponent({ className }: { className?: string}) {
    const authinfo = useAuthInfo();
    const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vmjson, setVMjson] = useState<VMFormValues | null>(null);



  const handleSend = async () => {
    if (input.trim()) {
    
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (input === 'Yes') {
        await handleYesNoinit(vmjson, authinfo);  // Pass the current vmjson state to the function
        setInput('');  // Clear the input field
        setMessages([
            { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' } // Reset chat with initial message
          ]);
        return; // Early return as we don't want to call the AI API after "Yes/No"
      }
      else if (input === 'No') {
        setMessages([
          { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' } // Reset chat with initial message
        ]);
        setInput('');  // Clear the input field
        return;
      }

      setInput(''); // Clear input field
      setLoading(true); // Set loading state

      try {
        // Call the Next.js API route using fetch
        const response = await fetch(`${API_ROUTE}/chatbot`, { 
          method: 'POST',
          body: JSON.stringify({ question: newMessage.text }), // Send user's question
          headers: {'content-type': 'application/json', authorization: `Bearer ${authinfo.accessToken}`},
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI response');
        }

        const AIoutput = await response.json();
        
        console.log(AIoutput.json);
        setVMjson(AIoutput.json as z.infer<typeof vmFormSchema>);
        // Add bot's response to the messages
        const botMessage: Message = {
          id: messages.length + 2,
          text: AIoutput.response.split('\n').map((response: any) => <>{response}<br/></>) || 'Sorry, I could not generate a valid response.',
          sender: 'bot',
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        const YesNoconfirm : Message = { id: messages.length + 3, text: 'Enter Yes/No for your choice to initiate the VM', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, YesNoconfirm]);
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
      <div
        className={`opacity-100 w-96 h-full bg-background shadow-xl transition-transform duration-200 ease-in-out origin-left ${className}`}
      >
        <div className="flex justify-between items-center bg-accent/30 p-3 text-primary-foreground">
          <h2 className="text-lg font-semibold">Talk to InstaPC Bot</h2>
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
                  className={`mx-2 p-3 rounded-lg text-sm ${
                    message.sender === 'user' ? 'bg-primary text-accent-foreground' : 'bg-accent'
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
            className="flex space-x-1"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={loading} // Disable input while loading
            />
            <Button type="submit" className="bg-accent" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
  )
}
