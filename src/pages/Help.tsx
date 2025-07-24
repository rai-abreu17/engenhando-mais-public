import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { COLORS } from '@/constants/theme';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Voltar para a página anterior
  };

  // Perguntas frequentes
  const faqs = [
    {
      question: 'Como criar uma nova aula?',
      answer: 'Para criar uma nova aula, acesse a página "Aulas" e clique no botão "+" no canto inferior direito da tela. Preencha as informações necessárias e clique em "Salvar".'
    },
    {
      question: 'Como adicionar alunos às minhas turmas?',
      answer: 'Acesse a página "Turmas", selecione a turma desejada e clique em "Gerenciar alunos". Em seguida, você pode adicionar alunos manualmente ou importar de um arquivo CSV.'
    },
    {
      question: 'Como visualizo o feedback dos alunos?',
      answer: 'Na página "Feedback", você encontrará todas as avaliações e comentários feitos pelos alunos. Você pode filtrar por turma, período ou tipo de avaliação.'
    },
    {
      question: 'Como editar meu perfil de professor?',
      answer: 'Na página "Configurações", acesse a aba "Perfil" para editar suas informações pessoais e profissionais.'
    },
    {
      question: 'Como integrar com outras plataformas?',
      answer: 'Na página "Configurações", acesse a aba "Integrações" para conectar sua conta com Google Classroom, Microsoft Teams, Zoom ou Moodle.'
    },
  ];

  // Guias rápidos
  const guides = [
    { title: 'Primeiros passos', icon: <FileText size={18} /> },
    { title: 'Criando aulas interativas', icon: <FileText size={18} /> },
    { title: 'Gerenciando turmas', icon: <FileText size={18} /> },
    { title: 'Analisando resultados', icon: <FileText size={18} /> },
    { title: 'Configurando notificações', icon: <FileText size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="mr-4"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.darkNavy }}>
              Ajuda e Suporte
            </h1>
            <p className="text-muted-foreground">
              Encontre respostas e obtenha assistência
            </p>
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle size={16} />
              <span>Perguntas Frequentes</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Guias Rápidos</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Contato</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Respostas para as dúvidas mais comuns dos professores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Guias Rápidos</CardTitle>
                <CardDescription>
                  Tutoriais passo a passo para utilizar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guides.map((guide, index) => (
                    <Button 
                      key={index} 
                      variant="outline"
                      className="justify-start h-auto py-4 px-4"
                      onClick={() => {}}
                    >
                      <div className="mr-4 p-2 rounded-full" style={{ background: COLORS.lightBlue }}>
                        {guide.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">Ver guia</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Entre em Contato</CardTitle>
                <CardDescription>
                  Nossa equipe de suporte está pronta para ajudar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 justify-start"
                    onClick={() => window.location.href = 'mailto:suporte@engenhando-mais.com'}
                  >
                    <div className="flex flex-col items-center mr-6">
                      <div className="p-3 rounded-full mb-2" style={{ background: COLORS.lightBlue }}>
                        <Mail size={24} style={{ color: COLORS.darkNavy }} />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-lg mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Resposta em até 24 horas
                      </p>
                      <p className="text-sm font-medium" style={{ color: COLORS.brightBlue }}>
                        suporte@engenhando-mais.com
                      </p>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-6 justify-start"
                    onClick={() => window.location.href = 'tel:+551140028922'}
                  >
                    <div className="flex flex-col items-center mr-6">
                      <div className="p-3 rounded-full mb-2" style={{ background: COLORS.lightBlue }}>
                        <Phone size={24} style={{ color: COLORS.darkNavy }} />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-lg mb-1">Telefone</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Segunda a sexta, das 8h às 18h
                      </p>
                      <p className="text-sm font-medium" style={{ color: COLORS.brightBlue }}>
                        (11) 4002-8922
                      </p>
                    </div>
                  </Button>
                </div>

                <div className="bg-muted p-6 rounded-lg mt-6">
                  <h3 className="font-medium mb-3">Envie sua dúvida</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
                  </p>
                  <Button className="w-full" style={{ backgroundColor: COLORS.brightBlue }}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Abrir formulário de contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPage;
