
import React from 'react';
import { Inspection, PointOfInterest, InspectionType } from '../types';
import { FileTextIcon, SpinnerIcon, SaveIcon, ShareIcon, LinkIcon } from './Icons';

interface InspectionDetailProps {
  inspection: Inspection;
  poiTypes: PointOfInterest[];
  onSelectPoiType: (poiId: string) => void;
  onGenerateReport: () => void;
  isGeneratingPdf: boolean;
  onSave: () => void;
  onSimulateExternalAccess?: () => void;
}

const InspectionDetail: React.FC<InspectionDetailProps> = ({ inspection, poiTypes, onSelectPoiType, onGenerateReport, isGeneratingPdf, onSave, onSimulateExternalAccess }) => {
    
  const isDelegated = inspection.type === InspectionType.DELEGATED;
  const atLeastOnePoiStarted = inspection.poiInstances.some(p => isDelegated ? (p.phases[0]?.dataUrl || p.phases[0]?.status === 'not_applicable') : p.currentPhase > 0);
  const handleShareLink = () => { navigator.clipboard.writeText(`https://vistoria.qualiseg.com/v/${inspection.id}`); alert(`Link copiado.`); };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Card */}
      <div className="relative rounded-3xl bg-[#131825] border border-white/5 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
                        {inspection.id.split('-')[1]}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-900/30 text-blue-400 border border-blue-900/50">
                        Em Andamento
                    </span>
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">{inspection.establishmentName}</h2>
                <p className="text-sm text-slate-400 font-light">{inspection.address}</p>
            </div>
            
            <div className="flex flex-col items-end justify-center gap-1 bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progresso</span>
                <div className="flex items-end gap-1">
                    <span className="text-xl font-semibold text-emerald-400">
                        {Math.round((inspection.poiInstances.filter(p => p.currentPhase >= 3 || (isDelegated && p.phases[0]?.dataUrl)).length / poiTypes.length) * 100)}%
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-8 pt-6 border-t border-white/5">
             <div>
                <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">Responsável</span>
                <span className="text-sm font-medium text-slate-300">{inspection.responsibleName || '-'}</span>
             </div>
             <div>
                <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">Contato</span>
                <span className="text-sm font-medium text-slate-300">{inspection.contactPhone || '-'}</span>
             </div>
             <div>
                <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">CNPJ</span>
                <span className="text-sm font-medium text-slate-300 font-mono">{inspection.cnpj || '-'}</span>
             </div>
        </div>
      </div>

      {/* Delegated Access Block */}
      {isDelegated && (
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-500/10 rounded-2xl p-1 relative overflow-hidden">
              <div className="bg-[#0B0F19]/80 backdrop-blur-md rounded-xl p-5 flex flex-col md:flex-row items-center gap-5">
                  <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <ShareIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Acesso Remoto do Cliente</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-md">
                          Compartilhe o link seguro para captura de fotos no local.
                      </p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handleShareLink} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/20 transition-colors">
                          <LinkIcon className="w-4 h-4"/> Copiar Link
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                {isDelegated ? "Validação de Evidências" : "Checklist de Riscos"}
            </h3>
        </div>
        
        <div className="space-y-1">
            {poiTypes.map((poi, idx) => {
                const instancesForPoi = inspection.poiInstances.filter(p => p.poiId === poi.id);
                const hasPhoto = instancesForPoi.length > 0 && instancesForPoi[0].phases[0]?.dataUrl;
                const isNA = instancesForPoi.length > 0 && instancesForPoi[0].phases[0]?.status === 'not_applicable';
                const isAnalyzed = instancesForPoi.length > 0 && instancesForPoi[0].riskLevel;
                
                let statusContent;
                if (isDelegated) {
                    if (isNA) statusContent = <span className="text-[10px] font-bold text-slate-500">N/A</span>;
                    else if (!hasPhoto) statusContent = <span className="text-[10px] font-bold text-amber-500/80">PENDENTE</span>;
                    else if (isAnalyzed) statusContent = <span className="text-[10px] font-bold text-emerald-400">CONCLUÍDO</span>;
                    else statusContent = <span className="text-[10px] font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">ANALISAR</span>;
                } else {
                    const count = instancesForPoi.length;
                    statusContent = count > 0 
                        ? <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">{count}</span>
                        : <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-600 flex items-center justify-center text-xs font-bold border border-white/5">0</span>;
                }

                const isDisabled = isDelegated && !hasPhoto && !isNA;

                return (
                    <div 
                        key={poi.id} 
                        onClick={() => !isDisabled && onSelectPoiType(poi.id)} 
                        className={`group relative p-4 rounded-xl transition-all border border-transparent ${isDisabled ? 'opacity-40 cursor-not-allowed bg-[#0B0F19]' : 'cursor-pointer bg-[#131825] hover:bg-[#1A202F] hover:border-white/5 hover:shadow-lg'}`}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-slate-600 w-6 text-right">{String(idx + 1).padStart(2, '0')}</span>
                                <p className={`text-sm font-medium transition-colors ${isNA ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-white'}`}>
                                    {poi.title}
                                </p>
                            </div>
                            {statusContent}
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

       <div className="sticky bottom-8 z-30 flex flex-col sm:flex-row gap-3 bg-[#0B0F19]/80 backdrop-blur-lg p-2 rounded-2xl border border-white/10 shadow-2xl">
        <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors">
            <SaveIcon className="w-4 h-4" />
            Salvar
        </button>
        <button
          onClick={onGenerateReport}
          disabled={!atLeastOnePoiStarted || isGeneratingPdf}
          className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? <SpinnerIcon className="animate-spin" /> : <FileTextIcon />}
          {isGeneratingPdf ? 'Processando Relatório...' : 'Emitir Laudo Técnico'}
        </button>
      </div>
    </div>
  );
};

export default InspectionDetail;
