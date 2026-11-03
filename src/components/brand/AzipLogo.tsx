'use client';

import { useEffect, useState, useId } from 'react';

export type LogoStylePreset = 'modern-mall' | 'daraz-flame' | 'royal-crest' | 'crimson-3d';

type AzipLogoProps = {
  /** `light` = for white backgrounds, `dark` = for navy/dark backgrounds */
  variant?: 'light' | 'dark';
  /** Render only the icon mark */
  markOnly?: boolean;
  /** Optional explicit style override */
  preset?: LogoStylePreset;
  className?: string;
  title?: string;
};

export const LOGO_PRESET_STORAGE_KEY = 'azip_logo_preset_v1';

export const LOGO_PRESETS: { id: LogoStylePreset; label: string; desc: string }[] = [
  {
    id: 'modern-mall',
    label: 'Ocean & Gold Mall',
    desc: 'Clean modern e-commerce bag + book wing with gold smile',
  },
  {
    id: 'daraz-flame',
    label: 'Daraz Sunset Origami',
    desc: 'Vibrant orange-red 3D origami wing & bold wordmark',
  },
  {
    id: 'royal-crest',
    label: 'Royal Blue Minimal',
    desc: 'Sleek international tech-retail lightning A emblem',
  },
  {
    id: 'crimson-3d',
    label: '3D Red & Black Blade',
    desc: 'Classic 3D metallic red & black blade logo',
  },
];

export default function AzipLogo({
  variant = 'light',
  markOnly = false,
  preset,
  className = '',
  title = 'AZIP Store',
}: AzipLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const dark = variant === 'dark';
  const [activePreset, setActivePreset] = useState<LogoStylePreset>(preset || 'modern-mall');

  useEffect(() => {
    if (preset) {
      setActivePreset(preset);
      return;
    }
    try {
      const saved = localStorage.getItem(LOGO_PRESET_STORAGE_KEY) as LogoStylePreset | null;
      if (saved && ['modern-mall', 'daraz-flame', 'royal-crest', 'crimson-3d'].includes(saved)) {
        setActivePreset(saved);
      }
    } catch {
      // ignore storage errors
    }

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(LOGO_PRESET_STORAGE_KEY) as LogoStylePreset | null;
        if (saved) setActivePreset(saved);
      } catch {
        // ignore
      }
    };
    window.addEventListener('azip-logo-change', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('azip-logo-change', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [preset]);

  // ── PRESET 4: Classic 3D Red/Black Metallic Image ──
  if (activePreset === 'crimson-3d') {
    return (
      <span className={`inline-flex items-center select-none ${className}`} title={title}>
        <img
          src="/user-logo-exact.png"
          alt={title}
          className={`h-full w-auto max-h-12 object-contain ${
            dark ? 'brightness-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]' : ''
          }`}
        />
      </span>
    );
  }

  // ── PRESET 2: Daraz Sunset Origami Wing Style ──
  if (activePreset === 'daraz-flame') {
    return (
      <span
        className={`inline-flex items-center gap-2.5 select-none ${className}`}
        title={title}
      >
        {/* Origami 3D Wing + Shopping Bag Icon */}
        <svg
          viewBox="0 0 48 48"
          className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 drop-shadow-[0_4px_10px_rgba(255,85,0,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`df1-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF8008" />
              <stop offset="100%" stopColor="#FF2A6D" />
            </linearGradient>
            <linearGradient id={`df2-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFC837" />
              <stop offset="100%" stopColor="#FF5100" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="0" fill={`url(#df1-${uid})`} />
          {/* Origami Left Wing */}
          <path
            d="M12 35 L22 11 C23 8.8 25.5 8.8 26.5 11 L30 19 L19 35 H12 Z"
            fill="#FFFFFF"
          />
          {/* Origami Right Fold */}
          <path
            d="M24 14 L36 35 H28.5 L21.5 21.5 L24 14 Z"
            fill={`url(#df2-${uid})`}
          />
          {/* Speed Zip Crossbar */}
          <path
            d="M16 28.5 L34 23 L31 30.5 L16 28.5 Z"
            fill="#FFFFFF"
          />
        </svg>

        {!markOnly && (
          <span className="flex flex-col justify-center leading-none">
            <span className="flex items-baseline tracking-tight font-['Outfit']">
              <span
                className={`text-2xl sm:text-[28px] font-black tracking-tighter ${
                  dark ? 'text-white' : 'text-slate-900'
                }`}
              >
                azip
              </span>
              <span className="text-2xl sm:text-[28px] font-black text-[#FF5500]">.lk</span>
            </span>
            <span
              className={`text-[9px] font-extrabold uppercase tracking-[0.18em] mt-0.5 ${
                dark ? 'text-orange-300' : 'text-slate-500'
              }`}
            >
              ONLINE MALL
            </span>
          </span>
        )}
      </span>
    );
  }

  // ── PRESET 3: Royal Blue Minimal Lightning Crest ──
  if (activePreset === 'royal-crest') {
    return (
      <span
        className={`inline-flex items-center gap-2.5 select-none ${className}`}
        title={title}
      >
        <svg
          viewBox="0 0 48 48"
          className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 drop-shadow-[0_4px_10px_rgba(0,119,182,0.28)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`rc1-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#023E8A" />
              <stop offset="55%" stopColor="#0077B6" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="0" fill={`url(#rc1-${uid})`} />
          <path
            d="M24 9 L37 37 H29.5 L26.8 30.5 H21.2 L18.5 37 H11 L24 9 Z M24 18.5 L22 24.5 H26 L24 18.5 Z"
            fill="#FFFFFF"
          />
          <circle cx="36" cy="12" r="3.5" fill="#38BDF8" />
        </svg>

        {!markOnly && (
          <span className="flex flex-col justify-center leading-none">
            <span className="flex items-center gap-1 font-['Outfit']">
              <span
                className={`text-2xl sm:text-[27px] font-black tracking-tight ${
                  dark ? 'text-white' : 'text-[#0A192F]'
                }`}
              >
                AZIP
              </span>
              <span className="bg-[#0096C7] text-white text-[10px] font-black px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                STORE
              </span>
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-[0.15em] mt-1 ${
                dark ? 'text-sky-300' : 'text-slate-500'
              }`}
            >
              BOOKS &amp; STATIONERY
            </span>
          </span>
        )}
      </span>
    );
  }

  // ── PRESET 1 (DEFAULT): Modern Ocean & Gold E-Commerce Bag + Book Wing ──
  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      title={title}
    >
      {/* Crisp 3D E-Commerce Shopping Bag + Open Book Wing Emblem */}
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 drop-shadow-[0_4px_12px_rgba(0,150,199,0.3)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`mmBg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="45%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#00C4D8" />
          </linearGradient>
          <linearGradient id={`mmGold-${uid}`} x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Sharp Square Base */}
        <rect x="2" y="4" width="44" height="42" rx="0" fill={`url(#mmBg-${uid})`} />

        {/* Subtle Top Gloss */}
        <path
          d="M15 5 H33 C39.5 5 44 9.5 44 16 V19 C32 13 16 13 4 19 V16 C4 9.5 8.5 5 15 5 Z"
          fill="#FFFFFF"
          opacity="0.14"
        />

        {/* Sleek Geometric "A" Wing */}
        <path
          d="M24 11 L35.5 34 H28.8 L26.5 28.8 H21.5 L19.2 34 H12.5 L24 11 Z M24 18.8 L22.2 23.8 H25.8 L24 18.8 Z"
          fill="#FFFFFF"
        />

        {/* Golden Express Smile Swoosh Underneath */}
        <path
          d="M13.5 36.5 C20.5 42 29.5 41.5 36.5 35"
          stroke={`url(#mmGold-${uid})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M33 34 L38 34 L37 38.8 Z"
          fill={`url(#mmGold-${uid})`}
        />
      </svg>

      {!markOnly && (
        <span className="flex flex-col justify-center leading-none">
          {/* Top Brand Line */}
          <span className="flex items-center font-['Outfit'] tracking-tight">
            <span
              className={`text-2xl sm:text-[28px] font-black tracking-tight ${
                dark ? 'text-white' : 'text-slate-900'
              }`}
            >
              AZ
            </span>
            <span className="text-2xl sm:text-[28px] font-black tracking-tight text-[#0096C7]">
              IP
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-none bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
              .LK
            </span>
          </span>

          {/* Clean Micro Subtitle */}
          <span
            className={`text-[9px] font-extrabold uppercase tracking-[0.16em] mt-0.5 ${
              dark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            BOOKS &amp; STATIONERY
          </span>
        </span>
      )}
    </span>
  );
}
