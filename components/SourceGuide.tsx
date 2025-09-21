import React from 'react';
import type { Source } from '../types';
import { ArrowLeft, FileText } from 'lucide-react';

interface SourceGuideProps {
    source: Source;
    onBackToChat: () => void;
}

const SourceGuide: React.FC<SourceGuideProps> = ({ source, onBackToChat }) => {
    return (
        <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] overflow-y-auto">
            <div className="p-4 border-b border-[var(--border-primary)]">
                <button onClick={onBackToChat} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                    <ArrowLeft size={16} />
                    Voltar para a conversa
                </button>
            </div>
            <div className="p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-[var(--accent-primary)]" size={24} />
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{source.name}</h1>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                        <h2 className="font-semibold text-[var(--text-primary)] mb-2">Resumo da IA</h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed">{source.summary}</p>
                    </div>
                    
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                        <h2 className="font-semibold text-[var(--text-primary)] mb-3">Tópicos-chave</h2>
                        <div className="flex flex-wrap gap-2">
                            {source.keyTopics.map(topic => (
                                <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceGuide;
