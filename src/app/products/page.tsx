'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  LayoutGrid, 
  List, 
  Check, 
  SlidersHorizontal,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Upload,
  GraduationCap,
  BookOpen,
  PenTool,
  Layers,
  CheckCircle2,
  Package
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import BackToSchoolBundleCard from '@/components/BackToSchoolBundleCard';
import BooklistUploadModal from '@/components/BooklistUploadModal';
import { 
  getCategoryLabel, 
  getCategoryImage, 
  STORE_CATEGORIES, 
  INITIAL_CATALOG_PRODUCTS, 
  CatalogProduct,
  GRADES_LIST,
  LANGUAGES_LIST,
  RULING_TYPES_LIST,
  BRANDS_LIST,
  BACK_TO_SCHOOL_BUNDLES
} from '@/lib/catalog';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const gradeParam = searchParams.get('grade') || '';
  const languageParam = searchParams.get('language') || '';
  const rulingParam = searchParams.get('ruling') || '';

  const [products, setProducts] = useState<CatalogProduct[]>(INITIAL_CATALOG_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const [sortBy, setSortBy] = useState('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter Accordion Collapsible States
  const [isGradeOpen, setIsGradeOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isRulingOpen, setIsRulingOpen] = useState(false);
  const [isAvailOpen, setIsAvailOpen] = useState(true);

  // Faceted Filter Selected Values
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(gradeParam ? [gradeParam] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(languageParam ? [languageParam] : []);
  const [selectedRulings, setSelectedRulings] = useState<string[]>(rulingParam ? [rulingParam] : []);
  
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(15000);

  // Sync search parameters from URL
  useEffect(() => {
    setSelectedCategory(categoryParam);
    if (gradeParam && !selectedGrades.includes(gradeParam)) setSelectedGrades([gradeParam]);
    if (languageParam && !selectedLanguages.includes(languageParam)) setSelectedLanguages([languageParam]);
    if (rulingParam && !selectedRulings.includes(rulingParam)) setSelectedRulings([rulingParam]);
  }, [categoryParam, gradeParam, languageParam, rulingParam]);

  // Fetch products from backend API or initial local fallback catalog
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (searchParam) params.set('search', searchParam);
        params.set('limit', '50');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || INITIAL_CATALOG_PRODUCTS);
        } else {
          setProducts(INITIAL_CATALOG_PRODUCTS);
        }
      } catch (err) {
        setProducts(INITIAL_CATALOG_PRODUCTS);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, searchParam]);

  // Faceted Filter Application Handler
  const handleApplyFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchParam) params.set('search', searchParam);
    if (selectedGrades.length > 0) params.set('grade', selectedGrades[0]);
    if (selectedLanguages.length > 0) params.set('language', selectedLanguages[0]);
    if (selectedRulings.length > 0) params.set('ruling', selectedRulings[0]);
    
    router.push(`/products?${params.toString()}`);
  };

  // Reset All Filters
  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedGrades([]);
    setSelectedBrands([]);
    setSelectedLanguages([]);
    setSelectedRulings([]);
    setMinPrice(0);
    setMaxPrice(15000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(15000);
    setInStockOnly(false);
    router.push('/products');
  };

  // Toggle Selection Helpers
  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Comprehensive Multi-faceted Filtering Algorithm
  const filteredProducts = products.filter((p) => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    
    // 2. Price Range Filter
    if (p.price < appliedMinPrice || p.price > appliedMaxPrice) return false;
    
    // 3. Availability Filter
    if (inStockOnly && p.stock <= 0) return false;

    // 4. Grade / Level Filter
    if (selectedGrades.length > 0) {
      if (!p.grade || !selectedGrades.some((g) => p.grade?.toLowerCase().includes(g.toLowerCase()))) {
        // Fallback search in tags or name
        const matchTag = selectedGrades.some((g) => p.name.toLowerCase().includes(g.toLowerCase()) || p.tags?.some((t) => t.toLowerCase().includes(g.toLowerCase())));
        if (!matchTag) return false;
      }
    }

    // 5. Brand Filter
    if (selectedBrands.length > 0) {
      const pName = p.name.toLowerCase();
      const matchBrand = selectedBrands.some((b) => (p.brand && p.brand.toLowerCase() === b.toLowerCase()) || pName.includes(b.toLowerCase()));
      if (!matchBrand) return false;
    }

    // 6. Language / Medium Filter
    if (selectedLanguages.length > 0) {
      if (!p.language || !selectedLanguages.includes(p.language)) {
        const matchLang = selectedLanguages.some((l) => p.name.toLowerCase().includes(l.toLowerCase()) || p.tags?.some((t) => t.toLowerCase().includes(l.toLowerCase())));
        if (!matchLang) return false;
      }
    }

    // 7. Ruling Type Filter
    if (selectedRulings.length > 0) {
      if (!p.rulingType || !selectedRulings.includes(p.rulingType)) {
        const matchRuling = selectedRulings.some((r) => p.name.toLowerCase().includes(r.toLowerCase()) || p.tags?.some((t) => t.toLowerCase().includes(r.toLowerCase())));
        if (!matchRuling) return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // popularity default
  });

  const categoryTitle = selectedCategory === 'all' ? 'All Products' : getCategoryLabel(selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. Hero Promotional Banner */}
      <section className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-800 overflow-hidden relative py-8 md:py-10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Sparkles size={12} className="fill-white" />
                <span>Premium Educational Stationery Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight font-['Outfit']">
                Complete Educational &amp; Stationery Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                Filter through over 5,000+ textbooks, CR exercise books, Pilot gel pens, Casio scientific calculators, and Faber-Castell art supplies.
              </p>
            </div>

            {/* Direct Upload Booklist Banner Action */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl shrink-0 max-w-xs text-center space-y-3">
              <div className="text-xs font-black text-white flex items-center justify-center gap-2">
                <Upload size={16} className="text-[#DC2626]" />
                <span>School Booklist Direct Upload</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Got a school booklist? Upload your list image or PDF & get instant price estimation!
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] border-none cursor-pointer"
              >
                Upload Booklist Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-2.5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-[12px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#DC2626] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="hover:text-[#DC2626] transition-colors">Catalog</Link>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-bold">{categoryTitle}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Pillar 2 Requirement: Explicit Legible Featured Category Grid Cards */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
            Browse Featured Categories
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STORE_CATEGORIES.slice(0, 7).map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`group relative rounded-2xl p-3 border transition-all duration-300 cursor-pointer text-left flex flex-col items-center justify-center text-center ${
                    isSelected
                      ? 'border-[#DC2626] bg-red-50/70 shadow-sm ring-2 ring-red-500/20'
                      : 'border-gray-200 bg-gray-50/60 hover:border-[#DC2626] hover:bg-white hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-white border border-gray-100 p-1 flex items-center justify-center">
                    <img
                      src={getCategoryImage(cat.slug)}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Legible explicit typography label */}
                  <span className={`text-xs font-black line-clamp-1 transition-colors ${
                    isSelected ? 'text-[#DC2626]' : 'text-gray-800 group-hover:text-[#DC2626]'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Catalog Container */}
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================================
              LEFT SIDEBAR: Pillar 3 Faceted Filtering System
             ========================================================================= */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 p-5 shadow-xs sticky top-28 space-y-5">
            
            {/* Header + Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-[#DC2626]" />
                <span>Faceted Filters</span>
              </span>
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626] hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Clear All
              </button>
            </div>

            {/* Big Apply Filter Action */}
            <button
              onClick={handleApplyFilter}
              className="w-full py-3 px-4 bg-[#DC2626] hover:bg-[#cc0043] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border-none uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              <span>Apply Filters</span>
            </button>

            {/* Filter 1: Grade / Level (Grades 1-13 / OL & AL) */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsGradeOpen(!isGradeOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={15} className="text-[#DC2626]" /> Grade / School Level
                </span>
                {isGradeOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isGradeOpen && (
                <div className="space-y-1.5 pt-1">
                  {GRADES_LIST.map((g) => (
                    <label
                      key={g}
                      onClick={() => toggleSelection(selectedGrades, setSelectedGrades, g)}
                      className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGrades.includes(g)}
                        onChange={() => {}}
                        className="accent-[#DC2626] rounded cursor-pointer"
                      />
                      <span className={selectedGrades.includes(g) ? 'font-bold text-[#DC2626]' : ''}>
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Category Taxonomy */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={15} className="text-[#DC2626]" /> Categories
                </span>
                {isCatOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isCatOpen && (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <label
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-center gap-2 text-xs text-gray-800 py-1 hover:text-[#DC2626] cursor-pointer font-bold border-b border-gray-100 pb-1.5 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === 'all'}
                      onChange={() => {}}
                      className="accent-[#DC2626] rounded cursor-pointer"
                    />
                    <span>All Products</span>
                  </label>

                  {STORE_CATEGORIES.map((cat) => (
                    <label
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className="flex items-center gap-2 text-xs text-gray-600 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.slug}
                        onChange={() => {}}
                        className="accent-[#DC2626] rounded cursor-pointer"
                      />
                      <span className={selectedCategory === cat.slug ? 'font-bold text-[#DC2626]' : ''}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 3: Brand */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Brands (Atlas, Casio, Pilot...)</span>
                {isBrandOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isBrandOpen && (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {BRANDS_LIST.map((b) => (
                    <label
                      key={b}
                      onClick={() => toggleSelection(selectedBrands, setSelectedBrands, b)}
                      className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => {}}
                        className="accent-[#DC2626] rounded cursor-pointer"
                      />
                      <span className={selectedBrands.includes(b) ? 'font-bold text-[#DC2626]' : ''}>
                        {b}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 4: Language / Medium */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Language / Medium (Sinhala/Eng/Tam)</span>
                {isLanguageOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isLanguageOpen && (
                <div className="space-y-1.5 pt-1">
                  {LANGUAGES_LIST.map((l) => (
                    <label
                      key={l}
                      onClick={() => toggleSelection(selectedLanguages, setSelectedLanguages, l)}
                      className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(l)}
                        onChange={() => {}}
                        className="accent-[#DC2626] rounded cursor-pointer"
                      />
                      <span className={selectedLanguages.includes(l) ? 'font-bold text-[#DC2626]' : ''}>
                        {l}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 5: Ruling Type */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsRulingOpen(!isRulingOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span className="flex items-center gap-2">
                  <Layers size={14} className="text-[#DC2626]" /> Ruling &amp; Paper Type
                </span>
                {isRulingOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isRulingOpen && (
                <div className="space-y-1.5 pt-1">
                  {RULING_TYPES_LIST.map((r) => (
                    <label
                      key={r}
                      onClick={() => toggleSelection(selectedRulings, setSelectedRulings, r)}
                      className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRulings.includes(r)}
                        onChange={() => {}}
                        className="accent-[#DC2626] rounded cursor-pointer"
                      />
                      <span className={selectedRulings.includes(r) ? 'font-bold text-[#DC2626]' : ''}>
                        {r}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 6: Price Range */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Price Range (Rs.)</span>
                {isPriceOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isPriceOpen && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">Min</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>
                    <span className="text-gray-400 mt-4">-</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">Max</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={15000}
                    step={250}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#DC2626] cursor-pointer"
                  />
                  <div className="text-[11px] text-gray-500 flex justify-between font-bold">
                    <span>Rs. {minPrice.toLocaleString()}</span>
                    <span>Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter 7: Availability */}
            <div>
              <button
                onClick={() => setIsAvailOpen(!isAvailOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-extrabold text-gray-900 hover:text-[#DC2626] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Stock Availability</span>
                {isAvailOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {isAvailOpen && (
                <label
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#DC2626] cursor-pointer font-medium"
                >
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => {}}
                    className="accent-[#DC2626] rounded cursor-pointer"
                  />
                  <span className={inStockOnly ? 'font-bold text-[#DC2626]' : ''}>In Stock Only</span>
                </label>
              )}
            </div>

          </aside>

          {/* =========================================================================
              RIGHT COLUMN: BUNDLE SHOWCASE & PRODUCTS GRID
             ========================================================================= */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* Pillar 4 Feature: High-Conversion Back-to-School Bundles Section */}
            {selectedCategory === 'all' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                      <Package size={20} className="text-[#DC2626]" />
                      <span>Back to School Master Kits &amp; Bundles</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      One-click pre-packaged grade bundles with instant discount savings!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {BACK_TO_SCHOOL_BUNDLES.map((bundle) => (
                    <BackToSchoolBundleCard key={bundle.id} bundle={bundle} />
                  ))}
                </div>
              </section>
            )}

            {/* Catalog Controls Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-700 shadow-xs">
              
              {/* Left View Toggles */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">View:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}
                    className="px-2.5 py-1 border border-gray-200 rounded-lg bg-white text-xs font-bold focus:outline-none focus:border-[#DC2626]"
                  >
                    <option value="20">20 Items</option>
                    <option value="40">40 Items</option>
                    <option value="60">60 Items</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-red-50 text-[#DC2626] font-bold' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-red-50 text-[#DC2626] font-bold' : 'text-gray-400 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Right Sort By Dropdown */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold focus:outline-none focus:border-[#DC2626]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Product Name</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Counter & Active Filter Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-gray-800">
                Showing {sortedProducts.length} Items
              </span>

              {/* Active Filter Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedGrades.map((g) => (
                  <span key={g} onClick={() => toggleSelection(selectedGrades, setSelectedGrades, g)} className="bg-red-50 text-[#DC2626] border border-red-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer">
                    {g} ×
                  </span>
                ))}
                {selectedBrands.map((b) => (
                  <span key={b} onClick={() => toggleSelection(selectedBrands, setSelectedBrands, b)} className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer">
                    {b} ×
                  </span>
                ))}
                {selectedLanguages.map((l) => (
                  <span key={l} onClick={() => toggleSelection(selectedLanguages, setSelectedLanguages, l)} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer">
                    {l} ×
                  </span>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-gray-200">
                <div className="w-8 h-8 border-3 border-[#DC2626] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-500">Loading stationery catalog...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 px-6">
                <div className="w-14 h-14 bg-red-50 text-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
                  We couldn't find any products matching your active filters or price criteria.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 bg-[#DC2626] text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer border-none"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                }>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      image={product.images?.[0]?.url || getCategoryImage(product.category)}
                      category={product.category}
                      stock={product.stock}
                      brand={product.brand}
                      badge={product.badge}
                      variants={product.variants}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500">
                  <span>Showing 1 - {sortedProducts.length} of {sortedProducts.length} items</span>
                  <div className="flex items-center gap-1.5">
                    <button className="px-3.5 py-2 border border-gray-200 rounded-xl bg-white font-bold text-gray-700 cursor-pointer">
                      Previous
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-[#DC2626] text-white font-black flex items-center justify-center cursor-pointer shadow-xs">
                      1
                    </button>
                    <button className="px-3.5 py-2 border border-gray-200 rounded-xl bg-white font-bold text-gray-700 cursor-pointer">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

          </main>

        </div>
      </div>

      {/* Booklist Upload Modal Triggered from Catalog Hero */}
      <BooklistUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

    </div>
  );
}

export default function ProductsPage() {
  return (
    <StoreShell>
      <Suspense fallback={<div className="container py-12 text-center text-sm font-bold text-gray-500">Loading AZIP Catalog...</div>}>
        <ProductsContent />
      </Suspense>
    </StoreShell>
  );
}
