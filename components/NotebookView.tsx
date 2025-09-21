import React from 'react';
import Sidebar from './Sidebar';
import ChatPanel from './ChatPanel';
import StudioPanel from './StudioPanel';
import Modal from './common/Modal';
import NotebookHeader from './Header';
import SourceGuide from './SourceGuide';
import AddSourcesModal from './modals/AddSourcesModal';
import AudioSummaryModal from './modals/AudioSummaryModal';
import DiscoverSourcesModal from './modals/DiscoverSourcesModal';
import GenerateReportModal from './modals/GenerateReportModal';
import GenerateFlashcardsModal from './modals/GenerateFlashcardsModal';
import GenerateTestModal from './modals/GenerateTestModal';
import type { Source, Message, Note, StudioItem, Notebook, GeneratedContent } from '../types';
import { ModalType } from '../types';
import { getChatResponse, generateStudioContent } from '../services/geminiService';

interface NotebookViewProps {
    notebook: Notebook;
    onUpdateNotebook: (notebook: Notebook) => void;
    onBackToDashboard: () => void;
}

const NotebookView: React.FC<NotebookViewProps> = ({ notebook, onUpdateNotebook, onBackToDashboard }) => {
  const [sources, setSources] = React.useState<Source[]>(notebook.sources);
  const [messages, setMessages] = React.useState<Message[]>(notebook.messages);
  const [studioItems, setStudioItems] = React.useState<StudioItem[]>(notebook.studioItems);
  
  const [activeModal, setActiveModal] = React.useState<ModalType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = React.useState<Set<string>>(new Set(sources.map(s => s.id)));
  const [activeView, setActiveView] = React.useState<'chat' | 'sourceGuide'>('chat');
  const [activeSourceForGuide, setActiveSourceForGuide] = React.useState<Source | null>(null);
  const [modalConfig, setModalConfig] = React.useState<any>({});


  // Effect to update the main app state whenever local state changes
  React.useEffect(() => {
    onUpdateNotebook({
      ...notebook,
      sources,
      messages,
      studioItems,
      sourceCount: sources.length,
    });
  }, [sources, messages, studioItems]);

  // Initialize with example data if notebook is new
  React.useEffect(() => {
    if (notebook.sources.length === 0 && notebook.messages.length === 0) {
      const exampleSources: Source[] = [
        { id: '1', name: 'Analise_RAG_NotebookLM.pdf', type: 'pdf', content: 'A limitação principal do NotebookLM é sua incapacidade de processar e recuperar informações da totalidade de um único documento extenso...', summary: 'Este documento analisa a falha crítica de truncamento de contexto em documentos extensos no NotebookLM...', keyTopics: ['RAG', 'Truncamento de Contexto', 'Limitações de IA'] },
        { id: '2', name: 'Estrategias_Mitigacao.txt', type: 'txt', content: 'A principal estrategia de mitigação identificada é a divisão manual de documentos grandes em partes menores...', summary: 'Descreve as estratégias adotadas pelos usuários para contornar as limitações do sistema...', keyTopics: ['Mitigação', 'Fragmentação Manual', 'Consultas Semânticas'] }
      ];
      const exampleMessage: Message = {
        id: 'initial-summary', sender: 'ai', text: 'Bem-vindo! Com base nas 2 fontes de exemplo, aqui está um resumo rápido: Os documentos discutem as limitações da arquitetura RAG e as estratégias que os usuários desenvolvem para mitigar esses problemas.',
        citations: [{sourceId: '1', citationNumber: 1}, {sourceId: '2', citationNumber: 2}]
      };
      setSources(exampleSources);
      setMessages([exampleMessage]);
      setSelectedSourceIds(new Set(exampleSources.map(s => s.id)));
    }
  }, []);
  
  const handleAddSources = (newSourcesData: Partial<Source>[]) => {
    const newFullSources: Source[] = newSourcesData.map(s => ({
        id: crypto.randomUUID(),
        name: s.name || 'Nova Fonte',
        type: s.type || 'text',
        content: s.content || '',
        summary: 'Resumo a ser gerado...',
        keyTopics: ['Tópico 1', 'Tópico 2'],
    }));

    setSources(prev => [...prev, ...newFullSources]);
    setSelectedSourceIds(prev => {
        const newSet = new Set(prev);
        newFullSources.forEach(s => newSet.add(s.id));
        return newSet;
    });
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
    setSelectedSourceIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sourceId);
        return newSet;
    });
  }
  
  const handleAddNote = (noteContent: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      type: 'note',
      content: noteContent,
    };
    setStudioItems(prev => [newNote, ...prev]);
  };

  const handleGenerateContent = async (config: any) => {
    const newContent: GeneratedContent = {
      id: crypto.randomUUID(),
      type: config.type,
      title: config.title,
      status: 'pending'
    };
    setStudioItems(prev => [newContent, ...prev]);
    
    const selectedSources = sources.filter(s => selectedSourceIds.has(s.id));
    const result = await generateStudioContent(config, selectedSources);
    
    setStudioItems(prev => prev.map(item => 
        (item.id === newContent.id && 'status' in item)
          ? { ...item, status: 'completed', ...result }
          : item
    ));
  };

  const handleSendMessage = async (prompt: string) => {
    const userMessage: Message = { id: crypto.randomUUID(), text: prompt, sender: 'user' };
    const loadingMessage: Message = { id: crypto.randomUUID(), text: '...', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);
    if (activeView === 'sourceGuide') {
        setActiveView('chat');
        setActiveSourceForGuide(null);
    }

    try {
      const selectedSources = sources.filter(s => selectedSourceIds.has(s.id));
      const aiResponse = await getChatResponse(prompt, selectedSources);
      const aiMessage: Message = { id: loadingMessage.id, text: aiResponse.text, sender: 'ai', citations: aiResponse.citations };
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? aiMessage : m));
    } catch (error) {
        console.error("Failed to get AI response:", error);
        const errorMessage: Message = { id: loadingMessage.id, text: "Desculpe, ocorreu um erro ao processar sua solicitação.", sender: 'ai' };
        setMessages(prev => prev.map(m => m.id === loadingMessage.id ? errorMessage : m));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectSourceForGuide = (sourceId: string | null) => {
      if (sourceId === null) {
          setActiveView('chat');
          setActiveSourceForGuide(null);
      } else {
          const source = sources.find(s => s.id === sourceId);
          if (source) {
              setActiveSourceForGuide(source);
              setActiveView('sourceGuide');
          }
      }
  };
  
  const renderModalContent = () => {
    switch (activeModal) {
      case ModalType.ADD_SOURCES:
        return <AddSourcesModal onClose={() => setActiveModal(null)} onAddSources={handleAddSources} onSetActiveModal={setActiveModal} />;
      case ModalType.DISCOVER_SOURCES:
        return <DiscoverSourcesModal onClose={() => setActiveModal(null)} />;
      case ModalType.GENERATE_AUDIO_SUMMARY:
        return <AudioSummaryModal onClose={() => setActiveModal(null)} onGenerate={handleGenerateContent} />;
      case ModalType.GENERATE_REPORT:
        return <GenerateReportModal onClose={() => setActiveModal(null)} onGenerate={handleGenerateContent} />;
      case ModalType.GENERATE_FLASHCARDS:
        return <GenerateFlashcardsModal onClose={() => setActiveModal(null)} onGenerate={handleGenerateContent} />;
      case ModalType.GENERATE_TEST:
        return <GenerateTestModal onClose={() => setActiveModal(null)} onGenerate={handleGenerateContent} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
     switch (activeModal) {
        case ModalType.ADD_SOURCES: return "Adicionar fontes";
        case ModalType.DISCOVER_SOURCES: return "Descobrir fontes";
        case ModalType.GENERATE_AUDIO_SUMMARY: return "Personalizar o Resumo em Áudio";
        case ModalType.GENERATE_REPORT: return "Criar relatório";
        case ModalType.GENERATE_FLASHCARDS: return "Personalizar cartões de estudo";
        case ModalType.GENERATE_TEST: return "Personalizar teste";
        default: return "Conteúdo";
     }
  }

  return (
    <>
    <div className="h-screen w-screen flex flex-col antialiased">
      <NotebookHeader notebook={notebook} onBackToDashboard={onBackToDashboard} onUpdateNotebook={onUpdateNotebook} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          sources={sources} 
          onSetActiveModal={setActiveModal}
          selectedSourceIds={selectedSourceIds}
          setSelectedSourceIds={setSelectedSourceIds}
          onSelectSourceForGuide={handleSelectSourceForGuide}
          activeSourceGuideId={activeSourceForGuide?.id || null}
          onDeleteSource={handleDeleteSource}
        />
        <main className="flex-1 flex flex-col min-w-0">
          {activeView === 'chat' ? (
            <ChatPanel 
                messages={messages} 
                sources={sources}
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                onAddNote={handleAddNote}
            />
          ) : activeSourceForGuide ? (
              <SourceGuide source={activeSourceForGuide} onBackToChat={() => handleSelectSourceForGuide(null)} />
          ): null }
        </main>
        <StudioPanel 
          setActiveModal={setActiveModal} 
          hasSources={sources.length > 0}
          studioItems={studioItems}
          onAddNote={handleAddNote}
        />
      </div>
    </div>
    <Modal
      isOpen={activeModal !== null}
      onClose={() => setActiveModal(null)}
      title={getModalTitle()}
    >
      {renderModalContent()}
    </Modal>
    </>
  );
};

export default NotebookView;