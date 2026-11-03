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
  SlidersHorizontal,
  X,
  Upload,
  ArrowRight,
  Filter,
  Star,
  Check,
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import BooklistUploadModal from '@/components/BooklistUploadModal';
import {
  getCategoryLabel,
  STORE_CATEGORIES,
  INITIAL_CATALOG_PRODUCTS,
  CatalogProduct,
  GRADES_LIST,
  LANGUAGES_LIST,
  BRANDS_LIST,
} from '@/lib/catalog';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const gradeParam = searchParams.get('grade') || '';
  const brandParam = searchParams.get('brand') || '';

  const [products, setProducts] = useState<CatalogProduct[]>(INITIAL_CATALOG_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter View More / View Less Toggles (Daraz pattern)
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(gradeParam ? [gradeParam] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandParam ? [brandParam] : []);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  // Price Range (Daraz style: Min - Max inputs with submit button)
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(100000);

  // Sync with searchParams
  useEffect(() => {
    setSelectedCategory(categoryParam);
    if (gradeParam && !selectedGrades.includes(gradeParam)) setSelectedGrades([gradeParam]);
    if (brandParam && !selectedBrands.includes(brandParam)) setSelectedBrands([brandParam]);
  }, [categoryParam, gradeParam, brandParam]);

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (searchParam) params.set('search', searchParam);
        params.set('limit', '100');

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

  // Handle Category Selection
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Toggle Checkbox Item
  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Apply Price Range Filter (Daraz pattern)
  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const min = minPriceInput ? parseFloat(minPriceInput) : 0;
    const max = maxPriceInput ? parseFloat(maxPriceInput) : 100000;
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedGrades([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice(0);
    setAppliedMaxPrice(100000);
    router.push('/products');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    // Price filter
    if (p.price < appliedMinPrice || p.price > appliedMaxPrice) return false;

    // Stock availability filter
    if (inStockOnly && p.stock <= 0) return false;

    // Sale filter
    if (onSaleOnly && (!p.compareAtPrice || p.compareAtPrice <= p.price)) return false;

    // Grade filter
    if (selectedGrades.length > 0) {
      const matchGrade = selectedGrades.some(
        (g) =>
          (p.grade && p.grade.toLowerCase().includes(g.toLowerCase())) ||
          p.name.toLowerCase().includes(g.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(g.toLowerCase()))
      );
      if (!matchGrade) return false;
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      const pName = p.name.toLowerCase();
      const matchBrand = selectedBrands.some(
        (b) =>
          (p.brand && p.brand.toLowerCase() === b.toLowerCase()) ||
          pName.includes(b.toLowerCase())
      );
      if (!matchBrand) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // popularity / best match
  });

  const categoryTitle =
    selectedCategory === 'all' ? 'All Products' : getCategoryLabel(selectedCategory);

  const displayedCategories = showAllCategories
    ? STORE_CATEGORIES
    : STORE_CATEGORIES.slice(0, 8);

  const displayedBrands = showAllBrands ? BRANDS_LIST : BRANDS_LIST.slice(0, 7);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGrades.length > 0 ||
    selectedBrands.length > 0 ||
    inStockOnly ||
    onSaleOnly ||
    appliedMinPrice > 0 ||
    appliedMaxPrice < 100000;

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16 font-sans">
      
      {/* ── 1. Top Breadcrumb & Slim Booklist Alert ───────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#0066FF] transition-colors">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/products" className="hover:text-[#0066FF] transition-colors">
              Catalog
            </Link>
            {selectedCategory !== 'all' && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 font-semibold">{categoryTitle}</span>
              </>
            )}
            {searchParam && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 font-semibold">"{searchParam}"</span>
              </>
            )}
          </div>

          {/* Slim Booklist Upload Pill - Clean & Non-Intrusive */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:text-[#0052CC] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1 rounded-none transition-colors cursor-pointer border border-blue-200"
          >
            <Upload size={13} />
            <span>Upload School Booklist for Instant Quote</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* ── 2. Main Catalog 2-Column Grid (Daraz Standard) ────────── */}
      <div className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* =========================================================================
              LEFT SIDEBAR: Daraz-Style Filter Panel (AZIP Blue Theme)
             ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-none border border-slate-200/90 p-4 shadow-2xs space-y-5 sticky top-24">
            
            {/* Header + Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Filter size={15} className="text-[#0066FF]" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-[#0066FF] hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. Category Tree Filter (Daraz signature list) */}
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Categories
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left py-1 px-2 rounded-none transition-colors cursor-pointer border-none flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 text-[#0066FF] font-bold'
                        : 'text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 bg-transparent'
                    }`}
                  >
                    <span>All Products</span>
                  </button>
                </li>
                {displayedCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <li key={cat.slug}>
                      <button
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full text-left py-1 px-2 rounded-none transition-colors cursor-pointer border-none flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-[#0066FF] font-bold'
                            : 'text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 bg-transparent'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {STORE_CATEGORIES.length > 8 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="mt-2 text-[11px] font-bold text-[#0066FF] hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  {showAllCategories ? 'VIEW LESS' : 'VIEW MORE'}
                </button>
              )}
            </div>

            {/* 2. Brand Checkboxes Filter (Daraz pattern) */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Brand
              </div>
              <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {displayedBrands.map((brand) => {
                  const checked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2 text-slate-700 py-0.5 hover:text-[#0066FF] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                        className="accent-[#0066FF] rounded-none cursor-pointer w-3.5 h-3.5"
                      />
                      <span className={checked ? 'font-bold text-[#0066FF]' : 'font-medium'}>
                        {brand}
                      </span>
                    </label>
                  );
                })}
              </div>
              {BRANDS_LIST.length > 7 && (
                <button
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="mt-2 text-[11px] font-bold text-[#0066FF] hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  {showAllBrands ? 'VIEW LESS' : 'VIEW MORE'}
                </button>
              )}
            </div>

            {/* 3. Service & Promotion Filter (Daraz standard) */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Service &amp; Promotion
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 text-slate-700 py-0.5 hover:text-[#0066FF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#0066FF] rounded-none cursor-pointer w-3.5 h-3.5"
                  />
                  <span className={inStockOnly ? 'font-bold text-[#0066FF]' : 'font-medium'}>
                    In Stock Only
                  </span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 py-0.5 hover:text-[#0066FF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="accent-[#0066FF] rounded-none cursor-pointer w-3.5 h-3.5"
                  />
                  <span className={onSaleOnly ? 'font-bold text-[#0066FF]' : 'font-medium'}>
                    On Sale / Discounted
                  </span>
                </label>
              </div>
            </div>

            {/* 4. Grade / School Level Filter */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Grade / School Level
              </div>
              <div className="space-y-1.5 text-xs">
                {GRADES_LIST.map((grade) => {
                  const checked = selectedGrades.includes(grade);
                  return (
                    <label
                      key={grade}
                      className="flex items-center gap-2 text-slate-700 py-0.5 hover:text-[#0066FF] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(selectedGrades, setSelectedGrades, grade)}
                        className="accent-[#0066FF] rounded-none cursor-pointer w-3.5 h-3.5"
                      />
                      <span className={checked ? 'font-bold text-[#0066FF]' : 'font-medium'}>
                        {grade}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Price Filter (Daraz Exact Format: Min - Max + Button) */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Price (Rs.)
              </div>
              <form onSubmit={handleApplyPrice} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#0066FF] bg-white font-medium"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#0066FF] bg-white font-medium"
                />
                <button
                  type="submit"
                  className="w-8 h-7 shrink-0 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-none flex items-center justify-center transition-colors cursor-pointer border-none shadow-xs font-bold"
                  title="Apply price filter"
                >
                  <ArrowRight size={13} />
                </button>
              </form>
              {(appliedMinPrice > 0 || appliedMaxPrice < 100000) && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Rs. {appliedMinPrice.toLocaleString()} - Rs. {appliedMaxPrice.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setMinPriceInput('');
                      setMaxPriceInput('');
                      setAppliedMinPrice(0);
                      setAppliedMaxPrice(100000);
                    }}
                    className="text-[#0066FF] hover:underline cursor-pointer bg-transparent border-none p-0 text-[10.5px]"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

          </aside>

          {/* =========================================================================
              RIGHT COLUMN: Products Listing (Daraz Layout)
             ========================================================================= */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Top Results Header + Toolbar (Daraz format) */}
            <div className="bg-white rounded-none border border-slate-200/90 px-4 py-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              {/* Result Title & Count */}
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {searchParam ? `Results for "${searchParam}"` : categoryTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Showing {sortedProducts.length} items
                </p>
              </div>

              {/* Controls: Sort By + View Mode Toggle + Mobile Filter Trigger */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-none text-xs font-bold text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] bg-white cursor-pointer"
                >
                  <SlidersHorizontal size={13} />
                  <span>Filters {hasActiveFilters && '•'}</span>
                </button>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="hidden sm:inline">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-none bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                  >
                    <option value="popularity">Best Match</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Product Name</option>
                  </select>
                </div>

                {/* View Mode Toggle (Grid / List) */}
                <div className="flex items-center border border-slate-200 rounded-none overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors cursor-pointer border-none ${
                      viewMode === 'grid'
                        ? 'bg-blue-50 text-[#0066FF]'
                        : 'bg-white text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors cursor-pointer border-none border-l border-slate-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-50 text-[#0066FF]'
                        : 'bg-white text-slate-400 hover:text-slate-700'
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span
                    onClick={() => handleCategorySelect('all')}
                    className="bg-blue-50 text-[#0066FF] border border-blue-200 px-2 py-0.5 rounded-none text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-blue-100"
                  >
                    {categoryTitle} <X size={11} />
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    onClick={() => toggleItem(selectedBrands, setSelectedBrands, b)}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-none text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    {b} <X size={11} />
                  </span>
                ))}
                {selectedGrades.map((g) => (
                  <span
                    key={g}
                    onClick={() => toggleItem(selectedGrades, setSelectedGrades, g)}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-none text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    {g} <X size={11} />
                  </span>
                ))}
                {inStockOnly && (
                  <span
                    onClick={() => setInStockOnly(false)}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-none text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    In Stock <X size={11} />
                  </span>
                )}
                {onSaleOnly && (
                  <span
                    onClick={() => setOnSaleOnly(false)}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-none text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    On Sale <X size={11} />
                  </span>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-[#0066FF] hover:underline font-bold text-[11px] ml-1 cursor-pointer bg-transparent border-none p-0"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid / List */}
            {loading ? (
              <div className="py-24 text-center bg-white rounded-none border border-slate-200">
                <div className="w-8 h-8 border-3 border-[#0066FF] border-t-transparent rounded-none animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-500">Loading catalog...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-none border border-slate-200 px-6">
                <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-none flex items-center justify-center mx-auto mb-3">
                  <Search size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                  We couldn't find any products matching your active filters. Try clearing some filters.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-5 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-none transition-colors cursor-pointer border-none"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5'
                      : 'space-y-3'
                  }
                >
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      image={product.images?.[0]?.url || ''}
                      category={product.category}
                      stock={product.stock}
                      brand={product.brand}
                      badge={product.badge}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination (Daraz Standard) */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-none border border-slate-200 px-4 py-3 text-xs text-slate-500">
                  <span>
                    Showing 1 - {sortedProducts.length} of {sortedProducts.length} items
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-none bg-white font-medium text-slate-600 hover:border-[#0066FF] cursor-pointer">
                      Previous
                    </button>
                    <button className="w-7 h-7 rounded-none bg-[#0066FF] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs border-none">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-none bg-white font-medium text-slate-600 hover:border-[#0066FF] cursor-pointer">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

          </main>

        </div>
      </div>

      {/* ── 3. Mobile Filter Drawer ─────────────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase mb-2">Categories</div>
                <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                  <button
                    onClick={() => {
                      handleCategorySelect('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-1 px-2 rounded-none block ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 text-[#0066FF] font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    All Products
                  </button>
                  {STORE_CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        handleCategorySelect(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-1 px-2 rounded-none block ${
                        selectedCategory === c.slug
                          ? 'bg-blue-50 text-[#0066FF] font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs font-bold text-slate-900 uppercase mb-2">Brands</div>
                <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto">
                  {BRANDS_LIST.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleItem(selectedBrands, setSelectedBrands, b)}
                        className="accent-[#0066FF]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs font-bold text-slate-900 uppercase mb-2">Price (Rs.)</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded-none"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6 flex gap-2">
              <button
                onClick={() => {
                  handleClearAll();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold border border-slate-300 rounded-none text-slate-700"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  handleApplyPrice();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#0066FF] text-white rounded-none"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booklist Upload Modal */}
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
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16 text-center text-sm font-bold text-slate-500">
            Loading AZIP Catalog...
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </StoreShell>
  );
}
