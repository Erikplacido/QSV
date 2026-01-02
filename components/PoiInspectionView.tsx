
import React, { useState, useEffect } from 'react';
import { PointOfInterest, PoiInstance, InspectionPhasePhoto, RiskLevel, InspectionType } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { Camera, waterMarkPhoto } from './Camera';
import { CameraIcon } from './Icons';
import { photoApi } from '../services/api';

interface PoiInspectionViewProps {
  poi: PointOfInterest;
  poiInstance: PoiInstance;
  onSave: (updatedInstance: PoiInstance) => void;
  establishmentName: string;
  address: string;
  inspectionType?: InspectionType;
  inspectionId: string;
}

const PoiInspectionView: React.FC<PoiInspectionViewProps> = ({ poi, poiInstance, onSave, establishmentName, address, inspectionType, inspectionId }) => {
  const { location, getLocation } = useGeolocation();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const currentPhaseIndex = poiInstance.currentPhase;
  const existingPhaseData = currentPhaseIndex < 3 ? poiInstance.phases[currentPhaseIndex] : null;
  
  const isDelegatedReview = inspectionType === InspectionType.DELEGATED 
      && currentPhaseIndex === 0 
      && !!existingPhaseData?.dataUrl;

  const [currentPhaseData, setCurrentPhaseData] = useState<Partial<InspectionPhasePhoto>>({
    selectedRecommendationIds: existingPhaseData?.selectedRecommendationIds || [],
    comment: existingPhaseData?.comment || '',
    status: existingPhaseData?.status || 'pending',
    dataUrl: existingPhaseData?.dataUrl || undefined,
  });

  const [riskLevel, setRiskLevel] = useState<RiskLevel>(poiInstance.riskLevel || 'medium');
  const [deadline, setDeadline] = useState<number>(poiInstance.deadline || 30);

   useEffect(() => {
    const phaseData = poiInstance.phases[poiInstance.currentPhase];
    if (phaseData) {
        setCurrentPhaseData(phaseData);
    }
    if (poiInstance.riskLevel) setRiskLevel(poiInstance.riskLevel);
    if (poiInstance.deadline) setDeadline(poiInstance.deadline);
   }, [poiInstance]);

  const handleTakePhoto = () => {
    getLocation();
    setIsCameraOpen(true);
  };

  const handleCapture = async (blob: Blob) => {
    setIsCameraOpen(false);
    try {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const watermarkedDataUrl = await waterMarkPhoto(file, location, establishmentName, address);
      
      // Convert data URL to blob for upload
      const response = await fetch(watermarkedDataUrl);
      const watermarkedBlob = await response.blob();
      const watermarkedFile = new File([watermarkedBlob], `watermarked-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Upload to server
      const uploadResult = await photoApi.upload(watermarkedFile, inspectionId, poiInstance.instanceId, currentPhaseIndex);
      const photoUrl = photoApi.getUrl(uploadResult.photoUrl);
      
      setCurrentPhaseData(prev => ({
          ...prev,
          dataUrl: photoUrl,
          timestamp: Date.now(),
          location: location,
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erro ao fazer upload da foto');
    }
  };

  const handleToggleRecommendation = (recId: string) => {
    if (currentPhaseIndex > 0) return; 
    
    const newSelection = [...(currentPhaseData.selectedRecommendationIds || [])];
    const index = newSelection.indexOf(recId);
    if (index > -1) {
        newSelection.splice(index, 1);
    } else {
        newSelection.push(recId);
    }
    setCurrentPhaseData(prev => ({...prev, selectedRecommendationIds: newSelection}));
  };

  const handleSavePhase = () => {
    const newPhasePhoto: InspectionPhasePhoto = {
        id: existingPhaseData?.id || `phase-photo-${Date.now()}`,
        dataUrl: currentPhaseData.dataUrl!,
        timestamp: existingPhaseData?.timestamp || Date.now(),
        location: existingPhaseData?.location || location,
        selectedRecommendationIds: currentPhaseData.selectedRecommendationIds!,
        comment: currentPhaseData.comment || '',
        status: currentPhaseIndex > 0 ? currentPhaseData.status! : 'pending',
    };
    
    const newPhases = [...poiInstance.phases] as [InspectionPhasePhoto | null, InspectionPhasePhoto | null, InspectionPhasePhoto | null];
    newPhases[currentPhaseIndex] = newPhasePhoto;
    
    const updatedInstance: PoiInstance = {
        ...poiInstance,
        phases: newPhases,
        currentPhase: currentPhaseIndex + 1,
        riskLevel: riskLevel,
        deadline: deadline
    };
    onSave(updatedInstance);
  };

  const isSaveDisabled = currentPhaseIndex === 0 
    ? !currentPhaseData.dataUrl
    : !currentPhaseData.dataUrl || currentPhaseData.status === 'pending';

  return (
    <div className="py-6 space-y-6">
      {isCameraOpen && <Camera onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      
      <div>
          <h2 className="text-xl font-semibold text-slate-100">{poi.id}. {poi.title}</h2>
          <div className="h-1 w-12 bg-slate-700 mt-2 rounded-full"></div>
      </div>

      {isDelegatedReview && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-200 block mb-1">Análise Técnica</span>
                  Verifique a evidência enviada e classifique os riscos abaixo.
              </p>
          </div>
      )}

      {/* Phase History - Dark Cards */}
      {poiInstance.phases.map((phase, index) => {
        if (index === currentPhaseIndex) return null;
        if (!phase) return null;
        
        return (
            <div key={phase.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                <h3 className="font-medium text-sm text-slate-500 uppercase tracking-wider mb-2">Fase {index + 1} - Histórico</h3>
                <div className="rounded-lg overflow-hidden border border-slate-800">
                     <img src={phase.dataUrl} alt={`Fase ${index + 1}`} className="w-full opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                {index > 0 && (
                    <div className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${phase.status === 'satisfactory' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : 'bg-rose-950 text-rose-400 border-rose-900'}`}>
                        {phase.status === 'satisfactory' ? 'Conforme' : 'Não Conforme'}
                    </div>
                )}
                {phase.comment && <p className="mt-2 text-sm text-slate-400 italic">"{phase.comment}"</p>}
            </div>
        );
      })}
      
      {/* Current Phase Actions */}
      {currentPhaseIndex < 3 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-200 mb-4">
                {currentPhaseIndex === 0 ? "Evidência e Classificação" : `Tratativa - Fase ${currentPhaseIndex + 1}`}
            </h3>
            
            {currentPhaseData.dataUrl ? (
                <div className="relative group">
                     <img src={currentPhaseData.dataUrl} alt="Nova foto" className="w-full rounded-lg shadow-md border border-slate-700" />
                     {!isDelegatedReview && (
                        <button onClick={handleTakePhoto} className="absolute bottom-3 right-3 bg-slate-800/90 backdrop-blur text-white p-2.5 rounded-full shadow-lg border border-white/10 hover:bg-slate-700 transition-all">
                            <CameraIcon className="w-5 h-5"/>
                        </button>
                     )}
                </div>
            ) : (
                <button onClick={handleTakePhoto} className="w-full group flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all">
                    <div className="p-3 bg-slate-800 rounded-full group-hover:bg-slate-700 group-hover:shadow-sm transition-all border border-slate-700">
                        <CameraIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-200" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300">Capturar Evidência Fotográfica</span>
                </button>
            )}

            {/* Inputs Section */}
            {currentPhaseIndex === 0 && (
                <div className="space-y-5 mt-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risco</label>
                            <select 
                                value={riskLevel} 
                                onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                                className="w-full p-2.5 text-sm border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:ring-2 focus:ring-slate-600 focus:border-slate-500 outline-none transition-all"
                            >
                                <option value="critical">Crítico</option>
                                <option value="medium">Médio</option>
                                <option value="low">Baixo</option>
                            </select>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prazo (Dias)</label>
                            <input 
                                type="number" 
                                value={deadline} 
                                onChange={(e) => setDeadline(parseInt(e.target.value) || 0)}
                                className="w-full p-2.5 text-sm border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:ring-2 focus:ring-slate-600 focus:border-slate-500 outline-none transition-all"
                            />
                         </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recomendações Técnicas</p>
                        <div className="space-y-2">
                            {poi.recommendations.map(rec => (
                                <label key={rec.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${currentPhaseData.selectedRecommendationIds?.includes(rec.id) ? 'bg-blue-900/20 border-blue-800/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-800'}`}>
                                    <input type="checkbox"
                                        className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                        checked={currentPhaseData.selectedRecommendationIds?.includes(rec.id)}
                                        onChange={() => handleToggleRecommendation(rec.id)}
                                        disabled={!!existingPhaseData && !isDelegatedReview} 
                                    />
                                    <span className={`text-sm leading-snug ${currentPhaseData.selectedRecommendationIds?.includes(rec.id) ? 'text-blue-200' : 'text-slate-400'}`}>{rec.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Status & Comment Inputs */}
            {currentPhaseIndex > 0 && (
                 <div className="space-y-5 mt-6">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Avaliação</label>
                        <div className="flex gap-3">
                           <label className="flex-1 relative">
                                <input type="radio" name="status" value="satisfactory" className="peer sr-only" checked={currentPhaseData.status === 'satisfactory'} onChange={e => setCurrentPhaseData(prev=> ({...prev, status: 'satisfactory'}))} />
                                <div className="p-3 text-center border border-slate-700 rounded-lg cursor-pointer text-slate-400 peer-checked:bg-emerald-900/30 peer-checked:text-emerald-400 peer-checked:border-emerald-700 peer-checked:font-semibold transition-all bg-slate-950 hover:bg-slate-800">
                                    Satisfatório
                                </div>
                           </label>
                           <label className="flex-1 relative">
                                <input type="radio" name="status" value="not_satisfactory" className="peer sr-only" checked={currentPhaseData.status === 'not_satisfactory'} onChange={e => setCurrentPhaseData(prev=> ({...prev, status: 'not_satisfactory'}))} />
                                <div className="p-3 text-center border border-slate-700 rounded-lg cursor-pointer text-slate-400 peer-checked:bg-rose-900/30 peer-checked:text-rose-400 peer-checked:border-rose-700 peer-checked:font-semibold transition-all bg-slate-950 hover:bg-slate-800">
                                    Insatisfatório
                                </div>
                           </label>
                        </div>
                    </div>
                     <div>
                         <label htmlFor="comment" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Observações</label>
                         <textarea id="comment" value={currentPhaseData.comment} onChange={e => setCurrentPhaseData(prev => ({...prev, comment: e.target.value}))}
                                   className="block w-full px-3 py-2.5 text-sm border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:ring-2 focus:ring-slate-600 focus:border-slate-500 outline-none transition-all min-h-[80px]"
                                   placeholder="Descreva detalhes adicionais..."
                         />
                     </div>
                 </div>
            )}

            <button onClick={handleSavePhase} disabled={isSaveDisabled} className="w-full mt-8 py-3.5 bg-slate-100 text-slate-900 font-medium rounded-xl shadow-lg hover:bg-white hover:shadow-slate-900/20 transition-all disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed border border-transparent disabled:border-slate-800">
                {isDelegatedReview ? "Aprovar e Classificar" : "Registrar e Avançar"}
            </button>
        </div>
      )}
      
      {currentPhaseIndex >= 3 && (
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-900/10 border border-emerald-900/30 rounded-xl text-emerald-400">
            <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center mb-2 border border-emerald-800/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="font-semibold">Processo Concluído</p>
            <p className="text-xs opacity-70">Este item foi devidamente tratado.</p>
        </div>
      )}
    </div>
  );
};

export default PoiInspectionView;
