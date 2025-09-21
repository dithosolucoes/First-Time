import React from 'react';
import type { AudioFormatOption, AudioDurationOption } from '../../types';

interface AudioSummaryModalProps {
    onClose: () => void;
}

const OptionButton: React.FC<{
  isSelected: boolean; 
  onClick: () => void; 
  title: string;
  description: string;
}> = ({ isSelected, onClick, title, description }) => (
      <button 
        onClick={onClick}
        className={`p-3 text-left rounded-lg border-2 transition-colors w-full flex-grow
          ${isSelected 
            ? 'bg-blue-100 border-blue-500' 
            : 'bg-[var(--bg-tertiary)] border-transparent hover:border-[var(--border-secondary)]'
          }`}
      >
        <h4 className={`font-semibold text-sm ${isSelected ? 'text-blue-800' : 'text-[var(--text-primary)]'}`}>{title}</h4>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
      </button>
);

const DurationButton: React.FC<{
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isSelected, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex-1
            ${isSelected
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-interactive)] text-[var(--text-primary)] hover:bg-gray-300'
            }`}
    >
        {children}
    </button>
);

const AudioSummaryModal: React.FC<AudioSummaryModalProps> = ({ onClose }) => {
    const [format, setFormat] = React.useState<AudioFormatOption>('analysis');
    const [duration, setDuration] = React.useState<AudioDurationOption>('medium');

    return (
        <div className="space-y-6 text-sm">
            <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-3">Formato</label>
                <div className="grid grid-cols-2 gap-3">
                    <OptionButton title="Análise detalhada" description="Uma conversa animada que explora e conecta temas." isSelected={format === 'analysis'} onClick={() => setFormat('analysis')} />
                    <OptionButton title="Resumo" description="Uma breve visão geral para ajudar você a entender as ideias principais." isSelected={format === 'summary'} onClick={() => setFormat('summary')} />
                    <OptionButton title="Crítica" description="Uma análise especializada com um ponto de vista para aprofundar o material." isSelected={format === 'critique'} onClick={() => setFormat('critique')} />
                    <OptionButton title="Debate" description="Um debate inteligente entre dois apresentadores com visões diferentes." isSelected={format === 'debate'} onClick={() => setFormat('debate')} />
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                 <div className="flex-1">
                    <label className="block font-semibold text-[var(--text-primary)] mb-3">Selecione o idioma</label>
                    <select className="w-full bg-[var(--bg-tertiary)] rounded-lg p-2 border border-[var(--border-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none">
                        <option>English</option>
                        <option>Português</option>
                        <option>Español</option>
                    </select>
                 </div>
                 <div className="flex-1">
                     <label className="block font-semibold text-[var(--text-primary)] mb-3">Duração</label>
                     <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                        <DurationButton isSelected={duration === 'short'} onClick={() => setDuration('short')}>Mais curta</DurationButton>
                        <DurationButton isSelected={duration === 'medium'} onClick={() => setDuration('medium')}>Padrão</DurationButton>
                        <DurationButton isSelected={duration === 'long'} onClick={() => setDuration('long')}>Mais longa</DurationButton>
                     </div>
                 </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-2">Em quais aspectos os apresentadores da IA devem se concentrar nesse episódio?</label>
              <textarea placeholder="Testes que você pode fazer..." className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none" rows={4}></textarea>
            </div>
            <button className="w-full bg-[var(--accent-primary)] text-white font-bold py-3 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors">Gerar</button>
        </div>
    );
};

export default AudioSummaryModal;
