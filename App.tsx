import React from 'react';
import type { Notebook, View } from './types';
import Dashboard from './components/Dashboard';
import NotebookView from './components/NotebookView';
import { Book, Briefcase, FileText, GraduationCap, PenTool } from 'lucide-react';

// Mock data for notebooks
const initialNotebooks: Notebook[] = [
    // Featured
    { id: 'featured-1', title: 'Os segredos para envelhecer bem', isFeatured: true, category: 'Eric Topol', image: 'https://images.unsplash.com/photo-1542301927-c52ab5139485?q=80&w=800', lastModified: '5 de mai. de 2025', sourceCount: 17, sources: [], messages: [], studioItems: [] },
    { id: 'featured-2', title: 'William Shakespeare: as peças completas', isFeatured: true, category: 'Arte e cultura', image: 'https://images.unsplash.com/photo-1594377157620-53b3f2f5bed5?q=80&w=800', lastModified: '25 de abr. de 2025', sourceCount: 45, sources: [], messages: [], studioItems: [] },
    { id: 'featured-3', title: 'How to Build a Life, do The Atlantic', isFeatured: true, category: 'The Atlantic', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800', lastModified: '22 de abr. de 2025', sourceCount: 46, sources: [], messages: [], studioItems: [] },
    { id: 'featured-4', title: 'Guia científico para visitar Yellowstone', isFeatured: true, category: 'Viagens', image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800', lastModified: '12 de mai. de 2025', sourceCount: 17, sources: [], messages: [], studioItems: [] },
    { id: 'featured-5', title: 'Relatórios de ganhos das 50 maiores...', isFeatured: true, category: 'Negócios', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', lastModified: '17 de abr. de 2025', sourceCount: 168, sources: [], messages: [], studioItems: [] },
    // Recent
    { id: 'recent-1', title: 'NotebookLM: Usos, Recursos e...', icon: Book, lastModified: '20 de set. de 2025', sourceCount: 49, sources: [], messages: [], studioItems: [] },
    { id: 'recent-2', title: 'Empreendedorismo e Estilo: Máscaras...', icon: Briefcase, lastModified: '20 de set. de 2025', sourceCount: 2, sources: [], messages: [], studioItems: [] },
    { id: 'recent-3', title: 'Estratégias para Carreira e Beleza n...', icon: GraduationCap, lastModified: '20 de set. de 2025', sourceCount: 15, sources: [], messages: [], studioItems: [] },
    { id: 'recent-4', title: 'Untitled notebook', icon: PenTool, lastModified: '20 de set. de 2025', sourceCount: 0, sources: [], messages: [], studioItems: [] },
];


const App: React.FC = () => {
    const [notebooks, setNotebooks] = React.useState<Notebook[]>(initialNotebooks);
    const [activeView, setActiveView] = React.useState<View>('dashboard');
    const [selectedNotebook, setSelectedNotebook] = React.useState<Notebook | null>(null);

    const handleSelectNotebook = (notebookId: string | 'new') => {
        if (notebookId === 'new') {
            const newNotebook: Notebook = {
                id: crypto.randomUUID(),
                title: 'Novo Notebook',
                lastModified: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric'}),
                sourceCount: 0,
                sources: [],
                messages: [],
                studioItems: [],
                icon: FileText
            };
            setNotebooks(prev => [newNotebook, ...prev.filter(n => n.id !== newNotebook.id)]);
            setSelectedNotebook(newNotebook);
        } else {
            const notebook = notebooks.find(n => n.id === notebookId);
            if(notebook) setSelectedNotebook(notebook);
        }
        setActiveView('notebook');
    };
    
    const handleBackToDashboard = () => {
        setSelectedNotebook(null);
        setActiveView('dashboard');
    }
    
    const handleUpdateNotebook = (updatedNotebook: Notebook) => {
        setNotebooks(notebooks.map(n => n.id === updatedNotebook.id ? updatedNotebook : n));
        setSelectedNotebook(updatedNotebook); // keep the selected notebook in sync
    };

    const handleDeleteNotebook = (notebookId: string) => {
        setNotebooks(notebooks.filter(n => n.id !== notebookId));
    };

    return (
        <div className="h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
            {activeView === 'dashboard' ? (
                <Dashboard 
                    notebooks={notebooks} 
                    onSelectNotebook={handleSelectNotebook} 
                    onUpdateNotebook={handleUpdateNotebook}
                    onDeleteNotebook={handleDeleteNotebook}
                />
            ) : selectedNotebook ? (
                <NotebookView 
                    key={selectedNotebook.id} // Add key to force re-mount on notebook change
                    notebook={selectedNotebook} 
                    onUpdateNotebook={handleUpdateNotebook}
                    onBackToDashboard={handleBackToDashboard}
                />
            ) : null}
        </div>
    );
};

export default App;
