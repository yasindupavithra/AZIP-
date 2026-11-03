type BrandName = 'CASIO' | 'Faber-Castell' | 'Maped' | 'deli' | 'PILOT' | 'Classmate';

/**
 * Crisp, typographic brand wordmarks rendered as vector text so they stay sharp
 * on every screen. Colours follow each brand's recognisable palette.
 */
export default function BrandMark({
  name,
  size = 'md',
}: {
  name: BrandName;
  size?: 'sm' | 'md';
}) {
  const s = size === 'sm' ? 0.78 : 1;

  switch (name) {
    case 'CASIO':
      return (
        <span
          className="font-black tracking-[0.04em] text-[#1F3E9A]"
          style={{ fontFamily: 'Outfit, Inter, sans-serif', fontSize: 22 * s, letterSpacing: '0.02em' }}
        >
          CASIO
        </span>
      );
    case 'Faber-Castell':
      return (
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 22 22" width={18 * s} height={18 * s} aria-hidden>
            <circle cx="11" cy="11" r="10" fill="#0E5B3A" />
            <path d="M6 15 L11 5 L16 15 Z" fill="#fff" opacity="0.92" />
            <path d="M8.5 15 L11 10 L13.5 15 Z" fill="#0E5B3A" />
          </svg>
          <span
            className="font-bold italic text-[#0E5B3A]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 14.5 * s }}
          >
            Faber-Castell
          </span>
        </span>
      );
    case 'Maped':
      return (
        <span
          className="inline-flex items-center rounded-full bg-[#E3262F] px-3 py-0.5 font-black italic text-white shadow-sm"
          style={{ fontFamily: 'Outfit, Inter, sans-serif', fontSize: 17 * s }}
        >
          Maped
        </span>
      );
    case 'deli':
      return (
        <span
          className="inline-flex items-center rounded-md bg-[#E60012] px-2.5 py-0.5 font-black lowercase text-white shadow-sm"
          style={{ fontFamily: 'Outfit, Inter, sans-serif', fontSize: 19 * s, letterSpacing: '-0.01em' }}
        >
          deli
        </span>
      );
    case 'PILOT':
      return (
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 22 22" width={18 * s} height={18 * s} aria-hidden>
            <path d="M3 18 L19 4 L14 19 L11 13 Z" fill="#0B2D72" />
            <path d="M11 13 L19 4 L8.5 11 Z" fill="#2F6BFF" />
          </svg>
          <span
            className="font-black tracking-[0.12em] text-[#0B2D72]"
            style={{ fontFamily: 'Outfit, Inter, sans-serif', fontSize: 18 * s }}
          >
            PILOT
          </span>
        </span>
      );
    case 'Classmate':
      return (
        <span
          className="font-extrabold text-[#C8102E]"
          style={{ fontFamily: '"Dancing Script", cursive', fontSize: 23 * s }}
        >
          Classmate
        </span>
      );
    default:
      return <span className="font-black text-slate-700">{name}</span>;
  }
}

export type { BrandName };
