import type { FC } from 'react';
import React from 'react';
import type { Source } from '../types';
import { ModalType } from '../types';
import { Plus, Compass, FileText, CheckSquare, Square } from 'lucide-react';

interface SidebarProps {
  sources: Source[];
  onSetActiveModal: (modal: ModalType | null) => void;
  selectedSourceIds: Set<string>;
  setSelectedSourceIds: (ids: Set<string>) => void;
  onSelectSourceForGuide: (id: string | null) => void;
  activeSourceGuideId: string | null;
}

const Sidebar: FC<SidebarProps> = ({ sources, onSetActiveModal, selectedSourceIds, setSelectedSourceIds, onSelectSourceForGuide, activeSourceGuideId }) => {

  const handleSourceSelection = (sourceId: string) => {
    const newSet = new Set(selectedSourceIds);
    if (newSet.has(sourceId)) {
      newSet.delete(sourceId);
    } else {
      newSet.add(sourceId);
    }
    setSelectedSourceIds(newSet);
  };
  
  const handleSelectAll = () => {
      if (selectedSourceIds.size === sources.length) {
          setSelectedSourceIds(new Set());
      } else {
          setSelectedSourceIds(new Set(sources.map(s => s.id)));
      }
  };

  return (
    <aside className="bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] p-4 flex flex-col gap-4 w-96 flex-shrink-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] px-2">FONTES</h2>
        <div className="flex gap-2">
            <button onClick={() => onSetActiveModal(ModalType.ADD_SOURCES)} className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
                <Plus size={18} />
                Adicionar
            </button>
            <button onClick={() => onSetActiveModal(ModalType.DISCOVER_SOURCES)} className="flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
                <Compass size={18} />
                Descobrir
            </button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col gap-1 overflow-y-auto pr-2 -mr-2">
        {sources.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-center text-[var(--text-secondary)] p-4">
            <p>Clique em "Adicionar" para incluir suas fontes.</p>
          </div>
        ) : (
          <>
            <div className="px-2 py-1 flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Selecionar todas as fontes</label>
                <button onClick={handleSelectAll} className="p-1">
                    {selectedSourceIds.size === sources.length ? <CheckSquare size={16} className="text-[var(--accent-primary)]" /> : <Square size={16} className="text-[var(--text-tertiary)]" />}
                </button>
            </div>
            {sources.map(source => (
              <div
                  key={source.id} 
                  className={`p-2 pl-1 rounded-lg flex items-center gap-3 cursor-pointer transition-all duration-200 group
                              ${activeSourceGuideId === source.id 
                                  ? 'bg-blue-100' 
                                  : 'hover:bg-[var(--bg-tertiary)]'}`
                  }
              >
                <button onClick={() => handleSourceSelection(source.id)} className="p-1">
                    {selectedSourceIds.has(source.id) ? <CheckSquare size={16} className="text-[var(--accent-primary)]" /> : <Square size={16} className="text-[var(--text-tertiary)]" />}
                </button>
                <div onClick={() => onSelectSourceForGuide(source.id)} className="flex items-center gap-2 flex-grow truncate">
                    <FileText className={`
                        ${selectedSourceIds.has(source.id) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}
                        ${activeSourceGuideId === source.id ? 'text-[var(--accent-primary)]' : ''}
                    `} size={20} />
                    <span className={`text-sm font-medium truncate ${activeSourceGuideId === source.id ? 'text-blue-800' : 'text-[var(--text-primary)]'}`}>{source.name}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
