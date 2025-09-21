import React from 'react';
import type { GeneratedContent } from '../../types';
import { ArrowLeft, Edit3, FileText, BarChart, Lightbulb, PenSquare, Briefcase, TrendingUp, Sparkles } from 'lucide-react';

interface GenerateReportModalProps {
    onClose: () => void;
    onGenerate: (content: Omit<GeneratedContent, 'id' | 'status'>) => void;
}

const reportFormats = [
    { title: 'Crie do zero', description: 'Crie relatórios personalizados especificando a estrutura, o estilo e o tom e muito mais.', icon: Edit3 },
    { title: 'Documento de resumo', description: 'Visão geral das suas fontes, com destaque para os principais insights e citações', icon: FileText },
    { title: 'Guia de estudo', description: 'Teste de respostas rápidas, perguntas sugeridas para uma redação e principais termos...', icon: Lightbulb },
    { title: 'Post de blog', description: 'Conclusões inteligentes descritas em um artigo fácil de ler', icon: PenSquare },
    { title: 'Relatório de investimento', description: 'Uma análise detalhada da filosofia de investimentos e da metodologia do Método Icaro.', icon: BarChart },
    { title: 'Plano de marketing', description: 'Um plano de marketing estratégico delineando os principais argumentos de...', icon: Briefcase },
    { title: 'Introdução ao trading', description: 'Descubra os pilares fundamentais do Método Icaro para iniciar no mercado.', icon: TrendingUp },
    { title: 'Narrativa de jornada', description: 'Acompanhe a jornada de Icaro Di Gaspare e como ele desenvolveu seu método.', icon: Sparkles },
];

const ReportFormatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="p-3 text-left rounded-lg bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-secondary)] transition-all flex flex-col">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={16} className="text-[var(--text-secondary)]"/>
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">{title}</h4>
        </div>
        <p className="text-xs text-[var(--text-secondary)] flex-grow">{description}</p>
    </button>
);


const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ onClose, onGenerate }) => {
    const [step, setStep] = React.useState(1);
    const [selectedFormat, setSelectedFormat] = React.useState<string | null>(null);
    const [description, setDescription] = React.useState('');

    const handleSelectFormat = (formatTitle: string) => {
        setSelectedFormat(formatTitle);
        setStep(2);
    };

    const handleGenerate = () => {
        if (!selectedFormat) return;
        onGenerate({
            type: 'report',
            title: `Relatório: ${selectedFormat}`,
        });
        onClose();
    };

    const renderStepOne = () => (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Formato</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <ReportFormatCard title={reportFormats[0].title} description={reportFormats[0].description} icon={reportFormats[0].icon} onClick={() => handleSelectFormat(reportFormats[0].title)} />
                    <ReportFormatCard title={reportFormats[1].title} description={reportFormats[1].description} icon={reportFormats[1].icon} onClick={() => handleSelectFormat(reportFormats[1].title)} />
                    <ReportFormatCard title={reportFormats[2].title} description={reportFormats[2].description} icon={reportFormats[2].icon} onClick={() => handleSelectFormat(reportFormats[2].title)} />
                    <ReportFormatCard title={reportFormats[3].title} description={reportFormats[3].description} icon={reportFormats[3].icon} onClick={() => handleSelectFormat(reportFormats[3].title)} />
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Formato sugerido</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <ReportFormatCard title={reportFormats[4].title} description={reportFormats[4].description} icon={reportFormats[4].icon} onClick={() => handleSelectFormat(reportFormats[4].title)} />
                    <ReportFormatCard title={reportFormats[5].title} description={reportFormats[5].description} icon={reportFormats[5].icon} onClick={() => handleSelectFormat(reportFormats[5].title)} />
                    <ReportFormatCard title={reportFormats[6].title} description={reportFormats[6].description} icon={reportFormats[6].icon} onClick={() => handleSelectFormat(reportFormats[6].title)} />
                    <ReportFormatCard title={reportFormats[7].title} description={reportFormats[7].description} icon={reportFormats[7].icon} onClick={() => handleSelectFormat(reportFormats[7].title)} />
                </div>
            </div>
        </div>
    );
    
    const renderStepTwo = () => (
        <div className="space-y-6">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft size={16} /> Voltar
            </button>
            <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-2">Selecione o idioma</label>
                <select className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 border border-[var(--border-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none">
                    <option>English (padrão)</option>
                    <option>Português</option>
                    <option>Español</option>
                </select>
            </div>
            <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-2">Descreva o relatório que você quer criar</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Por exemplo: Crie uma análise formal e competitiva sobre o mercado de bebidas funcionais em 2026 para uma nova bebida saudável..."
                  className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none resize-none"
                  rows={4}
                ></textarea>
            </div>
            <div className="flex justify-end pt-2">
                <button 
                    type="button" 
                    onClick={handleGenerate} 
                    className="px-6 py-2.5 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:bg-gray-300"
                    disabled={!description.trim()}
                >
                    Gerar
                </button>
            </div>
        </div>
    );

    return (
        <div>
            {step === 1 ? renderStepOne() : renderStepTwo()}
        </div>
    );
};

export default GenerateReportModal;