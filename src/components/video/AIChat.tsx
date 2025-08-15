import React, { useState } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente IA. Como posso ajudá-lo com esta aula?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now() + '_user',
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simular resposta da IA
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + '_ai',
        text: 'Entendi sua pergunta! Com base no conteúdo da aula, posso explicar que...',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        // Fechar ao clicar no backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card 
        className="w-full max-w-2xl h-[600px] flex flex-col bg-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-engenha-bright-blue to-engenha-sky-blue text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistente IA</h3>
              <p className="text-xs text-white/80">Sempre pronto para ajudar</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:bg-white/20 z-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-engenha-bright-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    message.isUser
                      ? "bg-engenha-bright-blue text-white"
                      : "bg-engenha-light-blue text-engenha-dark-navy"
                  )}
                >
                  {message.text}
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-engenha-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">Eu</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-engenha-light-cream">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua pergunta sobre a aula..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} className="bg-engenha-bright-blue hover:bg-engenha-blue">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputText('Explique este conceito melhor')}
              className="text-xs"
            >
              Explicar conceito
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputText('Resuma os pontos principais')}
              className="text-xs"
            >
              Resumir pontos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputText('Gere exercícios sobre este tópico')}
              className="text-xs"
            >
              Gerar exercícios
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AIChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-engenha-bright-blue to-engenha-sky-blue hover:from-engenha-blue hover:to-engenha-bright-blue shadow-lg z-40"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};