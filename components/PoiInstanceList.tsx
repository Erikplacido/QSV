
import React from 'react';
import { PointOfInterest, PoiInstance } from '../types';
import { PlusIcon } from './Icons';

interface PoiInstanceListProps {
  poiType: PointOfInterest;
  instances: PoiInstance[];
  onSelectInstance: (instanceId: string) => void;
  onAddNewInstance: () => void;
}

const PoiInstanceList: React.FC<PoiInstanceListProps> = ({ poiType, instances, onSelectInstance, onAddNewInstance }) => {
  return (
    <div className="space-y-6 animate-slideIn">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-white">
              {poiType.title} <span className="text-slate-500 font-mono text-base ml-2">({poiType.id})</span>
          </h2>
      </div>
      
      {instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#131825] border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 text-sm">Nenhum registro adicionado.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {instances.map((instance, index) => {
            const phase = instance.currentPhase;
            let statusColor = 'text-slate-500';
            let statusText = 'Pendente';
            let borderColor = 'border-transparent';
            
            if (phase >= 3) { statusText = 'Concluído'; statusColor = 'text-emerald-400'; borderColor = 'border-emerald-500/20'; }
            else if (phase > 0) { statusText = `Em Análise (Fase ${phase + 1})`; statusColor = 'text-amber-400'; borderColor = 'border-amber-500/20'; }

            return (
              <div 
                key={instance.instanceId} 
                onClick={() => onSelectInstance(instance.instanceId)} 
                className={`group bg-[#131825] border border-white/5 ${borderColor} rounded-xl p-5 flex justify-between items-center cursor-pointer hover:bg-[#181e30] transition-all hover:shadow-lg`}
              >
                <div>
                  <p className="font-bold text-slate-200 text-sm mb-1">Ocorrência #{index + 1}</p>
                  <p className="text-xs text-slate-500 font-mono opacity-60">{instance.instanceId.split('-').pop()}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>{statusText}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4">
        <button onClick={onAddNewInstance} className="w-full group flex items-center justify-center gap-2 px-4 py-4 bg-[#1A202F] text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 hover:bg-white hover:text-slate-950 transition-all duration-300">
          <PlusIcon className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Adicionar Ocorrência
        </button>
      </div>
    </div>
  );
};

export default PoiInstanceList;
