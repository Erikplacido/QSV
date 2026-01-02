
import React, { useState } from 'react';
import { PointOfInterest, PoiInstance } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { Camera, waterMarkPhoto } from './Camera';
import { CameraIcon, BanIcon, SaveIcon } from './Icons';
import { photoApi } from '../services/api';

interface DelegatedCaptureViewProps {
  establishmentName: string;
  address: string;
  poiTypes: PointOfInterest[];
  poiInstances: PoiInstance[];
  inspectionId: string;
  onCapturePhoto: (poiId: string, dataUrl: string | null, location: any, timestamp: number, isNotApplicable?: boolean) => void;
  onBulkUpdate: (updates: { poiId: string; isNotApplicable: boolean }[]) => void;
  onFinish: () => void;
}

const DelegatedCaptureView: React.FC<DelegatedCaptureViewProps> = ({ establishmentName, address, poiTypes, poiInstances, inspectionId, onCapturePhoto, onBulkUpdate, onFinish }) => {
  const [activePoiId, setActivePoiId] = useState<string | null>(null);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { location, getLocation } = useGeolocation();

  const getPoiStatus = (poiId: string) => {
    const instance = poiInstances.find(p => p.poiId === poiId);
    if (!instance) return 'pending';
    if (instance.phases[0]?.status === 'not_applicable') return 'na';
    if (instance.phases[0]?.dataUrl) return 'done';
    return 'pending';
  };

  const handlePoiClick = (poiId: string) => { setActivePoiId(poiId); getLocation(); setIsCameraOpen(true); };
  const handleQuickNa = (e: React.MouseEvent, poiId: string) => { e.stopPropagation(); onCapturePhoto(poiId, null, null, Date.now(), true); };
  const handleCapture = async (blob: Blob) => {
    if (!activePoiId) return;
    setIsCameraOpen(false);
    try {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const watermarkedDataUrl = await waterMarkPhoto(file, location, establishmentName, address);
      
      // Convert data URL to blob for upload
      const response = await fetch(watermarkedDataUrl);
      const watermarkedBlob = await response.blob();
      const watermarkedFile = new File([watermarkedBlob], `watermarked-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Find POI instance for this POI
      const poiInstance = poiInstances.find(pi => pi.poiId === activePoiId);
      
      // Upload to server
      const uploadResult = await photoApi.upload(watermarkedFile, inspectionId, poiInstance?.instanceId);
      const photoUrl = photoApi.getUrl(uploadResult.photoUrl);
      
      onCapturePhoto(activePoiId, photoUrl, location, Date.now());
      setActivePoiId(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erro ao fazer upload da foto');
    }
  };

  const pendingCount = poiTypes.filter(p => getPoiStatus(p.id) === 'pending').length;
  const handleFinishAttempt = () => { pendingCount > 0 ? setShowFinishConfirmation(true) : onFinish(); };
  const handleConfirmFinishWithNA = () => {
      const updates: { poiId: string; isNotApplicable: boolean }[] = [];
      poiTypes.forEach(poi => { if (getPoiStatus(poi.id) === 'pending') updates.push({ poiId: poi.id, isNotApplicable: true }); });
      onBulkUpdate(updates); setShowFinishConfirmation(false); onFinish();
  };

  return (
    <div className="relative min-h-screen bg-[#05080F] pb-32">
      {isCameraOpen && <Camera onCapture={handleCapture} onClose={() => { setIsCameraOpen(false); setActivePoiId(null); }} />}

      {showFinishConfirmation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#131825] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 ring-1 ring-white/5 animate-slideUp">
                <div className="mb-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
                         <BanIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Finalizar com Pendências?</h3>
                </div>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Você tem <strong>{pendingCount} itens</strong> sem foto. Ao confirmar, eles serão marcados como <span className="text-white font-medium">"Não se Aplica"</span>.
                </p>
                <div className="space-y-3">
                    <button onClick={handleConfirmFinishWithNA} className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm tracking-wide transition-all">Confirmar Envio</button>
                    <button onClick={() => setShowFinishConfirmation(false)} className="w-full py-4 bg-transparent border border-white/10 text-slate-400 hover:bg-white/5 rounded-xl font-bold text-sm">Voltar e Revisar</button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#05080F]/90 backdrop-blur-lg border-b border-white/5 pt-8 pb-6 px-6 shadow-lg">
        <div className="flex justify-between items-start">
             <div>
                <h1 className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400 mb-1">Vistoria Externa</h1>
                <p className="text-xl font-semibold text-white">{establishmentName}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center">
                 <span className="text-xs font-bold text-white">{Math.round(((poiTypes.length - pendingCount) / poiTypes.length) * 100)}%</span>
             </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-5 rounded-2xl border border-blue-500/10">
             <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Por favor, capture fotos de todos os itens listados. Se algum item não existir no local, use a opção <strong className="text-white">N/A</strong>.
             </p>
        </div>

        <div className="space-y-3">
            {poiTypes.map((poi, idx) => {
                const status = getPoiStatus(poi.id);
                const isDone = status === 'done';
                const isNA = status === 'na';

                return (
                    <div 
                        key={poi.id} 
                        onClick={() => !isDone && !isNA && handlePoiClick(poi.id)}
                        className={`w-full p-5 rounded-2xl border transition-all flex justify-between items-center relative overflow-hidden ${
                            isDone 
                            ? 'bg-[#0B0F19] border-emerald-500/20' 
                            : isNA 
                                ? 'bg-[#0B0F19] border-white/5 opacity-60'
                                : 'bg-[#131825] border-white/5 shadow-md active:scale-[0.98]'
                        }`}
                    >
                        {isDone && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>}
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-inner ${
                                isDone ? 'bg-emerald-500/10 text-emerald-400' : 
                                isNA ? 'bg-slate-800/50 text-slate-600' : 
                                'bg-blue-600 text-white shadow-blue-900/20'
                            }`}>
                                {isNA ? <BanIcon className="w-5 h-5" /> : <CameraIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className={`font-medium text-sm ${isNA ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{poi.title}</p>
                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">Item {String(idx + 1).padStart(2, '0')}</p>
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            {isDone ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">Feito</span>
                            ) : isNA ? (
                                <button onClick={(e) => { e.stopPropagation(); handlePoiClick(poi.id); }} className="text-xs text-slate-500 font-medium underline">Editar</button>
                            ) : (
                                <button onClick={(e) => handleQuickNa(e, poi.id)} className="px-3 py-2 bg-[#0B0F19] hover:bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10">N/A</button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6 z-40">
        <button 
            onClick={handleFinishAttempt}
            className={`w-full py-4 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 tracking-wide text-sm ${
                pendingCount === 0 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-900/30' 
                : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/10'
            }`}
        >
            <SaveIcon className="w-5 h-5"/>
            {pendingCount > 0 ? 'Revisar e Enviar' : 'Concluir Vistoria'}
        </button>
      </div>
    </div>
  );
};

export default DelegatedCaptureView;
