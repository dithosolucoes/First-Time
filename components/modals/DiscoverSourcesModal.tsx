import React from 'react';
import { SendHorizonal } from 'lucide-react';

interface DiscoverSourcesModalProps {
    onClose: () => void;
}

type FindSourceOption = 'web' | 'drive';

const DiscoverSourcesModal: React.FC<DiscoverSourcesModalProps> = ({ onClose }) => {
    const [findFrom, setFindFrom] = React.useState<FindSourceOption>('web');

    return (
        <div className="space-y-4">
            <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-2">Quais são seus interesses?</label>
                <textarea 
                    placeholder="Descreva algo que você gostaria de aprender ou clique em 'Quero saber mais' para ver um novo assunto." 
                    className="w-full bg-[var(--bg-tertiary)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none" 
                    rows={3}
                ></textarea>
            </div>
            <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-2">Find sources from:</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
                        <input type="radio" name="sourceFrom" value="web" checked={findFrom === 'web'} onChange={() => setFindFrom('web')} className="form-radio text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" />
                        Da Web
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
                        <input type="radio" name="sourceFrom" value="drive" checked={findFrom === 'drive'} onChange={() => setFindFrom('drive')} className="form-radio text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" />
                        Google Drive
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)]">Quero saber mais</button>
                <button className="px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors">
                    Enviar
                    <SendHorizonal size={16} />
                </button>
            </div>
        </div>
    );
};

export default DiscoverSourcesModal;
