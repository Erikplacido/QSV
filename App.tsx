
import React, { useState, useMemo, useEffect } from 'react';
import { Inspection, InspectionType, PoiInstance, RiskLevel, InspectionPhasePhoto } from './types';
import { useAuth, useInspections } from './hooks/useApi';
import { inspectionApi, poiInstanceApi } from './services/api';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NewInspectionForm from './components/NewInspectionForm';
import InspectionDetail from './components/InspectionDetail';
import PoiInspectionView from './components/PoiInspectionView';
import DelegatedCaptureView from './components/DelegatedCaptureView';
import PoiInstanceList from './components/PoiInstanceList';
import TemplateManager from './components/TemplateManager';
import { POINTS_OF_INTEREST_DATA } from './data/pois';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SpinnerIcon } from './components/Icons';

// --- Assets ---
const LOGO_URL = 'https://qualisegcorretora.com.br/wp-content/uploads/2022/10/logo-footer.png';

// --- SplashScreen Component ---
const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) return 100;
        const diff = Math.random() * 15;
        return Math.min(old + diff, 100);
      });
    }, 150);

    const timer = setTimeout(() => {
        setOpacity(0);
        setTimeout(onFinish, 800);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] transition-opacity duration-700 ease-out"
        style={{ opacity }}
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 mb-8 relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
             <img src={LOGO_URL} alt="Qualiseg" className="w-full h-full object-contain relative z-10 filter brightness-0 invert opacity-90 drop-shadow-2xl" />
        </div>
        
        <h1 className="text-2xl font-light text-white tracking-[0.3em] uppercase mb-2">Qualiseg</h1>
        <p className="text-slate-500 text-[10px] font-semibold tracking-[0.2em] uppercase mb-12">Risk Management System</p>

        <div className="w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>
    </div>
  );
};

// --- LoginScreen Component ---
const LoginScreen: React.FC<{ onLogin: (loginFn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }
    
    setIsLoggingIn(true);
    setError(null);
    
    const result = await login(email, password);
    if (result.success) {
      onLogin(login);
    } else {
      setError(result.error || 'Erro ao fazer login');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0F19] relative overflow-hidden">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[400px] relative z-10">
        
        {/* Card Container */}
        <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.05] shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] p-8 sm:p-10 relative overflow-hidden group">
            
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

            <div className="flex flex-col items-center mb-10">
                 <img src={LOGO_URL} alt="Qualiseg" className="w-32 mb-6 opacity-90 invert" />
                 <h2 className="text-white text-lg font-light tracking-wide">Acesso Corporativo</h2>
                 <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-emerald-500/80 text-[10px] font-mono uppercase tracking-wider">Ambiente Seguro</span>
                 </div>
            </div>

            <div className="space-y-5">
                <div className="group/input relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-4 bg-[#0B0F19]/50 border border-white/5 rounded-xl text-slate-300 text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-transparent peer"
                        placeholder="Usuário"
                    />
                    <label className="absolute left-4 -top-2.5 bg-[#0B0F19] px-1 text-[10px] text-slate-500 uppercase tracking-wide transition-all 
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:bg-transparent 
                                    peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:text-blue-400 peer-focus:bg-[#0B0F19] peer-focus:px-1 pointer-events-none">
                        ID Corporativo
                    </label>
                </div>

                <div className="group/input relative">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-4 bg-[#0B0F19]/50 border border-white/5 rounded-xl text-slate-300 text-sm tracking-widest focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-transparent peer"
                        placeholder="Senha"
                    />
                    <label className="absolute left-4 -top-2.5 bg-[#0B0F19] px-1 text-[10px] text-slate-500 uppercase tracking-wide transition-all 
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:bg-transparent 
                                    peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:text-blue-400 peer-focus:bg-[#0B0F19] peer-focus:px-1 pointer-events-none">
                        Chave de Acesso
                    </label>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoggingIn}
                    className={`w-full mt-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-500 relative overflow-hidden ${
                        isLoggingIn 
                        ? 'bg-slate-800 text-slate-400 cursor-wait' 
                        : 'bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    }`}
                >
                    {isLoggingIn ? (
                        <div className="flex items-center justify-center gap-3">
                            <SpinnerIcon className="w-4 h-4 animate-spin" />
                            <span>Autenticando</span>
                        </div>
                    ) : (
                        <span>Entrar</span>
                    )}
                </button>
            </div>
        </div>

        <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-600 font-mono">
                v3.5.0 • QUALISEG GESTÃO DE RISCOS <br/>
                <span className="opacity-50">Todos os direitos reservados</span>
             </p>
        </div>
      </div>
    </div>
  );
};

// --- Types & State ---

type View = 'dashboard' | 'new_form' | 'detail' | 'poi_instance_list' | 'poi_inspection' | 'delegated_external' | 'template_manager';
type AppState = 'splash' | 'login' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const { authenticated, loading: authLoading, checkAuth } = useAuth();
  const { data: inspectionsData, loading: inspectionsLoading, refetch: refetchInspections } = useInspections();
  const inspections: Inspection[] = Array.isArray(inspectionsData) ? inspectionsData : [];
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [selectedPoiTypeId, setSelectedPoiTypeId] = useState<string | null>(null);
  const [selectedPoiInstanceId, setSelectedPoiInstanceId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Template Management State
  const [useCustomTemplate, setUseCustomTemplate] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect based on auth state
  useEffect(() => {
    if (!authLoading) {
      if (authenticated && appState === 'login') {
        setAppState('app');
      } else if (!authenticated && appState === 'app') {
        setAppState('login');
      }
    }
  }, [authenticated, authLoading, appState]);

  const selectedInspection = useMemo(() => {
    if (!inspections || !Array.isArray(inspections) || !selectedInspectionId) return undefined;
    return inspections.find((i: Inspection) => i.id === selectedInspectionId);
  }, [inspections, selectedInspectionId]);
  const selectedPoiType = useMemo(() => POINTS_OF_INTEREST_DATA.find(p => p.id === selectedPoiTypeId), [selectedPoiTypeId]);
  const selectedPoiInstance = useMemo(() => selectedInspection?.poiInstances.find(pi => pi.instanceId === selectedPoiInstanceId), [selectedInspection, selectedPoiInstanceId]);

  // --- Handlers ---
  const handleSaveInspection = async (data: Partial<Inspection>) => {
    try {
      const result = await inspectionApi.create({
        establishmentName: data.establishmentName || 'Novo Estabelecimento',
        address: data.address || '',
        type: data.type || InspectionType.INTERNAL,
        cnpj: data.cnpj,
        responsibleName: data.responsibleName,
        contactPhone: data.contactPhone,
        totalArea: data.totalArea,
        floors: data.floors,
        constructionYear: data.constructionYear,
        operatingHours: data.operatingHours,
      });
      
      await refetchInspections();
      setSelectedInspectionId(result.id);
      setCurrentView('detail');
    } catch (error) {
      console.error('Error creating inspection:', error);
      alert('Erro ao criar vistoria');
    }
  };

  const handleAddNewPoiInstance = async () => {
    if (!selectedInspectionId || !selectedPoiTypeId) return;

    try {
      const result = await poiInstanceApi.create({
        inspectionId: selectedInspectionId,
        poiId: selectedPoiTypeId,
        riskLevel: 'medium',
        deadline: 30,
      });
      
      await refetchInspections();
      setSelectedPoiInstanceId(result.id);
      setCurrentView('poi_inspection');
    } catch (error) {
      console.error('Error creating POI instance:', error);
      alert('Erro ao criar instância de POI');
    }
  };
  
  const handleSavePoiInstance = async (updatedPoiInstance: PoiInstance) => {
    if (!selectedInspectionId) return;

    try {
      await poiInstanceApi.update(updatedPoiInstance.instanceId, {
        currentPhase: updatedPoiInstance.currentPhase,
        riskLevel: updatedPoiInstance.riskLevel,
        deadline: updatedPoiInstance.deadline,
        phases: updatedPoiInstance.phases,
      });
      
      await refetchInspections();
      setCurrentView('poi_instance_list');
    } catch (error) {
      console.error('Error updating POI instance:', error);
      alert('Erro ao salvar instância de POI');
    }
  };
  
  const handleDelegatedUpdate = async (poiId: string, dataUrl: string | null, location: any, timestamp: number, isNotApplicable: boolean = false) => {
      if (!selectedInspectionId) return;
      
      try {
        // Find the POI instance
        if (!inspections || !Array.isArray(inspections)) return;
        const inspection = inspections.find((i: Inspection) => i.id === selectedInspectionId);
        if (!inspection) return;
        
        const poiInstance = inspection.poiInstances.find(pi => pi.poiId === poiId);
        if (!poiInstance) return;

        await poiInstanceApi.update(poiInstance.instanceId, {
          currentPhase: 0,
          phases: [{
            dataUrl,
            location,
            timestamp,
            selectedRecommendationIds: [],
            comment: isNotApplicable ? 'Não se aplica ao local.' : '',
            status: isNotApplicable ? 'not_applicable' : 'pending',
          }, null, null],
        });
        
        await refetchInspections();
      } catch (error) {
        console.error('Error updating delegated capture:', error);
        alert('Erro ao salvar captura delegada');
      }
  };

  const handleDelegatedBulkUpdate = async (updates: { poiId: string; isNotApplicable: boolean }[]) => {
      if (!selectedInspectionId) return;

      try {
        if (!inspections || !Array.isArray(inspections)) return;
        const inspection = inspections.find((i: Inspection) => i.id === selectedInspectionId);
        if (!inspection) return;

        await Promise.all(updates.map(async (update) => {
          const poiInstance = inspection.poiInstances.find(pi => pi.poiId === update.poiId);
          if (!poiInstance) return;

          await poiInstanceApi.update(poiInstance.instanceId, {
            currentPhase: 0,
            phases: [{
              dataUrl: null,
              location: null,
              timestamp: Date.now(),
              selectedRecommendationIds: [],
              comment: 'Não se aplica ao local.',
              status: 'not_applicable',
            }, null, null],
          });
        }));
        
        await refetchInspections();
      } catch (error) {
        console.error('Error bulk updating delegated captures:', error);
        alert('Erro ao atualizar capturas delegadas');
      }
  };

  // --- Report Generation ---
  const generateReport = async (targetInspection?: Inspection) => {
    const inspectionToPrint = targetInspection || selectedInspection;
    if (!inspectionToPrint || isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    try {
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        
        // Define Styles based on Mode
        const styles = useCustomTemplate ? {
            headerBg: [15, 23, 42], // Dark Slate
            headerText: [255, 255, 255], // White
            accent: [212, 175, 55], // Gold
            bodyBg: [255, 255, 255],
            font: "times"
        } : {
            headerBg: [255, 255, 255], // White
            headerText: [71, 85, 105], // Slate
            accent: [226, 232, 240], // Light Grey
            bodyBg: [248, 250, 252],
            font: "helvetica"
        };

        const colors = {
            primary: [15, 23, 42] as [number, number, number],
            secondary: [71, 85, 105] as [number, number, number],
            risk: {
                critical: [153, 27, 27] as [number, number, number],
                medium: [180, 83, 9] as [number, number, number],
                low: [21, 128, 61] as [number, number, number],
            },
            phases: {
                phase1: [127, 29, 29] as [number, number, number],
                phase2: [20, 83, 45] as [number, number, number],
                phase3: [15, 23, 42] as [number, number, number],
            }
        };

        const logoUrl = 'https://qualisegcorretora.com.br/wp-content/uploads/2022/10/logo-footer.png';
        const getBase64ImageFromURL = (url: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                // If it's already a data URL, return it
                if (url.startsWith('data:')) {
                    resolve(url);
                    return;
                }
                
                // For API URLs, fetch with credentials
                const fetchOptions: RequestInit = {
                    credentials: 'include',
                };
                
                fetch(url, fetchOptions)
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to load image');
                        return response.blob();
                    })
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
                    .catch(reject);
            });
        };

        let logoBase64 = '';
        try { logoBase64 = await getBase64ImageFromURL(logoUrl); } catch (e) {}

        // --- Custom Header Logic ---
        const drawHeader = (pageNumber: number) => {
            if (useCustomTemplate) {
                 // PREMIUM HEADER (Dark)
                 doc.setFillColor(styles.headerBg[0], styles.headerBg[1], styles.headerBg[2]);
                 doc.rect(0, 0, width, 35, 'F');
                 // Gold Line
                 doc.setDrawColor(styles.accent[0], styles.accent[1], styles.accent[2]);
                 doc.setLineWidth(1);
                 doc.line(15, 34, width - 15, 34);

                 if (logoBase64) doc.addImage(logoBase64, 'PNG', 15, 8, 30, 8); // Logo might need inversion filter in real code, but we skip for now
                 
                 doc.setFont(styles.font, 'bold');
                 doc.setFontSize(10);
                 doc.setTextColor(255, 255, 255);
                 doc.text(inspectionToPrint.establishmentName.substring(0, 40).toUpperCase(), width - 15, 15, { align: 'right' });
                 
                 doc.setFontSize(8);
                 doc.setFont(styles.font, 'normal');
                 doc.setTextColor(200, 200, 200);
                 doc.text(`RELATÓRIO TÉCNICO • ${new Date(inspectionToPrint.date).toLocaleDateString()}`, width - 15, 20, { align: 'right' });

            } else {
                // STANDARD HEADER (White)
                doc.setFillColor(255, 255, 255);
                doc.rect(0, 0, width, 25, 'F');
                if (logoBase64) doc.addImage(logoBase64, 'PNG', 15, 8, 25, 6);
                doc.setFontSize(8);
                doc.setTextColor(...colors.secondary);
                doc.setFont('helvetica', 'normal');
                doc.text(inspectionToPrint.establishmentName.substring(0, 40).toUpperCase(), width - 15, 10, { align: 'right' });
                doc.text(`RELATÓRIO TÉCNICO • ${new Date(inspectionToPrint.date).toLocaleDateString()}`, width - 15, 14, { align: 'right' });
                doc.setDrawColor(226, 232, 240);
                doc.line(15, 20, width - 15, 20);
            }
        };
        
        const drawFooter = (pageNumber: number) => {
             const totalPages = (doc as any).internal.getNumberOfPages();
             doc.setFontSize(7);
             doc.setTextColor(...colors.secondary);
             doc.text(`Qualiseg Gestão de Riscos • Página ${pageNumber} de ${totalPages}`, width / 2, height - 10, { align: 'center' });
        };

        // --- Cover Page ---
        doc.setFillColor(styles.bodyBg[0], styles.bodyBg[1], styles.bodyBg[2]);
        doc.rect(0, 0, width, height, 'F');
        
        if (!useCustomTemplate) {
             if (logoBase64) doc.addImage(logoBase64, 'PNG', width/2 - 25, 40, 50, 12);
        } else {
             // Premium Cover Accent
             doc.setDrawColor(styles.accent[0], styles.accent[1], styles.accent[2]);
             doc.rect(20, 20, width - 40, height - 40);
             if (logoBase64) doc.addImage(logoBase64, 'PNG', width/2 - 25, 60, 50, 12);
        }

        let y = 100;
        doc.setFont(styles.font, 'bold');
        doc.setFontSize(24);
        doc.setTextColor(...colors.primary);
        doc.text('RELATÓRIO DE VISTORIA', width/2, y, { align: 'center' });
        
        y += 10;
        doc.setFont(styles.font, 'normal');
        doc.setFontSize(14);
        doc.setTextColor(...colors.secondary);
        doc.text('ANÁLISE DE RISCOS E MELHORIAS', width/2, y, { align: 'center' });

        y += 40;
        const cardX = width/2 - 80;
        const cardW = 160;
        
        if (useCustomTemplate) {
            doc.setDrawColor(styles.accent[0], styles.accent[1], styles.accent[2]);
            doc.setLineWidth(0.5);
            doc.line(cardX, y, cardX + cardW, y);
        } else {
            doc.setDrawColor(203, 213, 225);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(cardX, y, cardW, 80, 1, 1, 'FD');
        }

        let cy = y + 15;
        const labelX = cardX + 10;
        const valueX = cardX + 60;
        const addCardRow = (label: string, value: string) => {
             doc.setFontSize(9);
             doc.setFont(styles.font, 'bold');
             doc.setTextColor(...colors.primary);
             doc.text(label.toUpperCase(), labelX, cy);
             doc.setFont(styles.font, 'normal');
             doc.setTextColor(...colors.secondary);
             doc.text(value, valueX, cy);
             cy += 12;
        };

        addCardRow('Cliente', inspectionToPrint.establishmentName);
        addCardRow('CNPJ', inspectionToPrint.cnpj || '-');
        addCardRow('Local', inspectionToPrint.address.split(',').pop()?.trim() || '-');
        addCardRow('Data', new Date(inspectionToPrint.date).toLocaleDateString());
        addCardRow('Tipo', inspectionToPrint.type);

        const footerY = height - 30;
        doc.setFontSize(8);
        doc.setTextColor(...colors.secondary);
        doc.text("www.qualisegcorretora.com.br", width/2, footerY, {align:'center'});

        const activeInstances = inspectionToPrint.poiInstances.filter(pi => {
            if (pi.phases[0]?.status === 'not_applicable') return false;
            if (pi.currentPhase > 0) return true;
            if (pi.phases[0]?.selectedRecommendationIds && pi.phases[0].selectedRecommendationIds.length > 0) return true;
            if (pi.phases[0]?.dataUrl) return true;
            return false;
        });
        
        const riskOrder = { 'critical': 0, 'medium': 1, 'low': 2 };
        activeInstances.sort((a, b) => {
            const riskA = a.riskLevel || 'medium';
            const riskB = b.riskLevel || 'medium';
            return riskOrder[riskA] - riskOrder[riskB];
        });

        for (const instance of activeInstances) {
            const poiType = POINTS_OF_INTEREST_DATA.find(p => p.id === instance.poiId);
            if (!poiType) continue;

            doc.addPage();
            drawHeader((doc as any).internal.getCurrentPageInfo().pageNumber);

            const riskLevel = instance.riskLevel || 'medium';
            let riskColor = colors.risk.medium;
            let riskText = 'MÉDIO';

            if (riskLevel === 'critical') { riskColor = colors.risk.critical; riskText = 'CRÍTICO'; } 
            else if (riskLevel === 'low') { riskColor = colors.risk.low; riskText = 'BAIXO'; }

            let cursorY = useCustomTemplate ? 45 : 35;
            doc.setFontSize(14);
            doc.setFont(styles.font, 'bold');
            doc.setTextColor(...colors.primary);
            doc.text(`${poiType.id}. ${poiType.title}`, 15, cursorY);
            
            // Risk Badge
            if (useCustomTemplate) {
                 doc.setDrawColor(...riskColor);
                 doc.rect(width - 40, cursorY - 5, 25, 7);
            } else {
                 doc.setDrawColor(...riskColor);
                 doc.setFillColor(255, 255, 255);
                 doc.roundedRect(width - 40, cursorY - 5, 25, 7, 1, 1, 'FD');
            }
            doc.setFontSize(7);
            doc.setTextColor(...riskColor);
            doc.text(riskText, width - 27.5, cursorY - 0.5, { align: 'center' });

            cursorY += 15;
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(styles.font, 'bold');
            doc.text('ANÁLISE TÉCNICA', 15, cursorY);
            cursorY += 5;

            const phase1 = instance.phases[0];
            const recTexts = phase1?.selectedRecommendationIds.map(id => {
                const rec = poiType.recommendations.find(r => r.id === id);
                return rec ? `• ${rec.text}` : '';
            }).filter(t => t !== '') || [];

            const recBody = recTexts.length > 0 ? recTexts.join('\n') : "Em conformidade ou aguardando análise.";
            
            doc.setFontSize(9);
            doc.setTextColor(...colors.secondary);
            doc.setFont(styles.font, 'normal');
            const splitText = doc.splitTextToSize(recBody, width - 30);
            doc.text(splitText, 15, cursorY);
            const textHeight = splitText.length * 4; 
            cursorY += textHeight + 10;
            
            if (instance.deadline) {
                 doc.setFontSize(9);
                 doc.setTextColor(...colors.primary);
                 doc.setFont(styles.font, 'bold');
                 doc.text(`Prazo de Adequação: ${instance.deadline} dias`, 15, cursorY);
                 cursorY += 10;
            }
            cursorY += 5;

            const availableWidth = width - 30;
            const photoGap = 5;
            const visiblePhases = [
                { p: instance.phases[0], label: "Situação Encontrada", color: colors.phases.phase1 },
                { p: instance.phases[1], label: "Tratativa Realizada", color: colors.phases.phase2 },
                { p: instance.phases[2], label: "Validação", color: colors.phases.phase3 }
            ].filter(item => item.p?.dataUrl);

            if (visiblePhases.length > 0) {
                let photoW = (availableWidth - (visiblePhases.length - 1) * photoGap) / visiblePhases.length;
                if (photoW > 85) photoW = 85; 
                const photoH = photoW * 1.2;

                if (cursorY + photoH + 10 > height) {
                    doc.addPage();
                    drawHeader((doc as any).internal.getCurrentPageInfo().pageNumber);
                    cursorY = useCustomTemplate ? 45 : 35;
                }

                let currentX = 15;
                if ((visiblePhases.length * photoW) + ((visiblePhases.length - 1) * photoGap) < availableWidth) {
                    currentX = 15 + (availableWidth - ((visiblePhases.length * photoW) + ((visiblePhases.length - 1) * photoGap))) / 2;
                }

                for (const item of visiblePhases) {
                    if (!item.p?.dataUrl) continue;
                    doc.setDrawColor(200);
                    doc.rect(currentX, cursorY, photoW, photoH);
                    try { doc.addImage(item.p.dataUrl, 'JPEG', currentX + 0.5, cursorY + 0.5, photoW - 1, photoH - 1); } catch (e) {}
                    doc.setFontSize(7);
                    doc.setFont(styles.font, 'bold');
                    doc.setTextColor(...colors.secondary);
                    doc.text(item.label.toUpperCase(), currentX + (photoW / 2), cursorY + photoH + 5, { align: 'center' });
                    currentX += photoW + photoGap;
                }
            }
            drawFooter((doc as any).internal.getCurrentPageInfo().pageNumber);
        }
        const totalPages = (doc as any).internal.getNumberOfPages();
        for(let i = 2; i <= totalPages; i++) {
            doc.setPage(i);
            drawFooter(i);
        }
        doc.save(`relatorio_tecnico_${inspectionToPrint.establishmentName.replace(/\s/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF", error);
        alert("Erro ao gerar PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  // --- View Routing ---
  const renderContent = () => {
    switch (currentView) {
      case 'new_form':
        return <NewInspectionForm onSave={handleSaveInspection} onCancel={() => setCurrentView('dashboard')} />;
      case 'detail':
        return selectedInspection && <InspectionDetail 
            inspection={selectedInspection}
            poiTypes={POINTS_OF_INTEREST_DATA}
            onSelectPoiType={(poiId) => { setSelectedPoiTypeId(poiId); setCurrentView(selectedInspection.type === InspectionType.DELEGATED ? 'poi_inspection' : 'poi_instance_list'); }}
            onGenerateReport={() => generateReport()}
            isGeneratingPdf={isGeneratingPdf}
            onSave={() => { setCurrentView('dashboard'); setSelectedInspectionId(null); }}
            onSimulateExternalAccess={() => setCurrentView('delegated_external')}
        />;
      case 'poi_instance_list':
        return selectedInspection && selectedPoiType && <PoiInstanceList 
            poiType={selectedPoiType}
            instances={selectedInspection.poiInstances.filter(pi => pi.poiId === selectedPoiType.id)}
            onSelectInstance={(instanceId) => { setSelectedPoiInstanceId(instanceId); setCurrentView('poi_inspection'); }}
            onAddNewInstance={handleAddNewPoiInstance}
        />
      case 'poi_inspection':
        let instanceToShow = selectedPoiInstance;
        if (selectedInspection?.type === InspectionType.DELEGATED && selectedPoiType && !instanceToShow) {
            instanceToShow = selectedInspection.poiInstances.find(p => p.poiId === selectedPoiType.id);
        }
        return selectedPoiType && instanceToShow && selectedInspection && <PoiInspectionView 
            poi={selectedPoiType}
            poiInstance={instanceToShow}
            onSave={handleSavePoiInstance}
            establishmentName={selectedInspection.establishmentName}
            address={selectedInspection.address}
            inspectionType={selectedInspection.type}
            inspectionId={selectedInspection.id}
        />;
      case 'delegated_external':
        return selectedInspection && <DelegatedCaptureView 
            establishmentName={selectedInspection.establishmentName}
            address={selectedInspection.address}
            poiTypes={POINTS_OF_INTEREST_DATA}
            poiInstances={selectedInspection.poiInstances}
            inspectionId={selectedInspection.id}
            onCapturePhoto={handleDelegatedUpdate}
            onBulkUpdate={handleDelegatedBulkUpdate}
            onFinish={() => setCurrentView('detail')}
        />
      case 'template_manager':
        return <TemplateManager 
            currentTemplateName={useCustomTemplate ? "Executivo Gold (Custom)" : "Padrão Qualiseg (System)"}
            isPremiumMode={useCustomTemplate}
            onDownloadTemplate={() => {
                const dummyInspection = inspections[0] || {
                    id: 'template-download',
                    establishmentName: 'CLIENTE MODELO S.A',
                    address: 'Endereço Exemplo, 123',
                    type: InspectionType.INTERNAL,
                    date: Date.now(),
                    poiInstances: [],
                    cnpj: '00.000.000/0000-00'
                };
                generateReport(dummyInspection);
            }}
            onTestTemplate={() => {
                const dummyInspection = (inspections && inspections.length > 0) ? inspections[0] : {
                    id: 'template-test',
                    establishmentName: 'CLIENTE TESTE S.A',
                    address: 'Av. Paulista, 1000 - SP',
                    type: InspectionType.INTERNAL,
                    date: Date.now(),
                    poiInstances: [],
                    cnpj: '99.999.999/0001-99'
                };
                generateReport(dummyInspection);
            }}
            onUploadTemplate={(file) => {
                setUseCustomTemplate(true);
            }}
            onSimulateDelegated={() => {
                const simId = 'sim-delegated-' + Date.now();
                const instances = POINTS_OF_INTEREST_DATA.map(poi => ({
                    instanceId: `sim-inst-${poi.id}`,
                    poiId: poi.id,
                    phases: [null, null, null],
                    currentPhase: 0,
                    riskLevel: 'medium',
                    deadline: 30
                }));

                const simInspection: Inspection = {
                    id: simId,
                    establishmentName: 'Captura delegada',
                    address: 'Acesso Externo Delegado (Preview)',
                    type: InspectionType.DELEGATED,
                    date: Date.now(),
                    poiInstances: instances as PoiInstance[],
                    cnpj: '00.000.000/0000-00'
                };

                // Note: This is a simulation, in real app this would be created via API
                // For now, just set the view - the real inspection should be created via API
                setSelectedInspectionId(simId);
                setCurrentView('delegated_external');
                // TODO: Create inspection via API instead of local state
            }}
        />;
      case 'dashboard':
      default:
        return <Dashboard
          inspections={inspections} 
          onSelectInspection={id => { setSelectedInspectionId(id); setCurrentView('detail'); }}
          onNewInspection={() => setCurrentView('new_form')}
        />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
        case 'new_form': return 'Nova Vistoria';
        case 'detail': return selectedInspection?.establishmentName || 'Detalhes';
        case 'poi_instance_list': return selectedPoiType?.title || 'Itens';
        case 'poi_inspection': return selectedPoiType?.title || 'Inspeção';
        case 'delegated_external': return 'Acesso Externo';
        case 'template_manager': return 'Layouts de Relatório';
        case 'dashboard':
        default: return '';
    }
  };
  
  const handleBack = () => {
    if (currentView === 'delegated_external') { setCurrentView('detail'); return; }
    if (currentView === 'template_manager') { setCurrentView('dashboard'); return; }
    if (currentView === 'detail' || currentView === 'new_form') { setCurrentView('dashboard'); setSelectedInspectionId(null); } 
    else if (currentView === 'poi_instance_list') { setCurrentView('detail'); setSelectedPoiTypeId(null); } 
    else if (currentView === 'poi_inspection') {
        if (selectedInspection?.type === InspectionType.DELEGATED) { setCurrentView('detail'); } 
        else { setCurrentView('poi_instance_list'); }
        setSelectedPoiInstanceId(null);
    }
  };

  const showBackButton = currentView !== 'dashboard' && currentView !== 'delegated_external';

  // --- Renders ---
  if (appState === 'splash') return <SplashScreen onFinish={() => setAppState(authLoading || !authenticated ? 'login' : 'app')} />;
  if (appState === 'login') return <LoginScreen onLogin={() => setAppState('app')} />;
  if (authLoading || inspectionsLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <SpinnerIcon className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    // Application Global Background
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
        {/* Subtle Noise Overlay */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none z-0"></div>
        
        {currentView !== 'delegated_external' && (
            <Header 
                title={getHeaderTitle()}
                onBack={showBackButton ? handleBack : undefined}
                onSettings={currentView === 'dashboard' ? () => setCurrentView('template_manager') : undefined}
            />
        )}
        <main className={`${currentView !== 'delegated_external' ? 'relative z-10 max-w-5xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-6' : 'relative z-10'}`}>
            {renderContent()}
        </main>
    </div>
  );
}

export default App;
