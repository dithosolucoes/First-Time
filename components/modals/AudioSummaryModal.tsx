import React from 'react';
import type { GeneratedContent } from '../../types';
import { Check } from 'lucide-react';

interface AudioSummaryModalProps {
    onClose: () => void;
    onGenerate: (content: Omit<GeneratedContent, 'id' | 'status'>) => void;
}

type FormatOption = 'analysis' | 'summary' | 'critique' | 'debate';
type DurationOption = 'short' | 'default' | 'long';

const formatOptions: { key: FormatOption; title: string; description: string }[] = [
    { key: 'analysis', title: 'Análise detalhada', description: 'Uma conversa animada entre dois apresentadores, que explicam e conectam temas nas suas fontes' },
    { key: 'summary', title: 'Resumo', description: 'Uma breve visão geral para ajudar você a entender as ideias principais das suas fontes com rapidez' },
    { key: 'critique', title: 'Crítica', description: 'Uma análise especializada das suas fontes, com feedback construtivo para ajudar você a aperfeiçoar seu material' },
    { key: 'debate', title: 'Debate', description: 'Um debate inteligente entre dois apresentadores, que trazem diferentes perspectivas sobre suas fontes' },
];

const FormatCard: React.FC<{
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ title, description, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        className={`relative p-3 text-left rounded-lg border cursor-pointer transition-all flex flex-col
            ${isSelected 
                ? 'bg-[var(--accent-light)] border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]' 
                : 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] hover:border-[var(--border-primary)]'
            }`}
    >
        {isSelected && <Check size={16} className="absolute top-2 right-2 text-white bg-[var(--accent-primary)] rounded-full p-0.5" />}
        <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-[var(--accent-text-deep)]' : 'text-[var(--text-primary)]'}`}>{title}</h4>
        <p className={`text-xs ${isSelected ? 'text-[var(--accent-text-deep)]' : 'text-[var(--text-secondary)]'}`}>{description}</p>
    </div>
);

const SegmentedButton: React.FC<{
    options: { key: string; label: string }[];
    selected: string;
    onSelect: (key: string) => void;
}> = ({ options, selected, onSelect }) => (
    <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
        {options.map(opt => (
             <button
                key={opt.key}
                onClick={() => onSelect(opt.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex-1
                    ${selected === opt.key
                        ? 'bg-white text-[var(--text-primary)] shadow-sm'
                        : 'bg-transparent text-[var(--text-secondary)] hover:bg-white/60'
                    }`}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

const AudioSummaryModal: React.FC<AudioSummaryModalProps> = ({ onClose, onGenerate }) => {
    const [format, setFormat] = React.useState<FormatOption>('analysis');
    const [duration, setDuration] = React.useState<DurationOption>('default');
    const [focus, setFocus] = React.useState('');
    const [language, setLanguage] = React.useState('english');

    const handleGenerate = () => {
        const selectedFormat = formatOptions.find(f => f.key === format);
        onGenerate({
            type: 'audio',
            title: selectedFormat?.title || 'Resumo em Áudio',
        });
        onClose();
    };

    return (
        <div className="space-y-5 text-sm">
             <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-2">Formato</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formatOptions.map(opt => (
                        <FormatCard 
                            key={opt.key}
                            title={opt.title}
                            description={opt.description}
                            isSelected={format === opt.key}
                            onClick={() => setFormat(opt.key)}
                        />
                    ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block font-semibold text-[var(--text-primary)] mb-2">Selecione o idioma</label>
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] rounded-lg p-2.5 border border-[var(--border-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none"
                    >
                        <option value="english">English</option>
                        <option value="portuguese">Português (Brasil)</option>
                        <option value="spanish">Español</option>
                    </select>
                 </div>
                 <div>
                    <label className="block font-semibold text-[var(--text-primary)] mb-2">Duração</label>
                    <SegmentedButton 
                        options={[{key: 'short', label: 'Mais curta'}, {key: 'default', label: 'Padrão'}, {key: 'long', label: 'Mais longa'}]}
                        selected={duration}
                        onSelect={(k) => setDuration(k as DurationOption)}
                    />
                </div>
             </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-2">Em quais aspectos os apresentadores da IA devem se concentrar nesse episódio?</label>
              <textarea 
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="Ex: foque na análise comparativa entre as fontes 1 e 2..."
                  className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none resize-none"
                  rows={2}
              ></textarea>
            </div>

            <div className="border border-[var(--border-secondary)] rounded-lg p-3 bg-[var(--bg-tertiary)]">
                <p className="font-semibold text-xs text-[var(--text-secondary)] mb-2">Testes que você pode fazer</p>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                    <li>Focar em uma fonte específica ("cobrir apenas o artigo sobre a Itália")</li>
                    <li>Focar em um assunto específico ("falar sobre o protagonista do romance")</li>
                    <li>Segmentar um público-alvo específico ("explicar para alguém que está começando a estudar biologia")</li>
                </ul>
            </div>
            
            <div className="flex justify-end pt-2">
                <button 
                    type="button" 
                    onClick={handleGenerate} 
                    className="px-8 py-2.5 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                    Gerar
                </button>
            </div>
        </div>
    );
};

export default AudioSummaryModal;