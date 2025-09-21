import React from 'react';
import { Share2, Settings, ArrowLeft } from 'lucide-react';
import type { Notebook } from '../types';

interface NotebookHeaderProps {
  notebook: Notebook;
  onBackToDashboard: () => void;
}

const NotebookHeader: React.FC<NotebookHeaderProps> = ({ notebook, onBackToDashboard }) => {
  return (
    <header className="flex items-center justify-between p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex-shrink-0">
      <div className="flex items-center gap-3">
         <button onClick={onBackToDashboard} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
        </button>
        <h1 className="text-xl font-medium text-[var(--text-primary)]">{notebook.title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 text-sm font-medium flex items-center gap-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]">
          <Share2 size={16} />
          Compartilhar
        </button>
        <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default NotebookHeader;
