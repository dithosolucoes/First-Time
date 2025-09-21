import type { FC } from 'react';
import React from 'react';
import type { Message, Source } from '../types';
import { SendHorizonal, Bot, Loader, FileText, Bookmark, Plus } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  sources: Source[];
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  onAddNote: (content: string) => void;
}

const Citation: FC<{ source?: Source, number: number }> = ({ source, number }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <sup 
      className="relative inline-block mx-0.5"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="bg-blue-100 text-[var(--accent-primary)] font-mono text-xs font-bold px-1.5 py-0.5 rounded-full cursor-pointer">
        {number}
      </span>
      {showTooltip && source && (
        <div className="absolute bottom-full mb-2 w-72 bg-[var(--text-primary)] border border-gray-700 p-3 rounded-lg text-xs text-gray-200 z-10 shadow-lg animate-fade-in-up-sm">
          <p className="font-bold text-blue-400 mb-1 truncate">{source.name}</p>
          <p className="line-clamp-3 text-gray-300">{source.content}</p>
        </div>
      )}
    </sup>
  );
};

const ChatMessage: FC<{ message: Message; sources: Source[], onAddNote: (content: string) => void }> = ({ message, sources, onAddNote }) => {
  const isUser = message.sender === 'user';

  const renderTextWithCitations = (text: string) => {
    return text.split(/(\[\d+\])/g).map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNumber = parseInt(match[1], 10);
        const citation = message.citations?.find(c => c.citationNumber === citationNumber);
        const source = citation ? sources.find(s => s.id === citation.sourceId) : undefined;
        return <Citation key={index} source={source} number={citationNumber} />;
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  const usedSourceIds = new Set(message.citations?.map(c => c.sourceId));
  const relevantSources = sources.filter(s => usedSourceIds.has(s.id));

  return (
    <div className={`group flex flex-col gap-3 animate-fade-in-up-sm ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 w-full max-w-2xl ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Bot size={20} className="text-[var(--accent-primary)]" />
          </div>
        )}
        <div className={`relative px-4 py-3 rounded-xl ${isUser ? 'bg-[var(--accent-primary)] text-white rounded-br-none' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-none'}`}>
          {message.isLoading ? (
              <div className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span>Pensando...</span>
              </div>
          ) : (
             <p className="whitespace-pre-wrap leading-relaxed">{renderTextWithCitations(message.text)}</p>
          )}
           {!isUser && !message.isLoading && (
              <button 
                onClick={() => onAddNote(message.text)}
                className="absolute -top-3 -right-3 p-1.5 bg-white border border-[var(--border-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-tertiary)]"
                title="Salvar como Nota"
              >
                  <Bookmark size={14} className="text-[var(--text-secondary)]" />
              </button>
           )}
        </div>
      </div>
      {!isUser && relevantSources.length > 0 && (
         <div className="max-w-2xl ml-11 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Fontes:</span>
             {relevantSources.map(source => (
                <div key={source.id} className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs px-2 py-1 rounded-full">
                    <FileText size={12} />
                    {source.name}
                </div>
             ))}
         </div>
      )}
       <style>{`
        @keyframes fade-in-up-sm {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-sm { animation: fade-in-up-sm 0.3s ease-out forwards; }
        .line-clamp-3 {
            overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

const ChatPanel: FC<ChatPanelProps> = ({ messages, sources, onSendMessage, isLoading, onAddNote }) => {
  const [prompt, setPrompt] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  React.useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  const placeholderPrompts = [
    "Como o conceito de RAG se aplica a este material?",
    "Crie uma tabela comparando os dois documentos.",
    "Quais são as implicações das estratégias de mitigação?"
  ];

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-primary)]">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          {messages.map((msg) => <ChatMessage key={msg.id} message={msg} sources={sources} onAddNote={onAddNote}/>)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-[var(--border-primary)] bg-white/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {placeholderPrompts.slice(0, 3).map((p, i) => (
              <button key={i} onClick={() => setPrompt(p)} className="bg-[var(--bg-tertiary)] p-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)] transition-colors text-left">
                  {p}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-xl p-1 border border-[var(--border-secondary)] focus-within:ring-2 focus-within:ring-[var(--accent-primary)] transition-all">
            <button type="button" onClick={() => onAddNote("")} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
                <Plus size={20} />
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Faça uma pergunta ou adicione uma nota..."
              className="flex-1 bg-transparent focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-[var(--accent-primary)] text-white rounded-lg p-3 hover:bg-[var(--accent-primary-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <SendHorizonal size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
