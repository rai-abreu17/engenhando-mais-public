import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { lessonId } = useParams<{ lessonId?: string }>();
  const isConjuntosAula = lessonId === 'j5i6XlfwxeA';
  
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Inicializar mensagem de boas-vindas com base no tipo de aula
  useEffect(() => {
    // Reset messages when the component mounts or lessonId changes
    setMessages([{
      id: '1',
      text: isConjuntosAula 
        ? 'Olá! Sou seu assistente IA. Estou aqui para ajudar com sua aula sobre Conjuntos e Operações com Conjuntos. Como posso ajudá-lo hoje?' 
        : 'Olá! Sou seu assistente IA. Como posso ajudá-lo com esta aula?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, [lessonId, isConjuntosAula]);
  const [inputText, setInputText] = useState('');

  // Respostas pré-definidas para aula de Conjuntos e Operações
  const conjuntosRespostas: {[key: string]: string} = {
    'default': 'Posso explicar melhor sobre qualquer conceito de conjuntos e operações apresentado nesta aula. Basta perguntar!',
    'uniao': 'A união de conjuntos (A ∪ B) representa todos os elementos que pertencem a A OU a B. No minuto 08:11 o professor explica usando um exemplo de restaurante: imagine um restaurante "Sabores & Aromas" com dois salões: o salão A com mesas 1-10 e o salão B com mesas 11-20. No salão A temos o conjunto de clientes A = {Carlos, Ana, Pedro, Mariana, Felipe} e no salão B temos B = {Juliana, Lucas, Pedro, Camila}. A união A ∪ B representa TODOS os clientes do restaurante inteiro, sem repetir ninguém: A ∪ B = {Carlos, Ana, Pedro, Mariana, Felipe, Juliana, Lucas, Camila}. Matematicamente, x ∈ (A ∪ B) se, e somente se, x ∈ A ou x ∈ B (ou ambos).',
    'intersecao': 'A intersecção de conjuntos (A ∩ B) representa todos os elementos que pertencem a A E a B simultaneamente. No vídeo, por volta dos 10:23, o professor explica que se continuarmos com o exemplo do restaurante "Sabores & Aromas", podemos identificar clientes que transitam entre os dois salões durante a noite. Se Pedro é o único cliente que aparece tanto no salão A quanto no salão B, então A ∩ B = {Pedro}. Isso significa que para todo elemento x, x ∈ (A ∩ B) se, e somente se, x ∈ A e x ∈ B. É como identificar os "clientes VIP" que têm acesso a ambos os espaços.',
    'diferenca': 'A diferença entre conjuntos (A - B ou A \\ B) representa todos os elementos que pertencem a A mas NÃO pertencem a B. Aos 12:45, continuando o exemplo do restaurante, se A = {Carlos, Ana, Pedro, Mariana, Felipe} e B = {Juliana, Lucas, Pedro, Camila}, então A \\ B = {Carlos, Ana, Mariana, Felipe}, que representa os clientes que estão exclusivamente no salão A. Matematicamente, x ∈ (A \\ B) se, e somente se, x ∈ A e x ∉ B. No contexto do restaurante, isso pode representar clientes que têm preferência apenas pelo ambiente do salão A.',
    'complemento': 'O complemento de um conjunto (A\') representa todos os elementos do universo que NÃO pertencem a A. Aproximadamente aos 15:30, no exemplo do restaurante, se considerarmos o universo U como todos os clientes cadastrados no sistema do restaurante "Sabores & Aromas", que são U = {Carlos, Ana, Pedro, Mariana, Felipe, Juliana, Lucas, Camila, Roberto, Beatriz, Gustavo}, e A = {Carlos, Ana, Pedro, Mariana, Felipe}, então o complemento de A seria A\' = {Juliana, Lucas, Camila, Roberto, Beatriz, Gustavo}, representando todos os clientes cadastrados que não estão no salão A naquele momento. Matematicamente, x ∈ A\' se, e somente se, x ∈ U e x ∉ A.',
    'produto': 'O produto cartesiano (A × B) é o conjunto de todos os pares ordenados onde o primeiro elemento pertence a A e o segundo pertence a B. Por volta dos 13:05, usando o exemplo do restaurante, podemos pensar em combinar pratos do menu A com bebidas do menu B. Se A = {Risoto, Lasanha, Filé} e B = {Vinho, Suco, Água}, então A × B = {(Risoto,Vinho), (Risoto,Suco), (Risoto,Água), (Lasanha,Vinho), (Lasanha,Suco), (Lasanha,Água), (Filé,Vinho), (Filé,Suco), (Filé,Água)}. Isto representa todas as possíveis combinações de prato e bebida que um cliente pode pedir. Na matemática formal, A × B = {(a,b) | a ∈ A e b ∈ B}.',
    'teoria': 'A teoria dos conjuntos fornece as bases matemáticas para compreender operações com conjuntos. Conforme explicado aos 05:20 no vídeo, a notação de conjuntos utiliza chaves { } para delimitar seus elementos. No contexto do restaurante "Sabores & Aromas" mencionado no minuto 08:11, podemos representar formalmente os conjuntos e suas operações. Por exemplo, se A = {Carlos, Ana, Pedro, Mariana, Felipe} e B = {Juliana, Lucas, Pedro, Camila}, podemos realizar diversas operações: união A ∪ B = {Carlos, Ana, Pedro, Mariana, Felipe, Juliana, Lucas, Camila}, intersecção A ∩ B = {Pedro}, diferença A \\ B = {Carlos, Ana, Mariana, Felipe}, e assim por diante. Essas notações matemáticas nos permitem representar e manipular grupos de elementos de forma precisa e sistemática.',
    'exemplo_restaurante': 'No minuto 08:11 o professor explica a teoria dos conjuntos usando um excelente exemplo de restaurante. Imagine o restaurante "Sabores & Aromas" com dois salões (A e B) e um sistema de reservas. Podemos definir vários conjuntos: U = {todos os clientes cadastrados}, A = {clientes no salão A}, B = {clientes no salão B}, M = {clientes que pediram o menu degustação}. Com esses conjuntos, podemos aplicar todas as operações: A ∪ B representa todos os clientes presentes no restaurante; A ∩ B representa clientes que visitaram ambos os salões; A \\ B representa clientes exclusivos do salão A; U \\ (A ∪ B) representa clientes cadastrados que não estão no restaurante hoje; A ∩ M representa clientes do salão A que pediram o menu degustação. Este exemplo mostra como a matemática dos conjuntos se aplica a situações reais, ajudando a organizar informações e tomar decisões no gerenciamento do restaurante.'
  };

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
      let responseText = 'Entendi sua pergunta! Com base no conteúdo da aula, posso explicar que...';
      
      // Se for aula de Conjuntos, usar respostas contextuais
      if (isConjuntosAula) {
        // Detectar palavras-chave na pergunta do usuário
        const lowerInput = inputText.toLowerCase();
        
        if (lowerInput.includes('restaurante') || (lowerInput.includes('exemplo') && lowerInput.includes('restaurante'))) {
          responseText = conjuntosRespostas['exemplo_restaurante'];
        }
        else if (lowerInput.includes('união') || lowerInput.includes('uniao') || lowerInput.includes('∪')) {
          responseText = conjuntosRespostas['uniao'];
        } 
        else if (lowerInput.includes('intersecção') || lowerInput.includes('interseccao') || lowerInput.includes('interseção') || lowerInput.includes('∩')) {
          responseText = conjuntosRespostas['intersecao'];
        }
        else if (lowerInput.includes('diferença') || lowerInput.includes('diferenca') || lowerInput.includes('\\')) {
          responseText = conjuntosRespostas['diferenca'];
        }
        else if (lowerInput.includes('complemento') || lowerInput.includes('complementar') || lowerInput.includes("'")) {
          responseText = conjuntosRespostas['complemento'];
        }
        else if (lowerInput.includes('produto cartesiano') || lowerInput.includes('produto') || lowerInput.includes('×')) {
          responseText = conjuntosRespostas['produto'];
        }
        else if (lowerInput.includes('teoria') || lowerInput.includes('notação') || lowerInput.includes('fundamentos')) {
          responseText = conjuntosRespostas['teoria'];
        }
        else if ((lowerInput.includes('explique') || lowerInput.includes('exemplo')) && lowerInput.includes('08:11')) {
          responseText = conjuntosRespostas['exemplo_restaurante'];
        }
        else if (lowerInput.includes('explique') || lowerInput.includes('exemplo')) {
          // Escolher aleatoriamente uma das respostas para explicações gerais
          const keys = Object.keys(conjuntosRespostas).filter(k => k !== 'default' && k !== 'exemplo_restaurante');
          const randomKey = keys[Math.floor(Math.random() * keys.length)];
          responseText = conjuntosRespostas[randomKey];
        }
        else {
          responseText = conjuntosRespostas['default'];
        }
        
        // Adicionar uma referência ao tempo do vídeo se não tiver
        if (!responseText.includes('aos ') && !responseText.includes(':')) {
          // Tempos fictícios aleatórios entre 1 e 15 minutos
          const minuto = Math.floor(Math.random() * 15) + 1;
          const segundo = Math.floor(Math.random() * 60);
          responseText += ` Conforme explicado aos ${minuto.toString().padStart(2, '0')}:${segundo.toString().padStart(2, '0')} no vídeo, o professor utiliza exemplos práticos para facilitar a compreensão.`;
        }
      }

      const aiMessage: Message = {
        id: Date.now() + '_ai',
        text: responseText,
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