import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleBottomCenterTextIcon, CubeTransparentIcon } from '@heroicons/react/24/solid'; // Added CubeTransparentIcon
import { streamGemini } from '../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false); // New state for thinking mode
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = streamGemini(input, isThinkingMode); // Pass isThinkingMode
      let botResponse = '';
      setMessages((prev) => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = 'Sorry, something went wrong.';
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-accent text-background p-4 rounded-full shadow-md hover:opacity-90 transition-transform transform hover:scale-110 z-50"
        aria-label="Crypto Assistant"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-panel border-2 border-accent rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-3 bg-background/30 rounded-t-lg border-b border-accent/20">
            <h3 className="font-semibold text-accent">Crypto Assistant</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm shadow-md ${
                    msg.sender === 'user' ? 'bg-accent text-background' : 'bg-background text-text-primary'
                  }`}
                >
                  {msg.text || '...'}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-2 rounded-lg text-sm bg-background text-text-primary animate-pulse">
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-background">
            {/* Thinking Mode Toggle */}
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="thinking-mode-toggle" className="text-xs text-text-secondary flex items-center gap-1 cursor-pointer" aria-live="polite">
                    <CubeTransparentIcon className="h-4 w-4" />
                    Thinking Mode (complex queries)
                </label>
                <label htmlFor="thinking-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="thinking-mode-toggle"
                        checked={isThinkingMode}
                        onChange={() => setIsThinkingMode(!isThinkingMode)}
                        className="sr-only peer"
                        aria-label="Toggle thinking mode for complex queries"
                    />
                    <div className="w-9 h-5 bg-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" aria-hidden="true"></div>
                </label>
            </div>
            {/* Chat Input */}
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-background border border-panel rounded-full py-2 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="ml-2 p-2 bg-accent rounded-full text-background disabled:bg-gray-500 hover:opacity-90 transition-opacity duration-200 shadow-sm"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;