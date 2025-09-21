import React from 'react';
import { Share2, Settings, ArrowLeft, Check } from 'lucide-react';
import type { Notebook } from '../types';

interface NotebookHeaderProps {
  notebook: Notebook;
  onBackToDashboard: () => void;
  onUpdateNotebook: (notebook: Notebook) => void;
}

const NotebookHeader: React.FC<NotebookHeaderProps> = ({ notebook, onBackToDashboard, onUpdateNotebook }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(notebook.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleTitleChange = () => {
    setIsEditing(false);
    if (title.trim() && title.trim() !== notebook.title) {
      onUpdateNotebook({ ...notebook, title: title.trim() });
    } else {
      setTitle(notebook.title); // Revert if empty or unchanged
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleChange();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(notebook.title);
    }
  };

  return (
    <header className="flex items-center justify-between p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex-shrink-0">
      <div className="flex items-center gap-3">
         <button onClick={onBackToDashboard} className="p-2 rounded-lg hover:bg-[var(--bg-interactive)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
        </button>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
              className="text-xl font-medium bg-transparent border-b-2 border-[var(--accent-primary)] focus:outline-none"
            />
            <button onClick={handleTitleChange} className="p-1 text-[var(--accent-primary)] hover:bg-[var(--accent-light)] rounded-full">
              <Check size={18} />
            </button>
          </div>
        ) : (
          <h1 onClick={() => setIsEditing(true)} className="text-xl font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
            {notebook.title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 text-sm font-medium flex items-center gap-2 rounded-lg hover:bg-[var(--bg-interactive)] transition-colors text-[var(--text-secondary)]">
          <Share2 size={16} />
          Compartilhar
        </button>
        <button className="p-2 rounded-lg hover:bg-[var(--bg-interactive)] transition-colors text-[var(--text-secondary)]">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default NotebookHeader;
