
import React, { useState, useRef } from 'react';
import { DownloadIcon, UploadCloudIcon, FileTextIcon, CheckCircleIcon, SpinnerIcon, ShareIcon } from './Icons';

interface TemplateManagerProps {
    onDownloadTemplate: () => void;
    onUploadTemplate: (file: File) => void;
    onTestTemplate: () => void;
    onSimulateDelegated: () => void;
    currentTemplateName: string;
    isPremiumMode: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onDownloadTemplate, onUploadTemplate, onTestTemplate, onSimulateDelegated, currentTemplateName, isPremiumMode }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    
    const processFile = (file: File) => {
        setUploadedFile(file);
        setIsUploading(true);
        
        // Simulation of upload and processing
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setTimeout(() => {
                    onUploadTemplate(file);
                }, 500);
            }
        }, 100);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="animate-fadeIn max-w-3xl mx-auto space-y-8 py-8">
            
            <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl font-light text-white tracking-wide">Gestão de Layouts</h2>
                <p className="text-slate-400 text-sm">Baixe o modelo atual, customize e faça o upload para atualizar o padrão de relatórios.</p>
            </div>

            {/* Step 1: Download */}
            <div className="bg-[#131825] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileTextIcon className="w-24 h-24 text-blue-500" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">1</div>
                        <h3 className="text-lg font-semibold text-white">Modelo Base</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 max-w-lg">
                        Obtenha o arquivo PDF padrão do sistema contendo a estrutura de dados e tags de substituição para edição manual.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={onDownloadTemplate}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/10 transition-all hover:shadow-lg hover:shadow-blue-900/10"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            <span>Baixar Template Atual ({currentTemplateName})</span>
                        </button>
                        
                        <button 
                            onClick={onSimulateDelegated}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 transition-all"
                        >
                            <ShareIcon className="w-5 h-5" />
                            <span>Simular Visão Cliente</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Arrow Visual */}
            <div className="flex justify-center opacity-30">
                <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>

            {/* Step 2: Upload */}
            <div 
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-10 flex flex-col items-center justify-center gap-4
                    ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-[#131825] hover:bg-[#181e30]'}
                    ${isPremiumMode ? 'border-emerald-500/30 bg-emerald-500/5' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                 <div className="absolute top-4 left-4 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isPremiumMode ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>2</div>
                    <h3 className={`text-sm font-semibold ${isPremiumMode ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {isPremiumMode ? 'Modelo Customizado Ativo' : 'Upload do Modelo Ajustado'}
                    </h3>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileSelect} 
                />

                {isPremiumMode && !isUploading ? (
                     <div className="text-center animate-scaleIn w-full">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <CheckCircleIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Template Atualizado</h4>
                        <p className="text-emerald-400/80 text-sm mt-2 mb-8">O sistema está utilizando seu layout personalizado.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={onTestTemplate} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
                                <FileTextIcon className="w-4 h-4" />
                                Simular Relatório PDF
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-medium text-sm transition-all">
                                Substituir arquivo
                            </button>
                        </div>
                     </div>
                ) : isUploading ? (
                    <div className="w-full max-w-xs text-center">
                        <SpinnerIcon className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                        <p className="text-slate-300 text-sm mb-4">Processando layout e identificando tags...</p>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-mono">{uploadProgress}%</p>
                    </div>
                ) : (
                    <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-16 h-16 bg-slate-800/50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                            <UploadCloudIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-medium text-slate-200">Arraste seu PDF editado aqui</h4>
                        <p className="text-slate-500 text-xs mt-2 mb-6">ou clique para selecionar do computador</p>
                        <span className="px-4 py-2 bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/30">Selecionar Arquivo</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateManager;
