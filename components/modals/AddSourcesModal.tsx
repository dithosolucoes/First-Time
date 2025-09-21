import React from 'react';
import { UploadCloud, File, Link2, Clipboard, Globe, Youtube } from 'lucide-react';

interface AddSourcesModalProps {
    onClose: () => void;
    onAddSourceFile: (file: File) => void;
}

type SourceTab = 'upload' | 'drive' | 'link' | 'text';

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            active 
            ? 'bg-blue-100 text-[var(--accent-primary)]' 
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
        }`}
    >
        {children}
    </button>
);

const AddSourcesModal: React.FC<AddSourcesModalProps> = ({ onClose, onAddSourceFile }) => {
    const [activeTab, setActiveTab] = React.useState<SourceTab>('upload');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          onAddSourceFile(file);
          onClose();
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'upload':
                return (
                    <div 
                        onClick={handleUploadClick}
                        className="border-2 border-dashed border-[var(--border-secondary)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.txt,.md"
                        />
                        <UploadCloud size={40} className="mx-auto text-[var(--text-tertiary)] mb-3" />
                        <p className="font-medium text-[var(--text-primary)]">Arraste e solte ou selecione um arquivo</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">PDF, TXT, Markdown (até 200MB)</p>
                    </div>
                );
            case 'drive':
                return <div className="text-center p-8 text-[var(--text-secondary)]">Funcionalidade do Google Drive em breve.</div>;
            case 'link':
                return (
                    <div className="space-y-3">
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"/>
                            <input type="text" placeholder="Colar link do site" className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 pl-9 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none" />
                        </div>
                        <div className="relative">
                            <Youtube size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"/>
                            <input type="text" placeholder="Colar link do YouTube" className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 pl-9 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none" />
                        </div>
                    </div>
                );
            case 'text':
                return <textarea placeholder="Cole seu texto aqui..." className="w-full h-32 bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none" />;

        }
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 p-1 bg-[var(--bg-tertiary)] rounded-lg">
                <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
                    <File size={16} />Upload
                </TabButton>
                <TabButton active={activeTab === 'drive'} onClick={() => setActiveTab('drive')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.205 10.978L14.989 1.8a.498.498 0 00-.432-.248H5.5a.5.5 0 00-.433.248L0 10.511V11h8.667l-3.465 6H24v-6.022h-3.795zM8.333 11L12 4.511 15.667 11H8.333zM9.467 17l3.465-6h7.603l-3.465 6H9.467z"></path></svg>
                    Google Drive
                </TabButton>
                <TabButton active={activeTab === 'link'} onClick={() => setActiveTab('link')}>
                    <Link2 size={16} />Link
                </TabButton>
                <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')}>
                    <Clipboard size={16} />Texto
                </TabButton>
            </div>
            <div className="min-h-[150px] flex items-center justify-center">
                {renderContent()}
            </div>
            <button className="w-full bg-[var(--accent-primary)] text-white font-bold py-3 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50" disabled={activeTab === 'drive'}>Adicionar Fonte</button>
        </div>
    );
};

export default AddSourcesModal;
