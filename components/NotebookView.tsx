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
import type { Source, Message, Note, StudioItem, Notebook } from '../types';
import { ModalType } from '../types';
import { getChatResponse } from '../services/geminiService';

interface NotebookViewProps {
    notebook: Notebook;
    onUpdateNotebook: (notebook: Notebook) => void;
    onBackToDashboard: () => void;
}

const NotebookView: React.FC<NotebookViewProps> = ({ notebook, onUpdateNotebook, onBackToDashboard }) => {
  const [sources, setSources] = React.useState<Source[]>(notebook.sources.length > 0 ? notebook.sources : [
    { id: '1', name: 'Analise_RAG_NotebookLM.pdf', type: 'pdf', content: 'A limitação principal do NotebookLM é sua incapacidade de processar e recuperar informações da totalidade de um único documento extenso...', summary: 'Este documento analisa a falha crítica de truncamento de contexto em documentos extensos no NotebookLM, atribuindo-a à implementação da arquitetura de Geração Aumentada por Recuperação (RAG).', keyTopics: ['RAG', 'Truncamento de Contexto', 'Limitações de IA'] },
    { id: '2', name: 'Estrategias_Mitigacao.txt', type: 'txt', content: 'A principal estratégia de mitigação identificada é a divisão manual de documentos grandes em partes menores e mais gerenciáveis antes do upload...', summary: 'Descreve as estratégias adotadas pelos usuários para contornar as limitações do sistema, como a fragmentação manual de documentos e a formulação de consultas focadas em semântica.', keyTopics: ['Mitigação', 'Fragmentação Manual', 'Consultas Semânticas'] }
  ]);
  const [messages, setMessages] = React.useState<Message[]>(notebook.messages.length > 0 ? notebook.messages : [
     {
      id: 'initial-summary',
      sender: 'ai',
      text: 'Bem-vindo! Com base nas 2 fontes de exemplo, aqui está um resumo rápido: Os documentos discutem as limitações da arquitetura RAG e as estratégias que os usuários desenvolvem para mitigar esses problemas, como a segmentação manual de arquivos.',
      citations: [{sourceId: '1', citationNumber: 1}, {sourceId: '2', citationNumber: 2}]
    },
  ]);
  const [studioItems, setStudioItems] = React.useState<StudioItem[]>(notebook.studioItems);
  const [activeModal, setActiveModal] = React.useState<ModalType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = React.useState<Set<string>>(new Set(sources.map(s => s.id)));
  const [activeView, setActiveView] = React.useState<'chat' | 'sourceGuide'>('chat');
  const [activeSourceForGuide, setActiveSourceForGuide] = React.useState<Source | null>(null);
  
  const handleAddSource = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const newSource: Source = {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type.includes('pdf') ? 'pdf' : 'txt',
            content: e.target?.result as string,
            summary: 'Novo documento adicionado. O resumo será gerado aqui.',
            keyTopics: ['Novo tópico 1', 'Novo tópico 2'],
        };
        setSources(prev => [...prev, newSource]);
        setSelectedSourceIds(prev => new Set(prev).add(newSource.id));
    };
    reader.readAsText(file);
  };
  
  const handleAddNote = (noteContent: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      type: 'note',
      content: noteContent,
    };
    setStudioItems(prev => [newNote, ...prev]);
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
      const aiResponse = await getChatResponse(prompt, Array.from(selectedSourceIds));
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
        return <AddSourcesModal onClose={() => setActiveModal(null)} onAddSourceFile={handleAddSource} />;
      case ModalType.DISCOVER_SOURCES:
        return <DiscoverSourcesModal onClose={() => setActiveModal(null)} />;
      case ModalType.GENERATE_AUDIO_SUMMARY:
        return <AudioSummaryModal onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
     switch (activeModal) {
        case ModalType.ADD_SOURCES: return "Adicionar fontes";
        case ModalType.DISCOVER_SOURCES: return "Descobrir fontes";
        case ModalType.GENERATE_AUDIO_SUMMARY: return "Personalizar o Resumo em Áudio";
        default: return "Conteúdo";
     }
  }

  return (
    <>
    <div className="h-screen w-screen flex flex-col antialiased">
      <NotebookHeader notebook={notebook} onBackToDashboard={onBackToDashboard} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          sources={sources} 
          onSetActiveModal={setActiveModal}
          selectedSourceIds={selectedSourceIds}
          setSelectedSourceIds={setSelectedSourceIds}
          onSelectSourceForGuide={handleSelectSourceForGuide}
          activeSourceGuideId={activeSourceForGuide?.id || null}
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
