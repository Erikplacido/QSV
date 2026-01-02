
import React, { useState } from 'react';
import { Inspection, InspectionType } from '../types';
import { BuildingIcon, ChevronLeftIcon, PlusIcon, SearchIcon } from './Icons';

// --- Mock Data remains same ---
interface EstablishmentUnit { id: string; nickname: string; address: string; totalArea: number; floors: number; constructionYear: number; operatingHours: string; type: InspectionType; }
interface EstablishmentProfile { id: string; companyName: string; cnpj: string; responsibleName: string; contactPhone: string; units: EstablishmentUnit[]; }

const ESTABLISHMENT_DATABASE: EstablishmentProfile[] = [
  { id: 'company-1', companyName: 'Supermercado Preço Bom', cnpj: '12.345.678/0001-90', responsibleName: 'Carlos Silva', contactPhone: '(11) 98765-4321', units: [{ id: 'u1-c1', nickname: 'Matriz - Centro', address: 'Av. das Nações, 1500, Centro, São Paulo - SP', totalArea: 1200, floors: 2, constructionYear: 2015, operatingHours: '07:00 às 22:00', type: InspectionType.INTERNAL }, { id: 'u2-c1', nickname: 'Filial - Zona Norte', address: 'Rua Voluntários da Pátria, 500, Santana, São Paulo - SP', totalArea: 800, floors: 1, constructionYear: 2018, operatingHours: '08:00 às 21:00', type: InspectionType.INTERNAL }] },
  { id: 'company-2', companyName: 'Farmácias Saúde Total', cnpj: '98.765.432/0001-10', responsibleName: 'Ana Souza', contactPhone: '(19) 99999-8888', units: [{ id: 'u1-c2', nickname: 'Unidade Campinas', address: 'Rua das Flores, 45, Vila Nova, Campinas - SP', totalArea: 350, floors: 1, constructionYear: 2000, operatingHours: '08:00 às 23:00', type: InspectionType.DELEGATED }] },
  { id: 'company-3', companyName: 'Logística Rápida Ltda', cnpj: '45.678.901/0001-55', responsibleName: 'Roberto Mendes', contactPhone: '(13) 3333-2222', units: [{ id: 'u1-c3', nickname: 'CD Santos', address: 'Rodovia BR-101, Km 200, Zona Industrial, Santos - SP', totalArea: 5000, floors: 1, constructionYear: 2019, operatingHours: '24 Horas', type: InspectionType.INTERNAL }] }
];

// --- UI Components ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; }
const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div className="group relative">
    <input 
        id={id} 
        {...props} 
        className="peer block w-full px-4 py-4 bg-[#1A202F] border border-white/5 rounded-xl text-slate-200 text-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" 
        placeholder={label}
    />
    <label 
        htmlFor={id} 
        className="absolute left-4 -top-2.5 bg-[#0B0F19] px-1 text-[10px] text-slate-500 uppercase tracking-wide transition-all 
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:bg-transparent 
                   peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:text-blue-400 peer-focus:bg-[#0B0F19] peer-focus:px-1 pointer-events-none"
    >
        {label}
    </label>
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label: string; }
const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
  <div className="group relative">
    <select 
        id={id} 
        {...props} 
        className="peer block w-full px-4 py-4 bg-[#1A202F] border border-white/5 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all appearance-none"
    >
      {children}
    </select>
    <label 
        htmlFor={id} 
        className="absolute left-4 -top-2.5 bg-[#0B0F19] px-1 text-[10px] text-slate-500 uppercase tracking-wide transition-all peer-focus:text-blue-400"
    >
        {label}
    </label>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

interface NewInspectionFormProps {
  onSave: (data: Partial<Inspection>) => void;
  onCancel: () => void;
}

const NewInspectionForm: React.FC<NewInspectionFormProps> = ({ onSave, onCancel }) => {
  const [isSelecting, setIsSelecting] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  // Form State
  const [establishmentName, setEstablishmentName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<InspectionType>(InspectionType.INTERNAL);
  const [cnpj, setCnpj] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [floors, setFloors] = useState('1');
  const [constructionYear, setConstructionYear] = useState('');
  const [operatingHours, setOperatingHours] = useState('');

  // Handlers
  const filteredCompanies = ESTABLISHMENT_DATABASE.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || c.cnpj.includes(searchTerm)
  );

  const handleSelectExistingUnit = (company: EstablishmentProfile, unit: EstablishmentUnit) => {
    setEstablishmentName(company.companyName); setCnpj(company.cnpj); setResponsibleName(company.responsibleName);
    setContactPhone(company.contactPhone); setAddress(unit.address); setType(unit.type);
    setTotalArea(unit.totalArea.toString()); setFloors(unit.floors.toString());
    setConstructionYear(unit.constructionYear.toString()); setOperatingHours(unit.operatingHours);
    setIsSelecting(false);
  };

  const handleAddNewUnitForCompany = (company: EstablishmentProfile) => {
    setEstablishmentName(company.companyName); setCnpj(company.cnpj); setResponsibleName(company.responsibleName);
    setContactPhone(company.contactPhone); setAddress(''); setType(InspectionType.INTERNAL);
    setTotalArea(''); setFloors('1'); setConstructionYear(''); setOperatingHours('');
    setIsSelecting(false);
  };

  const handleCreateTotallyNew = () => {
    setEstablishmentName(''); setAddress(''); setType(InspectionType.INTERNAL); setCnpj(''); setResponsibleName('');
    setContactPhone(''); setTotalArea(''); setFloors('1'); setConstructionYear(''); setOperatingHours('');
    setIsSelecting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ establishmentName, address, type, cnpj, responsibleName, contactPhone, totalArea: parseFloat(totalArea), floors: parseInt(floors), constructionYear: parseInt(constructionYear), operatingHours });
  };

  if (isSelecting) {
    return (
      <div className="space-y-6 animate-slideIn">
         <div className="bg-[#131825] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <h3 className="text-lg font-medium text-white mb-1">Selecionar Cliente</h3>
                <p className="text-sm text-slate-400 mb-6">Busque na base corporativa ou cadastre manualmente.</p>
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-[#0B0F19] border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all text-sm"
                        placeholder="Buscar razão social ou CNPJ..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setExpandedCompanyId(null); }}
                    />
                </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map(company => {
                        const isExpanded = expandedCompanyId === company.id;
                        return (
                            <div key={company.id} className="border-b border-white/5 last:border-0">
                                <div 
                                    onClick={() => setExpandedCompanyId(isExpanded ? null : company.id)}
                                    className={`p-5 cursor-pointer flex items-center gap-4 transition-colors ${isExpanded ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}
                                >
                                    <div className={`flex-shrink-0 p-3 rounded-xl border transition-all ${isExpanded ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-800/50 border-white/5 text-slate-500'}`}>
                                        <BuildingIcon className="w-5 h-5"/>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium transition-colors ${isExpanded ? 'text-blue-200' : 'text-slate-200'}`}>{company.companyName}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5 font-mono tracking-wide">{company.cnpj}</p>
                                    </div>
                                    <ChevronLeftIcon className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${isExpanded ? '-rotate-90 text-blue-500' : 'rotate-180'}`} />
                                </div>

                                {isExpanded && (
                                    <div className="bg-[#0F131F] px-5 py-4 space-y-2 shadow-inner">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Unidades Disponíveis</p>
                                        {company.units.map(unit => (
                                            <div 
                                                key={unit.id} 
                                                onClick={() => handleSelectExistingUnit(company, unit)}
                                                className="p-3 rounded-lg border border-white/5 bg-[#161b2e] hover:border-blue-500/30 hover:bg-blue-500/5 cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm text-slate-300 group-hover:text-blue-200 transition-colors">{unit.nickname}</p>
                                                        <p className="text-xs text-slate-500 mt-1 font-mono line-clamp-1">{unit.address}</p>
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-white/5 group-hover:border-blue-500/20 group-hover:text-blue-400">
                                                        {unit.type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => handleAddNewUnitForCompany(company)}
                                            className="w-full mt-2 py-2.5 flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-lg text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <PlusIcon className="w-3 h-3" />
                                            Cadastrar Nova Unidade
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    searchTerm && <div className="p-12 text-center text-slate-500 text-sm">Nenhum registro encontrado na base.</div>
                )}
            </div>
            
            <div className="p-6 bg-[#0F131F] border-t border-white/5">
                <button onClick={handleCreateTotallyNew} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-[#1A202F] hover:bg-[#202738] text-slate-300 shadow-sm transition-all text-sm font-medium hover:shadow-md">
                    <PlusIcon className="w-4 h-4 text-slate-400" />
                    Nova Empresa (Cadastro Manual)
                </button>
            </div>
         </div>
         <button onClick={onCancel} className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest py-2">
            Voltar ao Dashboard
         </button>
      </div>
    );
  }

  return (
    <div className="animate-slideIn">
        <div className="mb-6">
            <button onClick={() => setIsSelecting(true)} className="flex items-center text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">
                <ChevronLeftIcon className="w-4 h-4 mr-1"/>
                Alterar Seleção
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
        
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Dados Corporativos</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
                <Input label="Razão Social" id="establishmentName" type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="CNPJ" id="cnpj" type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                    <Input label="Telefone" id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
                 <Input label="Responsável Legal" id="responsibleName" type="text" value={responsibleName} onChange={(e) => setResponsibleName(e.target.value)} />
            </div>
        </section>

        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Detalhes da Unidade</h3>
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            
            <div className="space-y-5">
                <Input label="Endereço Completo" id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <Select label="Modalidade de Vistoria" id="type" value={type} onChange={(e) => setType(e.target.value as InspectionType)}>
                    {Object.values(InspectionType).map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <Input label="Área (m²)" id="totalArea" type="number" value={totalArea} onChange={(e) => setTotalArea(e.target.value)} />
                    <Input label="Pavimentos" id="floors" type="number" value={floors} onChange={(e) => setFloors(e.target.value)} />
                    <Input label="Ano Constr." id="constructionYear" type="number" value={constructionYear} onChange={(e) => setConstructionYear(e.target.value)} />
                    <Input label="Horário" id="operatingHours" type="text" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} />
                </div>
            </div>
        </section>

        <div className="flex gap-4 pt-6 border-t border-white/5">
            <button type="button" onClick={onCancel} className="w-full py-4 rounded-xl border border-white/10 text-slate-400 font-medium bg-[#131825] hover:bg-[#1A202F] transition-colors">Cancelar</button>
            <button type="submit" className="w-full py-4 rounded-xl text-slate-950 font-bold bg-white hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all tracking-wide">Iniciar Vistoria</button>
        </div>
        </form>
    </div>
  );
};

export default NewInspectionForm;
