import React from 'react';
import type { Notebook } from '../types';
import { MoreVertical, Plus } from 'lucide-react';

interface NotebookCardProps {
    notebook?: Notebook;
    onClick: () => void;
    type: 'featured' | 'recent' | 'new';
}

const NotebookCard: React.FC<NotebookCardProps> = ({ notebook, onClick, type }) => {
    
    if (type === 'new') {
        return (
            <button 
                onClick={onClick} 
                className="group bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg p-4 flex flex-col items-center justify-center text-center aspect-[4/3] hover:shadow-md transition-shadow"
            >
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                    <Plus size={24} className="text-gray-500 group-hover:text-[var(--accent-primary)] transition-colors" />
                </div>
                <h3 className="font-medium text-[var(--text-primary)]">Criar novo notebook</h3>
            </button>
        );
    }
    
    if (!notebook) return null;

    if (type === 'featured') {
        return (
            <div onClick={onClick} className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                <img src={notebook.image} alt={notebook.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="text-xs font-medium">{notebook.category}</span>
                    <h3 className="font-semibold mt-1 leading-tight">{notebook.title}</h3>
                </div>
            </div>
        );
    }

    if (type === 'recent') {
        const Icon = notebook.icon;
        return (
            <div onClick={onClick} className="group bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg p-4 flex flex-col aspect-[4/3] cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    {Icon && <Icon className="text-[var(--text-secondary)]" size={24} />}
                    <button className="p-1 -mr-2 -mt-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={18}/>
                    </button>
                </div>
                <div className="flex-grow flex items-end">
                    <h3 className="font-medium text-[var(--text-primary)] leading-tight">{notebook.title}</h3>
                </div>
                <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                    <span>{notebook.lastModified} &middot; {notebook.sourceCount} fontes</span>
                </div>
            </div>
        );
    }

    return null;
};

export default NotebookCard;
