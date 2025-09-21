import type { FC } from 'react';
import React from 'react';
import { ModalType, type StudioItem, type Note } from '../types';
import { Mic, Video, BrainCircuit, BookOpen, Plus } from 'lucide-react';

interface StudioPanelProps {
  setActiveModal: (modal: ModalType | null) => void;
  hasSources: boolean;
  studioItems: StudioItem[];
  onAddNote: (content: string) => void;
}

const StudioActionButton: FC<{icon: React.ElementType, title: string, onClick: () => void, disabled?: boolean}> = ({ icon: Icon, title, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="bg-[var(--bg-tertiary)] p-3 rounded-xl flex flex-col items-center justify-center text-center aspect-square
                   hover:bg-[var(--bg-interactive)] hover:ring-2 hover:ring-[var(--accent-primary)] ring-transparent transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--bg-tertiary)] disabled:hover:ring-transparent"
    >
        <Icon size={24} className="text-[var(--accent-primary)] mb-2" />
        <h3 className="font-medium text-xs text-[var(--text-primary)]">{title}</h3>
    </button>
);

const NoteCard: FC<{note: Note}> = ({ note }) => {
    return (
        <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg animate-fade-in-up-sm">
            <p className="text-sm text-[var(--text-primary)] line-clamp-4">{note.content || "Nova nota..."}</p>
        </div>
    );
};


const StudioPanel: FC<StudioPanelProps> = ({ setActiveModal, hasSources, studioItems, onAddNote }) => {
    const actions = [
        { icon: Mic, title: 'Resumo em Áudio', modal: ModalType.GENERATE_AUDIO_SUMMARY },
        { icon: Video, title: 'Resumo em Vídeo', modal: null },
        { icon: BrainCircuit, title: 'Mapa mental', modal: null },
        { icon: BookOpen, title: 'Relatórios', modal: ModalType.GENERATE_REPORT },
    ];
    
  return (
    <aside className="bg-[var(--bg-secondary)] border-l border-[var(--border-primary)] p-4 flex flex-col gap-4 w-96 flex-shrink-0">
        <div className="flex justify-between items-center">
             <h2 className="text-sm font-semibold text-[var(--text-secondary)] px-2">ESTÚDIO</h2>
             <button 
                onClick={() => onAddNote('')}
                className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] text-[var(--text-primary)] font-medium py-1 px-3 rounded-lg transition-colors text-sm"
             >
                <Plus size={16} />
                Nota
             </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {actions.map(action => (
                <StudioActionButton 
                    key={action.title} 
                    icon={action.icon} 
                    title={action.title} 
                    onClick={() => action.modal && setActiveModal(action.modal)}
                    disabled={!hasSources || !action.modal}
                />
            ))}
        </div>

        <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-2 -mr-2 mt-2 border-t border-[var(--border-primary)] pt-4">
            {studioItems.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-center text-[var(--text-tertiary)] p-4">
                    <p className="text-sm">Suas notas e conteúdos gerados aparecerão aqui.</p>
                </div>
            ) : (
                studioItems.map(item => {
                    if (item.type === 'note') {
                        return <NoteCard key={item.id} note={item} />
                    }
                    // Render other studio item types here in the future
                    return null;
                })
            )}
        </div>
         <style>{`
        .line-clamp-4 {
            overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4;
        }
      `}</style>
    </aside>
  );
};

export default StudioPanel;
