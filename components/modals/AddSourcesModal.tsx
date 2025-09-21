import React from 'react';
import { Upload, Link2, Clipboard, Compass, FileText, Youtube, Globe } from 'lucide-react';
// FIX: Import ModalType as a value to use its enum members, not just as a type.
import type { Source } from '../../types';
import { ModalType } from '../../types';

interface AddSourcesModalProps {
    onClose: () => void;
    onAddSources: (sources: Partial<Source>[]) => void;
    onSetActiveModal: (modal: ModalType | null) => void;
}

const SourceOptionCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
            <Icon size={18} className="text-[var(--text-secondary)]" />
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">{title}</h3>
        </div>
        {children}
    </div>
);


const AddSourcesModal: React.FC<AddSourcesModalProps> = ({ onClose, onAddSources, onSetActiveModal }) => {
    const [textInput, setTextInput] = React.useState('');
    const [linkInput, setLinkInput] = React.useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newSources: Partial<Source>[] = Array.from(files).map(file => ({
                name: file.name,
                type: file.type.startsWith('image/') ? 'txt' : (file.name.endsWith('.pdf') ? 'pdf' : 'txt'), // Simplified type detection
                content: `mock content for ${file.name}`
            }));
            onAddSources(newSources);
            onClose();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleAddText = () => {
        if (textInput.trim()) {
            onAddSources([{ name: `Nota de texto - ${new Date().toLocaleTimeString()}`, type: 'text', content: textInput }]);
            onClose();
        }
    };

    const handleAddLink = () => {
        if (linkInput.trim()) {
            onAddSources([{ name: linkInput, type: 'url', content: `Conteúdo mock para o link: ${linkInput}` }]);
            onClose();
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[var(--text-secondary)] text-sm max-w-md">
                        As fontes permitem que o Eu Digital baseie as respostas nas informações mais importantes para você. (Por exemplo, planos de marketing, leituras de cursos, notas de pesquisas, etc.)
                    </p>
                </div>
                <button 
                    onClick={() => onSetActiveModal(ModalType.DISCOVER_SOURCES)}
                    className="flex-shrink-0 flex items-center gap-2 bg-[var(--accent-light)] text-[var(--accent-text-deep)] font-medium py-2 px-4 rounded-lg transition-colors hover:bg-purple-200 text-sm">
                    <Compass size={16} />
                    Descobrir fontes
                </button>
            </div>
            
            <div
                className="border-2 border-dashed border-[var(--border-secondary)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors flex flex-col items-center justify-center"
                onClick={handleUploadClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.txt,.md"
                    multiple
                />
                <div className="w-12 h-12 bg-[var(--bg-interactive)] rounded-full flex items-center justify-center mb-4">
                    <Upload size={24} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">Fazer upload de fontes</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Arraste e solte ou <span className="text-[var(--accent-primary)] font-semibold">selecione o arquivo</span> para fazer upload
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-3">
                    Tipos de arquivos compatíveis: PDF, .txt, Markdown, Áudio (por exemplo, mp3)
                </p>
            </div>

            <div className="flex gap-4">
                <SourceOptionCard icon={() => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><path d="M20.205 10.978L14.989 1.8a.498.498 0 00-.432-.248H5.5a.5.5 0 00-.433.248L0 10.511V11h8.667l-3.465 6H24v-6.022h-3.795zM8.333 11L12 4.511 15.667 11H8.333zM9.467 17l3.465-6h7.603l-3.465 6H9.467z"></path></svg>} title="Google Drive">
                     <div className="flex flex-col gap-2">
                         <button disabled className="flex items-center gap-2 bg-white text-gray-500 text-sm p-2 rounded-lg border border-[var(--border-primary)] opacity-50 cursor-not-allowed">
                             <FileText size={16} /> Documentos Google
                         </button>
                         <button disabled className="flex items-center gap-2 bg-white text-gray-500 text-sm p-2 rounded-lg border border-[var(--border-primary)] opacity-50 cursor-not-allowed">
                             <FileText size={16} /> Apresentações Google
                         </button>
                     </div>
                </SourceOptionCard>
                <SourceOptionCard icon={Link2} title="Link">
                     <div className="flex flex-col gap-2">
                         <input
                            type="text"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="Colar link do site ou YouTube"
                            className="w-full bg-white rounded-lg p-2.5 text-sm border border-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none"
                         />
                         {linkInput && (
                            <button 
                                onClick={handleAddLink}
                                className="w-full bg-[var(--accent-primary)] text-white font-medium py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors text-sm animate-fade-in"
                            >
                                Adicionar
                            </button>
                         )}
                         {!linkInput && (
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 bg-white text-gray-600 text-xs p-2 rounded-lg border border-[var(--border-primary)]">
                                    <Globe size={14} /> Site
                                </span>
                                <span className="flex items-center gap-1.5 bg-white text-gray-600 text-xs p-2 rounded-lg border border-[var(--border-primary)]">
                                    <Youtube size={14} /> YouTube
                                </span>
                            </div>
                         )}
                     </div>
                </SourceOptionCard>
                <SourceOptionCard icon={Clipboard} title="Colar texto">
                     <div className="flex flex-col gap-2 h-full">
                         <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Cole seu texto aqui..."
                            className="w-full h-full flex-grow bg-white rounded-lg p-2.5 text-sm border border-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none resize-none"
                         ></textarea>
                         {textInput && (
                            <button 
                                onClick={handleAddText}
                                className="w-full bg-[var(--accent-primary)] text-white font-medium py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors text-sm animate-fade-in"
                            >
                                Adicionar
                            </button>
                         )}
                     </div>
                </SourceOptionCard>
            </div>
            <div className="mt-2">
                <label className="text-xs text-[var(--text-secondary)]">Limite de fontes</label>
                <div className="w-full bg-[var(--bg-interactive)] rounded-full h-2 mt-1">
                    <div className="bg-[var(--accent-primary)] h-2 rounded-full" style={{width: '16%'}}></div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(-5px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AddSourcesModal;