import React from 'react';
import type { GeneratedContent } from '../../types';

interface GenerateTestModalProps {
    onClose: () => void;
    onGenerate: (content: Omit<GeneratedContent, 'id' | 'status'>) => void;
}

type CountOption = 'less' | 'default' | 'more';
type DifficultyOption = 'easy' | 'medium' | 'hard';

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
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex-1
                    ${selected === opt.key
                        ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                        : 'bg-transparent text-[var(--text-primary)] hover:bg-white/60'
                    }`}
            >
                {opt.label}
            </button>
        ))}
    </div>
);


const GenerateTestModal: React.FC<GenerateTestModalProps> = ({ onClose, onGenerate }) => {
    const [questionCount, setQuestionCount] = React.useState<CountOption>('default');
    const [difficulty, setDifficulty] = React.useState<DifficultyOption>('medium');
    const [theme, setTheme] = React.useState('');

    const handleGenerate = () => {
        onGenerate({
            type: 'test',
            title: `Teste: ${theme || 'Geral'}`,
        });
        onClose();
    };

    return (
        <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold text-[var(--text-primary)] mb-2">Número de questões</label>
                    <SegmentedButton 
                        options={[{key: 'less', label: 'Menos'}, {key: 'default', label: 'Padrão'}, {key: 'more', label: 'Mais'}]}
                        selected={questionCount}
                        onSelect={(k) => setQuestionCount(k as CountOption)}
                    />
                </div>
                 <div>
                    <label className="block font-semibold text-[var(--text-primary)] mb-2">Nível de dificuldade</label>
                    <SegmentedButton 
                        options={[{key: 'easy', label: 'Fácil'}, {key: 'medium', label: 'Médio'}, {key: 'hard', label: 'Difícil'}]}
                        selected={difficulty}
                        onSelect={(k) => setDifficulty(k as DifficultyOption)}
                    />
                </div>
            </div>
            
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-2">Qual deve ser o tema?</label>
              <textarea 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: teste sobre os principais conceitos do Método Icaro"
                  className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none resize-none"
                  rows={3}
              ></textarea>
            </div>

            <div className="border border-[var(--border-secondary)] rounded-lg p-3 bg-[var(--bg-tertiary)]">
                <p className="font-semibold text-xs text-[var(--text-secondary)] mb-2">Testes que você pode fazer</p>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                    <li>O teste precisa se restringir a uma fonte específica (por exemplo, "o artigo sobre a Itália")</li>
                    <li>O teste precisa focar só os conceitos fundamentais da física</li>
                    <li>Crie um teste para eu estudar para a prova de história sobre o Egito Antigo</li>
                </ul>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-bold rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)]"
                >
                    Cancelar
                </button>
                <button 
                    type="button" 
                    onClick={handleGenerate} 
                    className="px-6 py-2.5 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                    Gerar
                </button>
            </div>
        </div>
    );
};

export default GenerateTestModal;