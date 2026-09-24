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
  RotateCcw
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import { getCategoryLabel, getCategoryImage, STORE_CATEGORIES, INITIAL_CATALOG_PRODUCTS, CatalogProduct } from '@/lib/catalog';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url: string }>;
  category: string;
  stock: number;
  sku?: string;
  tags?: string[];
  isFeatured?: boolean;
}

const BRANDS_LIST = [
  'Atlas',
  'Casio',
  'Pilot',
  'Faber-Castell',
  'Oxford',
  'Mont Marte',
  'Stabilo',
  'SanDisk',
  'Helix',
  'Nataraj'
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const [sortBy, setSortBy] = useState('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter Accordion States
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isAvailOpen, setIsAvailOpen] = useState(true);

  // Filter Values
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(15000);

  // Sync param changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

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
          setProducts(data.products || []);
        } else {
          setProducts(INITIAL_CATALOG_PRODUCTS as any);
        }
      } catch (err) {
        setProducts(INITIAL_CATALOG_PRODUCTS as any);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, searchParam]);

  // Apply Filter Handler
  const handleApplyFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchParam) params.set('search', searchParam);
    router.push(`/products?${params.toString()}`);
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(15000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(15000);
    setInStockOnly(false);
    router.push('/products');
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    // Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    // Price Range
    if (p.price < appliedMinPrice || p.price > appliedMaxPrice) return false;
    // In Stock Only
    if (inStockOnly && p.stock <= 0) return false;
    // Brands
    if (selectedBrands.length > 0) {
      const pName = p.name.toLowerCase();
      const match = selectedBrands.some((b) => pName.includes(b.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // default popularity
  });

  const categoryTitle = selectedCategory === 'all' ? 'All Products' : getCategoryLabel(selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      
      {/* 1. Singer-style Wide Hero Banner across Products Page */}
      <section className="w-full bg-gradient-to-r from-[#d9f2f4] via-[#e6f7f8] to-[#c7eef0] border-b border-gray-200 overflow-hidden relative py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Montage Images */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <img
                src="/categories/cat_books.jpg"
                alt="Books"
                className="w-24 h-24 rounded-xl object-cover shadow-sm border-2 border-white -rotate-3"
              />
              <img
                src="/categories/cat_stationery.jpg"
                alt="Pens & Stationery"
                className="w-28 h-28 rounded-xl object-cover shadow-md border-2 border-white rotate-2"
              />
            </div>

            {/* Central Punchline in Singer.lk Style */}
            <div className="text-center flex-1 max-w-2xl px-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f4d54] tracking-tight leading-tight font-['Outfit']">
                Shop All Your Essential Educational Materials &amp; Stationery in One Place!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                Island-wide Express Delivery • 100% Genuine Brands • Cash on Delivery Available
              </p>
            </div>

            {/* Right Montage Images */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <img
                src="/categories/cat_school.jpg"
                alt="School Backpacks"
                className="w-28 h-28 rounded-xl object-cover shadow-md border-2 border-white -rotate-2"
              />
              <img
                src="/categories/cat_art.jpg"
                alt="Art Supplies"
                className="w-24 h-24 rounded-xl object-cover shadow-sm border-2 border-white rotate-3"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Singer-style Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-2.5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-[12px] text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#e3004f] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="hover:text-[#e3004f] transition-colors">Products</Link>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-semibold">{categoryTitle}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Singer Sub-Category Horizontal Carousel */}
      <div className="bg-white border-b border-gray-200 py-5">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {/* All Products option */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex flex-col items-center min-w-[95px] max-w-[110px] group cursor-pointer bg-transparent border-none p-1 transition-all ${
                selectedCategory === 'all' ? 'scale-105' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className={`w-16 h-16 rounded-full border-2 p-1 bg-gray-50 flex items-center justify-center transition-all ${
                selectedCategory === 'all' ? 'border-[#e3004f] shadow-md bg-red-50' : 'border-gray-200 group-hover:border-[#e3004f]'
              }`}>
                <img
                  src="/categories/cat_stationery.jpg"
                  alt="All Products"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`text-[12px] mt-2 text-center leading-tight line-clamp-2 transition-colors ${
                selectedCategory === 'all' ? 'font-bold text-[#e3004f]' : 'text-gray-700 font-medium group-hover:text-[#e3004f]'
              }`}>
                All Products
              </span>
            </button>

            {STORE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex flex-col items-center min-w-[95px] max-w-[110px] group cursor-pointer bg-transparent border-none p-1 transition-all ${
                    isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full border-2 p-1 bg-gray-50 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[#e3004f] shadow-md bg-red-50' : 'border-gray-200 group-hover:border-[#e3004f]'
                  }`}>
                    <img
                      src={getCategoryImage(cat.slug)}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className={`text-[12px] mt-2 text-center leading-tight line-clamp-2 transition-colors ${
                    isSelected ? 'font-bold text-[#e3004f]' : 'text-gray-700 font-medium group-hover:text-[#e3004f]'
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
      <div className="container mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: SINGER-STYLE FILTER SIDEBAR
             ========================================================================= */}
          <aside className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-4 shadow-xs sticky top-28">
            
            {/* Top Bar: 'Filter' Title + 'CLEAR ALL' */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200">
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">Filter</span>
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold uppercase tracking-wider text-[#e3004f] hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                CLEAR ALL
              </button>
            </div>

            {/* Singer-style Big 'Filter Now' Button */}
            <button
              onClick={handleApplyFilter}
              className="w-full py-2.5 px-4 bg-[#e3004f] hover:bg-[#cc0043] text-white text-[13px] font-bold rounded-md shadow-xs transition-colors cursor-pointer border-none mb-5 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              Filter Now
            </button>

            {/* Accordion 1: Price range (LKR) */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="w-full flex items-center justify-between text-left text-[13px] font-bold text-gray-900 hover:text-[#e3004f] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Price range (LKR)</span>
                {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isPriceOpen && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Min</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#e3004f]"
                      />
                    </div>
                    <span className="text-gray-400 mt-4">-</span>
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Max</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#e3004f]"
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
                    className="w-full accent-[#e3004f] cursor-pointer"
                  />
                  <div className="text-[11px] text-gray-500 flex justify-between font-medium">
                    <span>Rs. {minPrice.toLocaleString()}</span>
                    <span>Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Category Tree matching Singer */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="w-full flex items-center justify-between text-left text-[13px] font-bold text-gray-900 hover:text-[#e3004f] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Categories</span>
                {isCatOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isCatOpen && (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {/* Singer-style Parent Category with Checkbox */}
                  <label
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-start gap-2.5 text-xs text-gray-800 py-1 hover:text-[#e3004f] cursor-pointer font-bold border-b border-gray-100 pb-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === 'all'}
                      onChange={() => {}}
                      className="accent-[#e3004f] mt-0.5 rounded cursor-pointer"
                    />
                    <span>Educational Materials, Books &amp; Stationery</span>
                  </label>

                  {/* Subcategories indented in Singer style */}
                  <div className="pl-4 space-y-1">
                    {STORE_CATEGORIES.map((cat) => (
                      <label
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className="flex items-center gap-2 text-xs text-gray-600 py-1 hover:text-[#e3004f] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory === cat.slug}
                          onChange={() => {}}
                          className="accent-[#e3004f] rounded cursor-pointer"
                        />
                        <span className={selectedCategory === cat.slug ? 'font-bold text-[#e3004f]' : ''}>
                          {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Brands */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                className="w-full flex items-center justify-between text-left text-[13px] font-bold text-gray-900 hover:text-[#e3004f] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Brands</span>
                {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isBrandOpen && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {BRANDS_LIST.map((b) => (
                    <label
                      key={b}
                      onClick={() => toggleBrand(b)}
                      className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#e3004f] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => {}}
                        className="accent-[#e3004f] rounded cursor-pointer"
                      />
                      <span className={selectedBrands.includes(b) ? 'font-bold text-[#e3004f]' : ''}>
                        {b}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 4: Availability */}
            <div>
              <button
                onClick={() => setIsAvailOpen(!isAvailOpen)}
                className="w-full flex items-center justify-between text-left text-[13px] font-bold text-gray-900 hover:text-[#e3004f] cursor-pointer bg-transparent border-none p-0 mb-3"
              >
                <span>Availability</span>
                {isAvailOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isAvailOpen && (
                <label
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-2.5 text-xs text-gray-700 py-1 hover:text-[#e3004f] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => {}}
                    className="accent-[#e3004f] rounded cursor-pointer"
                  />
                  <span className={inStockOnly ? 'font-bold text-[#e3004f]' : ''}>In Stock Only</span>
                </label>
              )}
            </div>

          </aside>

          {/* =========================================================================
              RIGHT COLUMN: SINGER-STYLE PRODUCTS CONTROLS BAR & PRODUCT GRID
             ========================================================================= */}
          <main className="lg:col-span-9">
            
            {/* Top Toolbar matching Singer screenshot */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 mb-5 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-700 shadow-xs">
              
              {/* Left: View selector & Grid/List icons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">View:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded bg-white text-xs font-semibold focus:outline-none focus:border-[#e3004f]"
                  >
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                  </select>
                </div>

                {/* Grid / List Toggles */}
                <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-[#e3004f]' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-[#e3004f]' : 'text-gray-400 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Right: In Stock Toggle + Sort By Selector */}
              <div className="flex items-center gap-6">
                {/* In Stock toggle switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-gray-600 font-medium">In Stock</span>
                  <div
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      inStockOnly ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                        inStockOnly ? 'translate-x-4' : ''
                      }`}
                    />
                  </div>
                </label>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded bg-white text-xs font-semibold focus:outline-none focus:border-[#e3004f]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Product Name</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Count & Active Filters Pills */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                Showing {sortedProducts.length} Products
              </span>

              {selectedBrands.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Active Brands:</span>
                  {selectedBrands.map((b) => (
                    <span
                      key={b}
                      onClick={() => toggleBrand(b)}
                      className="bg-red-50 text-[#e3004f] border border-red-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer hover:bg-red-100"
                    >
                      {b} <span className="text-[10px]">×</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid State */}
            {loading ? (
              <div className="py-24 text-center bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 border-3 border-[#e3004f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-gray-500">Loading products from catalog...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-lg border border-gray-200 px-6">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#e3004f]">
                  <Search size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
                  We couldn't find any products matching your selected filters or price range.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 bg-[#e3004f] text-white text-xs font-bold rounded-md uppercase tracking-wider cursor-pointer border-none"
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
                    />
                  ))}
                </div>

                {/* Singer Pagination Bar */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-5 text-xs text-gray-500">
                  <span>Showing 1 - {sortedProducts.length} of {sortedProducts.length} products</span>
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 border border-gray-300 rounded bg-white font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors">
                      Previous
                    </button>
                    <button className="w-8 h-8 rounded bg-[#e3004f] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded bg-white font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <StoreShell>
      <Suspense fallback={<div className="container py-12 text-center text-sm font-semibold text-gray-500">Loading AZIP Store...</div>}>
        <ProductsContent />
      </Suspense>
    </StoreShell>
  );
}
