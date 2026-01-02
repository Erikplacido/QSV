
import React from 'react';
import { Inspection } from '../types';
import { PlusIcon, SearchIcon, HomeIcon, BuildingIcon } from './Icons';

interface DashboardProps {
  inspections: Inspection[];
  onNewInspection: () => void;
  onSelectInspection: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ inspections, onNewInspection, onSelectInspection }) => {
  const safeInspections = Array.isArray(inspections) ? inspections : [];
  
  return (
    <div className="space-y-8 animate-fadeIn pt-4">
      
      {/* Search Bar */}
      <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input 
             type="text" 
             placeholder="Buscar estabelecimentos, endereços ou ID..." 
             className="block w-full pl-12 pr-4 py-4 bg-[#131825] border border-white/5 rounded-2xl text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 focus:bg-[#161b2e] transition-all shadow-sm text-sm"
          />
      </div>

      {/* Content Grid */}
      {safeInspections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl border-dashed">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <HomeIcon className="h-6 w-6 text-slate-500" />
          </div>
          <h3 className="text-base font-medium text-slate-300">Nenhuma vistoria ativa</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto text-center leading-relaxed">
            Comece criando uma nova inspeção para registrar dados e gerar relatórios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {safeInspections.map(insp => {
              const itemCount = insp.poiInstances.length;
              return (
                <div 
                    key={insp.id} 
                    onClick={() => onSelectInspection(insp.id)} 
                    className="group relative bg-[#131825] hover:bg-[#181e30] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                              <BuildingIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                          </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800/50 text-slate-400 border border-white/5">
                             {insp.type}
                          </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors mb-1">{insp.establishmentName}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 font-mono">{insp.address}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                              <span className="text-xs text-slate-400">{new Date(insp.date).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs font-medium text-slate-300 group-hover:text-blue-300 transition-colors">
                              {itemCount} itens vistoriados
                          </span>
                      </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      
      {/* Floating Action Button - Modern */}
      <div className="fixed bottom-8 right-8 z-30">
        <button 
            onClick={onNewInspection} 
            className="group relative flex items-center justify-center w-16 h-16 bg-white text-slate-950 rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
            <PlusIcon className="w-7 h-7 transition-transform group-hover:rotate-90 duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
