'use client';

import { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Minus,
  Sparkles,
  ShoppingCart,
  GraduationCap,
  ShieldCheck,
  Feather,
  Zap,
  RotateCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/lib/languageContext';

interface ConfigItem {
  id: string;
  name: string;
  category: string;
  price: number;
  weightKg: number;
  image: string;
  defaultSelected: boolean;
  qty: number;
}

interface GradeTier {
  id: string;
  label: string;
  subtitle: string;
  baseDiscount: number; // e.g. 20%
  items: ConfigItem[];
}

const GRADE_TIERS: GradeTier[] = [
  {
    id: 'primary',
    label: 'Grade 1 - 5',
    subtitle: 'Primary Explorer Kit (Syllabus Approved)',
    baseDiscount: 20,
    items: [
      {
        id: 'gk-p1',
        name: 'Atlas Single Ruled 80pg (Pack of 5)',
        category: 'Books',
        price: 475,
        weightKg: 0.75,
        image: '/images/hd/products/atlas-exercise-book.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-p2',
        name: 'Atlas Chooty Ballpoint Pens (Pack of 10)',
        category: 'Pens',
        price: 350,
        weightKg: 0.15,
        image: '/images/hd/products/pilot-g2-pens.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-p3',
        name: 'Faber-Castell 24 Classic Colour Pencils',
        category: 'Art',
        price: 890,
        weightKg: 0.35,
        image: '/images/hd/products/drawing-kit.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-p4',
        name: 'Anti-Gravity Ergonomic Backpack (Blue)',
        category: 'Bags',
        price: 2125,
        weightKg: 0.85,
        image: '/images/hd/products/school-backpack-blue.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-p5',
        name: 'BPA-Free 3-Compartment Bento Lunch Box',
        category: 'Essentials',
        price: 1250,
        weightKg: 0.3,
        image: '/images/hd/products/lunch-box.jpg',
        defaultSelected: false,
        qty: 1,
      },
      {
        id: 'gk-p6',
        name: 'Stainless Steel Insulated Bottle (650ml)',
        category: 'Essentials',
        price: 890,
        weightKg: 0.35,
        image: '/images/hd/products/water-bottle.jpg',
        defaultSelected: false,
        qty: 1,
      },
    ],
  },
  {
    id: 'junior',
    label: 'Grade 6 - 9',
    subtitle: 'Junior Secondary Mastery Pack',
    baseDiscount: 22,
    items: [
      {
        id: 'gk-j1',
        name: 'Atlas CR Hardcover 120pg (Pack of 4)',
        category: 'Books',
        price: 860,
        weightKg: 1.2,
        image: '/images/hd/categories/exercise-books.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-j2',
        name: 'Helix Oxford Mathematical Geometry Set',
        category: 'Maths',
        price: 450,
        weightKg: 0.25,
        image: '/images/hd/products/geometry-set.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-j3',
        name: 'Pilot G2 Retractable Gel Pens (0.7mm 3-Pack)',
        category: 'Pens',
        price: 450,
        weightKg: 0.12,
        image: '/images/hd/products/pilot-g2-pens.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-j4',
        name: 'Faber-Castell Watercolour Cakes (12 Shades)',
        category: 'Art',
        price: 690,
        weightKg: 0.3,
        image: '/images/hd/products/faber-castell-water-color.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-j5',
        name: 'Highlighters Textliner Set (4 Neon Colours)',
        category: 'Stationery',
        price: 320,
        weightKg: 0.15,
        image: '/images/hd/products/highlighters-set.jpg',
        defaultSelected: false,
        qty: 1,
      },
      {
        id: 'gk-j6',
        name: 'Zero-G 32L High-Volume School Bag',
        category: 'Bags',
        price: 2450,
        weightKg: 0.9,
        image: '/images/hd/products/school-backpack-blue.jpg',
        defaultSelected: true,
        qty: 1,
      },
    ],
  },
  {
    id: 'ol',
    label: 'Grade 10 - 11 (O/L)',
    subtitle: 'Ordinary Level National Exam Suite',
    baseDiscount: 25,
    items: [
      {
        id: 'gk-ol1',
        name: 'Atlas A4 Hardcover 200pg CR Notebooks (Set of 6)',
        category: 'Books',
        price: 1300,
        weightKg: 2.1,
        image: '/images/hd/categories/exercise-books.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-ol2',
        name: 'Casio FX-991CW ClassWiz Scientific Calculator',
        category: 'Maths',
        price: 4990,
        weightKg: 0.22,
        image: '/images/hd/products/casio-fx991cw.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-ol3',
        name: 'Helix Oxford Precision Metal Geometry Set',
        category: 'Maths',
        price: 450,
        weightKg: 0.25,
        image: '/images/hd/products/geometry-set.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-ol4',
        name: 'Pilot G2 Gel Pens (Pack of 5)',
        category: 'Pens',
        price: 750,
        weightKg: 0.18,
        image: '/images/hd/products/pilot-g2-pens.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-ol5',
        name: 'Post-It Super Sticky Notes Cube (400 Sheets)',
        category: 'Stationery',
        price: 250,
        weightKg: 0.12,
        image: '/images/hd/products/sticky-notes.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-ol6',
        name: 'Ergonomic Waterproof 32L Navy Backpack',
        category: 'Bags',
        price: 2125,
        weightKg: 0.85,
        image: '/images/hd/products/school-backpack-blue.jpg',
        defaultSelected: false,
        qty: 1,
      },
    ],
  },
  {
    id: 'al',
    label: 'Grade 12 - 13 (A/L)',
    subtitle: 'Advanced Level Science & Commerce Suite',
    baseDiscount: 28,
    items: [
      {
        id: 'gk-al1',
        name: 'Casio FX-991CW Advanced ClassWiz (Natural Display)',
        category: 'Maths',
        price: 4990,
        weightKg: 0.22,
        image: '/images/hd/products/casio-fx991cw.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-al2',
        name: 'Atlas Premium A4 Hardcover 400pg (Pack of 3)',
        category: 'Books',
        price: 1950,
        weightKg: 2.4,
        image: '/images/hd/categories/exercise-books.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-al3',
        name: 'Pilot G2 Premium Gel Pens (Black & Blue 4-Pack)',
        category: 'Pens',
        price: 600,
        weightKg: 0.16,
        image: '/images/hd/products/pilot-g2-pens.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-al4',
        name: 'Faber-Castell Textliner 48 (Pack of 6 Assorted)',
        category: 'Stationery',
        price: 480,
        weightKg: 0.2,
        image: '/images/hd/products/highlighters-set.jpg',
        defaultSelected: true,
        qty: 1,
      },
      {
        id: 'gk-al5',
        name: 'Heavy-Duty Tech Backpack with Laptop Sleeve',
        category: 'Bags',
        price: 2850,
        weightKg: 0.95,
        image: '/images/hd/products/school-backpack-blue.jpg',
        defaultSelected: true,
        qty: 1,
      },
    ],
  },
];

export default function GradeKitConfigurator() {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);

  const [activeTierId, setActiveTierId] = useState('ol');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    'gk-ol1': true,
    'gk-ol2': true,
    'gk-ol3': true,
    'gk-ol4': true,
    'gk-ol5': true,
  });
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({
    'gk-ol1': 1,
    'gk-ol2': 1,
    'gk-ol3': 1,
    'gk-ol4': 1,
    'gk-ol5': 1,
  });
  const [isKitAdded, setIsKitAdded] = useState(false);

  const currentTier = useMemo(
    () => GRADE_TIERS.find((t) => t.id === activeTierId) || GRADE_TIERS[2],
    [activeTierId]
  );

  const handleSelectTier = (tier: GradeTier) => {
    setActiveTierId(tier.id);
    const newSelected: Record<string, boolean> = {};
    const newQty: Record<string, number> = {};
    tier.items.forEach((item) => {
      newSelected[item.id] = item.defaultSelected;
      newQty[item.id] = 1;
    });
    setSelectedItems(newSelected);
    setItemQuantities(newQty);
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [id]: next };
    });
  };

  // Calculations
  const calculations = useMemo(() => {
    let rawTotal = 0;
    let totalWeight = 0;
    let selectedCount = 0;

    currentTier.items.forEach((item) => {
      if (selectedItems[item.id]) {
        const qty = itemQuantities[item.id] || 1;
        rawTotal += item.price * qty;
        totalWeight += item.weightKg * qty;
        selectedCount += qty;
      }
    });

    // Dynamic bundle discount: Base tier discount + bonus if 4+ items selected
    const bonus = selectedCount >= 4 ? 3 : 0;
    const discountPercent = Math.min(30, currentTier.baseDiscount + bonus);
    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const finalPrice = Math.max(0, rawTotal - discountAmount);

    return {
      rawTotal,
      discountPercent,
      discountAmount,
      finalPrice,
      totalWeight,
      selectedCount,
    };
  }, [currentTier, selectedItems, itemQuantities]);

  const handleAddBundleToCart = () => {
    if (calculations.selectedCount === 0) return;

    addItem({
      id: `custom-kit-${currentTier.id}-${Date.now().toString().slice(-4)}`,
      name: `${currentTier.label} Custom Anti-Gravity Kit (${calculations.selectedCount} Items)`,
      price: calculations.finalPrice,
      image: currentTier.items[0]?.image || '/images/hd/products/atlas-exercise-book.jpg',
      stock: 50,
    });

    setIsKitAdded(true);
    setTimeout(() => setIsKitAdded(false), 2500);
  };

  return (
    <section className="relative w-full py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F2F8FB] via-[#E8F5F8] to-[#F2F8FB] border-y border-[#00C4D8]/20 overflow-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#00C4D8]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C4D8]/15 border border-[#00C4D8]/40 text-[#008D9B] text-[11px] font-black tracking-wider uppercase mb-2">
              <Zap size={13} className="text-[#00C4D8] fill-[#00C4D8]" />
              {t('config.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1B2A] tracking-tight font-['Outfit']">
              {t('config.title')}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              {t('config.subtitle')}
            </p>
          </div>

          {/* Grade Level Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {GRADE_TIERS.map((tier) => {
              const active = tier.id === activeTierId;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => handleSelectTier(tier)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer border ${
                    active
                      ? 'bg-gradient-to-r from-[#00C4D8] to-[#009BB0] text-white border-[#00E5FF] shadow-[0_0_20px_rgba(0,196,216,0.35)] scale-105'
                      : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-[#00C4D8]/60 shadow-xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={15} />
                    {tier.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configurator Grid: Left (Checklist) + Right (Floating Zero-G Stage & Pricing HUD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Checklist (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white/90 backdrop-blur-md border border-[#00C4D8]/30 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
                    {currentTier.subtitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Toggle items to customize your curriculum essentials
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#008D9B] bg-[#00C4D8]/10 px-2.5 py-1 rounded-full border border-[#00C4D8]/20">
                    Base Discount: -{currentTier.baseDiscount}%
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {currentTier.items.map((item) => {
                  const isChecked = Boolean(selectedItems[item.id]);
                  const qty = itemQuantities[item.id] || 1;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F2FCFD] border-[#00C4D8] shadow-[0_0_15px_rgba(0,196,216,0.15)]'
                          : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Custom Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#00C4D8] text-white shadow-xs'
                              : 'bg-white border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Title & Category */}
                        <div className="min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-bold truncate leading-snug ${
                              isChecked ? 'text-slate-900' : 'text-slate-600'
                            }`}
                          >
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-semibold text-[#008D9B]">{item.category}</span>
                            <span>•</span>
                            <span>{item.weightKg.toFixed(2)} kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div
                        className="flex items-center gap-3 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs sm:text-sm font-black text-slate-900 font-['Outfit']">
                          Rs. {(item.price * qty).toLocaleString()}
                        </span>

                        {isChecked && (
                          <div className="flex items-center border border-[#00C4D8]/50 rounded-lg bg-white p-0.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                              aria-label="Decrease"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-bold w-6 text-center text-slate-900 font-mono">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                              aria-label="Increase"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Zero-G Levitating Preview & Summary HUD (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Holographic Levitating Stage Preview */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#0A1829] via-[#071322] to-[#040C16] border border-[#00C4D8]/40 p-5 shadow-[0_0_35px_rgba(0,196,216,0.2)] overflow-hidden text-white">
              {/* Top HUD Tag */}
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[#00E5FF] tracking-wider">
                  <Sparkles size={13} /> Zero-G Levitation Chamber
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C4D8]/20 text-[#00E5FF] border border-[#00C4D8]/40">
                  {calculations.selectedCount} Items in Field
                </span>
              </div>

              {/* Floating Orbit Items Stage */}
              <div className="relative h-44 sm:h-52 w-full flex items-center justify-center overflow-hidden">
                {/* Concentric Holographic Emitter Rings */}
                <div className="absolute bottom-2 w-48 h-12 rounded-[100%] border border-[#00C4D8]/30 shadow-[0_0_20px_rgba(0,196,216,0.3)] animate-pulse" />
                <div className="absolute bottom-4 w-32 h-8 rounded-[100%] border border-[#00E5FF]/40" />

                {/* Floating Items Array */}
                <div className="relative z-10 flex items-center justify-center -space-x-4">
                  {currentTier.items
                    .filter((item) => selectedItems[item.id])
                    .slice(0, 4)
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-white/95 border border-[#00C4D8]/50 shadow-xl p-2 flex items-center justify-center antigravity-levitate"
                        style={{
                          animationDelay: `${idx * 0.4}s`,
                          zIndex: 10 + idx,
                          transform: `translateY(${idx % 2 === 0 ? '-6px' : '4px'})`,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#00C4D8] text-[#050B14] font-black text-[10px] flex items-center justify-center shadow-xs">
                          {itemQuantities[item.id] || 1}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Anti-Gravity Physics Sensor Gauge */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 my-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Earth Mass:</span>
                  <span className="text-sm font-bold text-slate-300 font-mono">
                    {calculations.totalWeight.toFixed(2)} kg
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#00E5FF] font-bold block flex items-center gap-1">
                    <Feather size={11} /> {t('config.zero_g_weight')}
                  </span>
                  <span className="text-sm font-black text-[#00C4D8] font-mono">
                    0.00 kg (Calibrated)
                  </span>
                </div>
              </div>

              {/* Pricing Breakdown HUD */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Regular Total Price:</span>
                  <span className="line-through">
                    Rs. {calculations.rawTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-[#00E5FF] font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} /> Bundle Discount ({calculations.discountPercent}% Off):
                  </span>
                  <span>- Rs. {calculations.discountAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                  <span className="text-sm font-extrabold text-white">Configured Kit Total:</span>
                  <span className="text-2xl font-black text-[#00E5FF] font-['Outfit']">
                    Rs. {calculations.finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddBundleToCart}
                disabled={calculations.selectedCount === 0}
                className={`w-full mt-5 py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border shadow-lg ${
                  isKitAdded
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-[#00C4D8] to-[#009BB0] hover:from-[#00E5FF] hover:to-[#00B4C8] text-[#050B14] border-[#00E5FF] shadow-[0_0_25px_rgba(0,196,216,0.4)] active:scale-[0.99]'
                }`}
              >
                {isKitAdded ? (
                  <>
                    <Check size={18} strokeWidth={3} />
                    <span>Kit Teleported to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>{t('config.add_kit_to_cart')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
