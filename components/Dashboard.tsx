import React from 'react';
import type { Notebook } from '../types';
import { LayoutGrid, List, MoreVertical, Plus, Settings, ChevronDown, Trash2, Edit } from 'lucide-react';
import NotebookCard from './NotebookCard';

interface DashboardProps {
    notebooks: Notebook[];
    onSelectNotebook: (id: string | 'new') => void;
    onUpdateNotebook: (notebook: Notebook) => void;
    onDeleteNotebook: (id:string) => void;
}

type FilterType = 'all' | 'my' | 'featured';
type ViewMode = 'grid' | 'list';

const Dashboard: React.FC<DashboardProps> = ({ notebooks, onSelectNotebook, onUpdateNotebook, onDeleteNotebook }) => {
    const [filter, setFilter] = React.useState<FilterType>('all');
    const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
    const [contextMenu, setContextMenu] = React.useState<{notebookId: string, x: number, y: number} | null>(null);

    const filteredNotebooks = React.useMemo(() => {
        switch(filter) {
            case 'featured': return notebooks.filter(n => n.isFeatured);
            case 'my': return notebooks.filter(n => !n.isFeatured);
            case 'all':
            default: return notebooks;
        }
    }, [notebooks, filter]);

    const featuredNotebooks = filteredNotebooks.filter(n => n.isFeatured);
    const recentNotebooks = filteredNotebooks.filter(n => !n.isFeatured);
    
    const handleOpenContextMenu = (e: React.MouseEvent, notebookId: string) => {
        e.stopPropagation();
        e.preventDefault();
        setContextMenu({ notebookId, x: e.clientX, y: e.clientY });
    };

    const handleRename = () => {
        if (!contextMenu) return;
        const newTitle = prompt("Novo título para o notebook:", notebooks.find(n => n.id === contextMenu.notebookId)?.title);
        if (newTitle) {
            const notebookToUpdate = notebooks.find(n => n.id === contextMenu.notebookId);
            if (notebookToUpdate) {
                onUpdateNotebook({...notebookToUpdate, title: newTitle});
            }
        }
        setContextMenu(null);
    }
    
    const handleDelete = () => {
        if (!contextMenu) return;
        if (confirm("Tem certeza que deseja deletar este notebook?")) {
            onDeleteNotebook(contextMenu.notebookId);
        }
        setContextMenu(null);
    }

    React.useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="h-full w-full flex flex-col">
            {contextMenu && (
                <div 
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px`}}
                    className="absolute z-50 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl py-2 w-40 animate-fade-in-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={handleRename} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-[var(--text-primary)] hover:bg-[var(--bg-interactive)]">
                        <Edit size={16} /> Renomear
                    </button>
                     <button onClick={handleDelete} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                        <Trash2 size={16} /> Deletar
                    </button>
                </div>
            )}
            <header className="flex items-center justify-between p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-primary)]">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4 2.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-2.5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7-2.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
                    </svg>
                    <h1 className="text-xl font-medium text-[var(--text-primary)]">Eu Digital</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-[var(--bg-interactive)] transition-colors">
                        <Settings size={22} className="text-[var(--text-secondary)]" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                        M
                    </div>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-6">
                        <div className="flex items-center gap-2 border border-[var(--border-secondary)] rounded-full p-0.5">
                            <button onClick={() => setFilter('all')} className={`px-5 py-1.5 text-sm font-medium rounded-full transition-colors ${filter === 'all' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'}`}>Todos</button>
                            <button onClick={() => setFilter('my')} className={`px-5 py-1.5 text-sm font-medium rounded-full transition-colors ${filter === 'my' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'}`}>Meus notebooks</button>
                            <button onClick={() => setFilter('featured')} className={`px-5 py-1.5 text-sm font-medium rounded-full transition-colors ${filter === 'featured' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'}`}>Notebooks em destaque</button>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center rounded-md border border-[var(--border-secondary)]">
                                <button onClick={() => setViewMode('grid')} className={`p-2 border-r border-[var(--border-secondary)] transition-colors ${viewMode === 'grid' ? 'text-[var(--accent-primary)] bg-[var(--accent-light)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'}`}>
                                    <LayoutGrid size={20} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'text-[var(--accent-primary)] bg-[var(--accent-light)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'}`}>
                                    <List size={20} />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-md hover:bg-[var(--bg-interactive)]">
                                Mais recentes <ChevronDown size={16} />
                            </button>
                            <button onClick={() => onSelectNotebook('new')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--black-button-bg)] text-white hover:bg-[var(--black-button-hover-bg)]">
                                <Plus size={18} /> Criar novo
                            </button>
                        </div>
                    </div>

                    {/* Featured Notebooks */}
                    {featuredNotebooks.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-medium mb-4 text-[var(--text-primary)]">Notebooks em destaque</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {featuredNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={() => onSelectNotebook(nb.id)} type="featured" />)}
                            </div>
                        </div>
                    )}

                    {/* Recent Notebooks */}
                    <div>
                        <h2 className="text-xl font-medium mb-4 text-[var(--text-primary)]">Notebooks recentes</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                             <NotebookCard onClick={() => onSelectNotebook('new')} type="new" />
                             {recentNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={() => onSelectNotebook(nb.id)} onOpenContextMenu={(e) => handleOpenContextMenu(e, nb.id)} type="recent" />)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
