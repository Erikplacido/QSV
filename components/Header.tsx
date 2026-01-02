
import React from 'react';
import { ChevronLeftIcon, SettingsIcon } from './Icons';

interface HeaderProps {
    title: string;
    onBack?: () => void;
    onSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onSettings }) => {
    const logoUrl = 'https://qualisegcorretora.com.br/wp-content/uploads/2022/10/logo-footer.png';
    
    return (
        <header className="sticky top-0 z-40">
             {/* Glass Effect Background */}
            <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"></div>
            
            {/* Content */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-[40px_1fr_40px] items-center h-18 py-4">
                    
                    {/* Left Action */}
                    <div className="justify-self-start">
                        {onBack && (
                             <button 
                                onClick={onBack} 
                                className="group flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                             >
                                <ChevronLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        )}
                    </div>

                    {/* Center Title / Logo */}
                    <div className="justify-self-center text-center">
                        {onBack ? (
                            <h1 className="text-sm font-medium text-slate-200 tracking-wide truncate max-w-[200px] sm:max-w-md animate-fadeIn">
                                {title}
                            </h1>
                        ) : (
                            <img src={logoUrl} alt="Qualiseg" className="h-6 opacity-90 filter brightness-0 invert drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                        )}
                    </div>
                    
                    {/* Right Spacer/Action */}
                    <div className="justify-self-end flex items-center justify-end w-10">
                        {onSettings && !onBack && (
                            <button 
                                onClick={onSettings}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <SettingsIcon className="w-5 h-5" />
                            </button>
                        )}
                         {/* Profile Placeholder - only show if not settings or back logic overrides */}
                         {!onSettings && !onBack && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-80 border border-white/10 shadow-inner"></div>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
