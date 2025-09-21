import React from 'react';
import type { GeneratedContent } from '../types';
import { Mic, Video, BrainCircuit, BookOpen, Loader, CheckCircle2, PlayCircle } from 'lucide-react';

interface GeneratedContentCardProps {
    content: GeneratedContent;
}

const ICONS: { [key in GeneratedContent['type']]: React.ElementType } = {
    audio: Mic,
    video: Video,
    mindmap: BrainCircuit,
    report: BookOpen,
    flashcards: BookOpen,
    test: BookOpen,
};

const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ content }) => {
    const Icon = ICONS[content.type] || BookOpen;

    if (content.type === 'audio' && content.status === 'completed' && content.url) {
        return (
             <div className="bg-green-50 border border-green-200 p-3 rounded-lg animate-fade-in-up-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                        <Icon size={16} className="text-green-600" />
                    </div>
                    <div className="flex-grow truncate">
                        <p className="text-sm font-medium text-green-900 truncate">{content.title}</p>
                        <p className="text-xs text-green-700 capitalize">Áudio concluído</p>
                    </div>
                </div>
                <audio controls src={content.url} className="w-full h-8">
                    Your browser does not support the audio element.
                </audio>
             </div>
        );
    }

    return (
        <div className="bg-[var(--bg-tertiary)] p-3 rounded-lg animate-fade-in-up-sm flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${content.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <Icon size={16} className={content.status === 'completed' ? 'text-green-600' : 'text-orange-600'} />
            </div>
            <div className="flex-grow truncate">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{content.title}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{content.type}</p>
            </div>
            <div className="flex-shrink-0">
                {content.status === 'pending' ? (
                    <div className="flex items-center gap-1.5 text-xs text-orange-600">
                        <Loader size={14} className="animate-spin" />
                        <span>Gerando...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                         <CheckCircle2 size={14} />
                         <span>Concluído</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratedContentCard;