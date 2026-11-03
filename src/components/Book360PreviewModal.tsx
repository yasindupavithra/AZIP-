'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCw,
  Layers,
  Sparkles,
  ShoppingCart,
  Check,
  ShieldCheck,
  Zap,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/lib/languageContext';

export interface Book360Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  stock?: number;
  grade?: string;
  pages?: number;
  rulingType?: string;
}

interface Book360PreviewModalProps {
  product: Book360Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Book360PreviewModal({
  product,
  isOpen,
  onClose,
}: Book360PreviewModalProps) {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isLevitating, setIsLevitating] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<'cover' | 'spine' | 'back' | 'inside'>('cover');

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-orbit loop
  useEffect(() => {
    if (isAutoOrbit && !isDragging && isOpen) {
      orbitIntervalRef.current = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.8) % 360);
      }, 30);
    } else {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    }
    return () => {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    };
  }, [isAutoOrbit, isDragging, isOpen]);

  // Handle Drag to Rotate 360
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartAngle(rotationAngle);
    setIsAutoOrbit(false);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      // Sensitivity: 1px = 0.8 deg
      let newAngle = (startAngle + deltaX * 0.8) % 360;
      if (newAngle < 0) newAngle += 360;
      setRotationAngle(newAngle);
    },
    [isDragging, startX, startAngle]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartAngle(rotationAngle);
    setIsAutoOrbit(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    let newAngle = (startAngle + deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setRotationAngle(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock || 50,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Preset angle snapping
  const snapTo = (angle: number, spread: 'cover' | 'spine' | 'back' | 'inside') => {
    setIsAutoOrbit(false);
    setSelectedSpread(spread);
    setRotationAngle(angle);
  };

  // Calculate faux 3D transformation for book cover
  // As angle goes from 0 to 360, rotateY simulates perspective
  const radians = (rotationAngle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  // Depth tilt
  const tiltY = rotationAngle;
  const isBackFacing = cos < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop with dark cyan sci-fi blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050B14]/80 backdrop-blur-md transition-opacity"
      />

      {/* Main Holographic Modal Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0B1728] via-[#07101E] to-[#040810] border border-[#00C4D8]/40 shadow-[0_0_50px_rgba(0,196,216,0.25)] rounded-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh]">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00C4D8] to-transparent shadow-[0_0_12px_#00C4D8]" />

        {/* Left Side: 3D Zero-G Stage */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 min-h-[350px] md:min-h-[460px] flex flex-col items-center justify-center p-6 select-none cursor-grab active:cursor-grabbing overflow-hidden bg-radial from-[#0C2442]/60 to-transparent"
        >
          {/* Top HUD Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-2 bg-[#00C4D8]/15 border border-[#00C4D8]/40 px-3 py-1 rounded-full backdrop-blur-md">
              <Compass size={14} className="text-[#00C4D8] animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[11px] font-black text-[#00E5FF] tracking-wider uppercase font-mono">
                ORBIT AZIMUTH: {Math.round(rotationAngle)}°
              </span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                  isWireframe
                    ? 'bg-[#00C4D8] text-[#050B14] border-[#00E5FF] shadow-[0_0_10px_#00C4D8]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#00C4D8]/50'
                }`}
                title="Toggle Wireframe HUD"
              >
                Wireframe
              </button>

              <button
                type="button"
                onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isAutoOrbit
                    ? 'bg-[#00C4D8]/20 text-[#00E5FF] border-[#00C4D8]'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
                title={isAutoOrbit ? 'Pause Orbit' : 'Auto-Orbit'}
              >
                <RotateCw size={14} className={isAutoOrbit ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
              </button>
            </div>
          </div>

          {/* Hologram Anti-Gravity Emitter Base (Underneath product) */}
          <div className="absolute bottom-8 w-64 h-24 pointer-events-none flex items-center justify-center">
            {/* Concentric rings */}
            <div className="w-64 h-16 rounded-[100%] border border-[#00C4D8]/30 shadow-[0_0_25px_rgba(0,196,216,0.3)] animate-pulse" />
            <div className="absolute w-44 h-11 rounded-[100%] border border-[#00E5FF]/40" />
            <div className="absolute w-24 h-6 rounded-[100%] bg-[#00C4D8]/20 blur-[6px]" />
            {/* Dynamic Zero-G levitating shadow */}
            <div
              className="absolute w-36 h-8 rounded-[100%] bg-black/60 blur-[10px] transition-all duration-300"
              style={{
                transform: `scale(${1 - Math.abs(sin) * 0.15})`,
                opacity: 0.6 + cos * 0.2,
              }}
            />
          </div>

          {/* Interactive 3D Product Mesh Stage */}
          <div
            className={`relative z-10 w-52 h-64 sm:w-60 sm:h-76 flex items-center justify-center transition-transform duration-75 ${
              isLevitating ? 'antigravity-levitate' : ''
            }`}
            style={{
              perspective: '1200px',
            }}
          >
            {/* Book Body in 3D */}
            <div
              className="relative w-44 h-60 sm:w-52 sm:h-72 transform-style-3d transition-transform duration-75"
              style={{
                transform: `rotateY(${rotationAngle}deg) rotateX(8deg)`,
              }}
            >
              {/* Front Cover */}
              <div
                className={`absolute inset-0 bg-white rounded-lg border overflow-hidden shadow-2xl backface-hidden ${
                  isWireframe
                    ? 'border-[#00E5FF] bg-[#071A2E]/90 shadow-[0_0_20px_#00C4D8]'
                    : 'border-slate-300'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-contain p-2 ${
                    isWireframe ? 'filter invert brightness-150 contrast-200 opacity-80' : ''
                  }`}
                  draggable={false}
                />
                {/* Specular glare based on angle */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(${115 + sin * 45}deg, transparent 40%, rgba(255,255,255,${
                      Math.max(0, cos * 0.35)
                    }) 50%, transparent 60%)`,
                  }}
                />
                {/* Hologram scanline */}
                {isWireframe && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF]/20 to-transparent h-12 w-full animate-[scanline-sweep_2.5s_linear_infinite]" />
                )}
              </div>

              {/* Spine (Side) */}
              <div
                className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-800 to-slate-900 border-y border-l border-[#00C4D8]/40 origin-left flex items-center justify-center overflow-hidden"
                style={{
                  transform: 'rotateY(-90deg) translateX(-16px)',
                }}
              >
                <span className="text-[9px] font-black tracking-widest text-[#00E5FF] -rotate-90 whitespace-nowrap uppercase">
                  {product.grade || 'AZIP PREMIUM'} • {product.pages || '120P'}
                </span>
              </div>

              {/* Back Cover */}
              <div
                className={`absolute inset-0 rounded-lg border overflow-hidden shadow-2xl p-4 flex flex-col justify-between ${
                  isWireframe
                    ? 'border-[#00E5FF] bg-[#071A2E]/90'
                    : 'bg-[#F8FAFC] border-slate-300'
                }`}
                style={{
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-black text-[#008D9B] uppercase tracking-wider">
                    Official Product Information
                  </span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1 line-clamp-2">
                    {product.name}
                  </p>
                </div>

                <div className="space-y-1.5 my-auto text-[10px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Quality Grade:</span>
                    <span className="font-bold text-slate-900">80 GSM High Bright</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Syllabus Compliance:</span>
                    <span className="font-bold text-emerald-600">NIE Sri Lanka</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authenticity:</span>
                    <span className="font-bold text-[#008D9B]">100% Genuine</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  {/* Faux Barcode */}
                  <div className="flex gap-[2px] h-6 items-end">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4].map((w, idx) => (
                      <span key={idx} className="bg-slate-800" style={{ width: `${w}px`, height: '100%' }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">AZ-{product.id.slice(0, 6)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Snap Angle Buttons */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2 z-20">
            {[
              { label: 'Front (0°)', angle: 0, spread: 'cover' as const },
              { label: 'Spine (90°)', angle: 90, spread: 'spine' as const },
              { label: 'Back (180°)', angle: 180, spread: 'back' as const },
              { label: 'Inside (270°)', angle: 270, spread: 'inside' as const },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => snapTo(btn.angle, btn.spread)}
                className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg border transition-all cursor-pointer ${
                  Math.abs(rotationAngle - btn.angle) < 25
                    ? 'bg-[#00C4D8] text-[#050B14] border-[#00E5FF] shadow-[0_0_12px_rgba(0,196,216,0.5)] font-extrabold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#00C4D8]/50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Drag instruction notice */}
          <p className="absolute bottom-11 text-[11px] text-slate-400 font-medium tracking-wide">
            {t('preview.drag_hint')}
          </p>
        </div>

        {/* Right Side: Specifications & Quick Checkout Details */}
        <div className="w-full md:w-80 lg:w-96 bg-[#081220] border-t md:border-t-0 md:border-l border-[#00C4D8]/30 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header / Close button */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#00C4D8] bg-[#00C4D8]/10 px-2 py-0.5 rounded border border-[#00C4D8]/30 mb-1.5">
                  <Sparkles size={11} /> 360° Anti-Gravity Inspector
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-['Outfit']">
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Price & Discount */}
            <div className="flex items-baseline gap-2.5 my-3 pb-3 border-b border-white/10">
              <span className="text-2xl font-black text-[#00E5FF] font-['Outfit']">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xs text-slate-400 line-through">
                    Rs. {product.compareAtPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#FF3B5C] bg-[#FF3B5C]/15 px-2 py-0.5 rounded">
                    Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Live Stock Counter Animation */}
            <div className="p-3 rounded-xl bg-[#00C4D8]/10 border border-[#00C4D8]/30 mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-[#00E5FF]">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                  Live Orbit Inventory
                </span>
                <span className="font-extrabold text-white font-mono">
                  {product.stock || 18} {t('flash.stock_left')}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00C4D8] to-[#00E5FF] rounded-full"
                  style={{ width: `${Math.min(100, ((product.stock || 18) / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* Product Specifications list */}
            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Curriculum</span>
                <span className="font-semibold text-white">Sri Lankan MOE Standard</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Paper Weight</span>
                <span className="font-semibold text-white">80 GSM Woodfree Bright</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Zero-G Status</span>
                <span className="font-semibold text-[#00C4D8]">Weightless Calibrated</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Islandwide Dispatch</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> Within 24 Hours
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                added
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-[#00C4D8] to-[#009BB0] hover:from-[#00E5FF] hover:to-[#00B4C8] text-[#050B14] border-[#00E5FF] shadow-[0_0_25px_rgba(0,196,216,0.4)]'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} strokeWidth={3} />
                  <span>Added to Orbit Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{t('preview.add_cart')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
