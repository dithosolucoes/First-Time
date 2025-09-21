import React from 'react';
import type { Notebook } from '../types';
import { Check, LayoutGrid, List, MoreVertical, Plus, Settings, ChevronDown } from 'lucide-react';
import NotebookCard from './NotebookCard';

interface DashboardProps {
    notebooks: Notebook[];
    onSelectNotebook: (id: string | 'new') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notebooks, onSelectNotebook }) => {
    
    const featuredNotebooks = notebooks.filter(n => n.image);
    const recentNotebooks = notebooks.filter(n => !n.image);

    return (
        <div className="h-full w-full flex flex-col">
            <header className="flex items-center justify-between p-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-primary)]">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-1.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5-4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="currentColor" fillOpacity="0.3"/>
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4 2.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-2.5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7-2.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
                    </svg>
                    <h1 className="text-xl font-medium text-[var(--text-primary)]">Eu Digital</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors">
                        <Settings size={22} className="text-[var(--text-secondary)]" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        M
                    </div>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-6">
                        <div className="flex items-center gap-2 border border-[var(--border-secondary)] rounded-full p-0.5">
                            <button className="px-5 py-1.5 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-full">Todos</button>
                            <button className="px-5 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full">Meus notebooks</button>
                            <button className="px-5 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full">Notebooks em destaque</button>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center rounded-md border border-[var(--border-secondary)]">
                                <button className="p-2 border-r border-[var(--border-secondary)] text-[var(--accent-primary)] bg-blue-50">
                                    <LayoutGrid size={20} />
                                </button>
                                <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
                                    <List size={20} />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-md hover:bg-[var(--bg-tertiary)]">
                                Mais recentes <ChevronDown size={16} />
                            </button>
                            <button onClick={() => onSelectNotebook('new')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--black-button-bg)] text-white hover:bg-[var(--black-button-hover-bg)]">
                                <Plus size={18} /> Criar novo
                            </button>
                        </div>
                    </div>

                    {/* Featured Notebooks */}
                    <div className="mb-12">
                        <h2 className="text-xl font-medium mb-4 text-[var(--text-primary)]">Notebooks em destaque</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {featuredNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={() => onSelectNotebook(nb.id)} type="featured" />)}
                        </div>
                    </div>

                    {/* Recent Notebooks */}
                    <div>
                        <h2 className="text-xl font-medium mb-4 text-[var(--text-primary)]">Notebooks recentes</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                             <NotebookCard onClick={() => onSelectNotebook('new')} type="new" />
                             {recentNotebooks.map(nb => <NotebookCard key={nb.id} notebook={nb} onClick={() => onSelectNotebook(nb.id)} type="recent" />)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
