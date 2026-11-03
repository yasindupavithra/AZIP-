import type { FC } from 'react';

type BrandLogoProps = {
  name: 'CASIO' | 'Faber-Castell' | 'Maped' | 'deli' | 'PILOT' | 'Classmate' | string;
  className?: string;
};

export const BrandLogo: FC<BrandLogoProps> = ({ name, className = 'h-6 w-auto' }) => {
  switch (name.toLowerCase()) {
    case 'casio':
      return (
        <span className={`font-black tracking-wider text-[#003B95] text-[17px] sm:text-[19px] select-none font-sans ${className}`} style={{ letterSpacing: '0.08em' }}>
          CASIO
        </span>
      );

    case 'faber-castell':
      return (
        <div className={`flex items-center gap-1.5 select-none ${className}`}>
          <svg className="w-5 h-5 text-[#005837] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            {/* Jousting knights silhouette crest */}
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
          </svg>
          <span className="font-serif font-bold text-[#005837] text-[13px] sm:text-[15px] tracking-tight whitespace-nowrap">
            FABER-CASTELL
          </span>
        </div>
      );

    case 'maped':
      return (
        <div className={`px-2.5 py-0.5 rounded-full bg-[#E50027] text-white font-black italic text-[14px] sm:text-[15px] tracking-tight select-none shadow-sm flex items-center justify-center ${className}`}>
          Maped
        </div>
      );

    case 'deli':
      return (
        <span className={`font-black lowercase text-[#E30613] text-[20px] sm:text-[23px] tracking-tighter select-none ${className}`} style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
          deli
        </span>
      );

    case 'pilot':
      return (
        <div className={`flex items-center gap-1 select-none text-[#004B9B] ${className}`}>
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2L15 9H9L12 2ZM3 14h18v2H3v-2zm3 4h12v2H6v-2z"/>
          </svg>
          <span className="font-black italic text-[16px] sm:text-[18px] tracking-wider">
            PILOT
          </span>
        </div>
      );

    case 'classmate':
      return (
        <span className={`font-bold italic text-[#103E84] text-[16px] sm:text-[18px] tracking-tight select-none ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
          classmate
        </span>
      );

    default:
      return (
        <span className={`font-black text-slate-700 text-[15px] ${className}`}>
          {name}
        </span>
      );
  }
};

export default BrandLogo;
