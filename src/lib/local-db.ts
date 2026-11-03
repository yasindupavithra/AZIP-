import fs from 'fs';
import path from 'path';
import { CatalogProduct, INITIAL_CATALOG_PRODUCTS } from './catalog';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// High-speed In-Memory Cache
let memoryProductsCache: CatalogProduct[] | null = null;
let memoryOrdersCache: LocalOrder[] | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get all products from local JSON store with instant in-memory caching
export function getLocalProducts(): CatalogProduct[] {
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache;
  }

  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    saveLocalProducts(INITIAL_CATALOG_PRODUCTS);
    memoryProductsCache = INITIAL_CATALOG_PRODUCTS;
    return INITIAL_CATALOG_PRODUCTS;
  }

  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(raw);
    const valid = Array.isArray(products) && products.length > 0 ? products : INITIAL_CATALOG_PRODUCTS;
    memoryProductsCache = valid;
    return valid;
  } catch (err) {
    console.error('Failed reading local products JSON:', err);
    memoryProductsCache = INITIAL_CATALOG_PRODUCTS;
    return INITIAL_CATALOG_PRODUCTS;
  }
}

// Save products to local JSON store and update in-memory cache
export function saveLocalProducts(products: CatalogProduct[]): void {
  ensureDataDir();
  memoryProductsCache = products; // Update cache
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local products JSON:', err);
  }
}

// Add product to local store
export function addLocalProduct(productData: Partial<CatalogProduct>): CatalogProduct {
  const products = getLocalProducts();
  const newId = 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  const slug = (productData.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

  const newProduct: CatalogProduct = {
    _id: newId,
    name: productData.name || 'Untitled Product',
    slug,
    description: productData.description || '',
    category: productData.category || 'books',
    subcategory: productData.subcategory || '',
    price: Number(productData.price) || 0,
    compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
    images: productData.images && productData.images.length > 0
      ? productData.images
      : [{ url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', alt: productData.name }],
    stock: Number(productData.stock) || 10,
    sku: productData.sku || `AZ-${Math.floor(1000 + Math.random() * 9000)}`,
    tags: Array.isArray(productData.tags) ? productData.tags : (productData.tags ? String(productData.tags).split(',').map(t => t.trim()) : []),
    isFeatured: Boolean(productData.isFeatured),
    brand: productData.brand || 'AZIP GENUINE',
    grade: productData.grade || '',
    language: productData.language || '',
    rulingType: productData.rulingType || '',
    variants: productData.variants || [],
    specifications: productData.specifications || {},
    rating: 5.0,
    reviewsCount: 1,
    badge: productData.badge || 'New'
  };

  products.unshift(newProduct);
  saveLocalProducts(products);
  return newProduct;
}

// Update product in local store
export function updateLocalProduct(id: string, updateData: Partial<CatalogProduct>): CatalogProduct | null {
  const products = getLocalProducts();
  const index = products.findIndex(p => p._id === id || p.slug === id);
  if (index === -1) return null;

  const existing = products[index];
  const updated: CatalogProduct = {
    ...existing,
    ...updateData,
    price: updateData.price !== undefined ? Number(updateData.price) : existing.price,
    compareAtPrice: updateData.compareAtPrice !== undefined ? Number(updateData.compareAtPrice) : existing.compareAtPrice,
    stock: updateData.stock !== undefined ? Number(updateData.stock) : existing.stock,
    isFeatured: updateData.isFeatured !== undefined ? Boolean(updateData.isFeatured) : existing.isFeatured,
  };

  products[index] = updated;
  saveLocalProducts(products);
  return updated;
}

// Delete product from local store
export function deleteLocalProduct(id: string): boolean {
  const products = getLocalProducts();
  const filtered = products.filter(p => p._id !== id && p.slug !== id);
  if (filtered.length === products.length) return false;
  saveLocalProducts(filtered);
  return true;
}

// Local orders interface
export interface LocalOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: { street: string; city: string };
  };
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export function getLocalOrders(): LocalOrder[] {
  if (memoryOrdersCache) return memoryOrdersCache;

  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) || [];
    memoryOrdersCache = parsed;
    return parsed;
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: LocalOrder[]): void {
  ensureDataDir();
  memoryOrdersCache = orders;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export function addLocalOrder(orderData: Partial<LocalOrder>): LocalOrder {
  const orders = getLocalOrders();
  const newOrder: LocalOrder = {
    _id: 'ord-' + Date.now().toString(36),
    orderNumber: 'AZ-' + Math.floor(100000 + Math.random() * 900000),
    customer: orderData.customer || { name: 'Customer', phone: '' },
    items: orderData.items || [],
    total: Number(orderData.total) || 0,
    status: orderData.status || 'pending',
    paymentMethod: orderData.paymentMethod || 'cod',
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveLocalOrders(orders);
  return newOrder;
}

export function updateLocalOrderStatus(id: string, status: string): LocalOrder | null {
  const orders = getLocalOrders();
  const order = orders.find(o => o._id === id || o.orderNumber === id);
  if (!order) return null;
  order.status = status;
  saveLocalOrders(orders);
  return order;
}

// ── Local Hero Banners Storage ─────────────────────────────
const BANNERS_FILE = path.join(DATA_DIR, 'banners.json');
let memoryBannersCache: LocalBanner[] | null = null;

export interface LocalBanner {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountText?: string;
  ctaText?: string;
  bgTheme?: string;
  displayMode?: 'daraz-stage' | 'full-image';
  bgColor?: string;
  showOverlay?: boolean;
  image: string;
  secondaryImages?: string[];
  linkUrl: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export const INITIAL_HERO_BANNERS: LocalBanner[] = [
  {
    _id: 'banner-1',
    title: 'AZIP.lk Mega Student Fest',
    subtitle: 'For Students Who Dream',
    badge: 'MEGA STUDENT FEST',
    discountText: '65%',
    ctaText: 'Shop Now',
    bgTheme: 'teal',
    displayMode: 'full-image',
    bgColor: '#6ED7E5',
    showOverlay: true,
    image: '/images/banners/azip-mega-student-fest.jpg',
    secondaryImages: [],
    linkUrl: '/offers',
    isActive: true,
    order: 1,
    startDate: '',
    endDate: '',
  },
  {
    _id: 'banner-2',
    title: '11.11 TECH ZONE',
    subtitle: 'Real Deals on Casio Calculators & Study Gear',
    badge: '11.11 SHOPPING FEST',
    discountText: '50%',
    ctaText: 'Add to Cart',
    bgTheme: 'blue',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/casio-fx991cw.jpg',
    secondaryImages: [
      '/images/hd/products/geometry-set.jpg',
      '/images/hd/products/pilot-g2-pens.jpg',
    ],
    linkUrl: '/products?category=mathematical-instruments',
    isActive: true,
    order: 2,
    startDate: '',
    endDate: '',
  },
  {
    _id: 'banner-3',
    title: 'STATIONERY FIESTA',
    subtitle: 'Write More. Spend Less on Genuine Brands.',
    badge: '11.11 SHOPPING FEST',
    discountText: '65%',
    ctaText: 'Add to Cart',
    bgTheme: 'red',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/faber-castell-water-color.jpg',
    secondaryImages: [
      '/images/hd/products/highlighters-set.jpg',
      '/images/hd/products/drawing-kit.jpg',
    ],
    linkUrl: '/products?category=art-craft',
    isActive: true,
    order: 3,
    startDate: '',
    endDate: '',
  },
  {
    _id: 'banner-4',
    title: 'BOOKS & LIFESTYLE',
    subtitle: 'Student Saver Deals on CR Books & Lunch Boxes',
    badge: '11.11 SHOPPING FEST',
    discountText: '45%',
    ctaText: 'Shop Now',
    bgTheme: 'teal',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/atlas-exercise-book.jpg',
    secondaryImages: [
      '/images/hd/products/lunch-box.jpg',
      '/images/hd/products/sticky-notes.jpg',
    ],
    linkUrl: '/products?category=exercise-books',
    isActive: true,
    order: 4,
    startDate: '',
    endDate: '',
  },
];

export function getLocalBanners(): LocalBanner[] {
  if (memoryBannersCache && memoryBannersCache.length > 0) return memoryBannersCache;

  ensureDataDir();
  if (!fs.existsSync(BANNERS_FILE)) {
    saveLocalBanners(INITIAL_HERO_BANNERS);
    memoryBannersCache = INITIAL_HERO_BANNERS;
    return INITIAL_HERO_BANNERS;
  }
  try {
    const raw = fs.readFileSync(BANNERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const valid = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_HERO_BANNERS;
    memoryBannersCache = valid;
    return valid;
  } catch {
    memoryBannersCache = INITIAL_HERO_BANNERS;
    return INITIAL_HERO_BANNERS;
  }
}

export function saveLocalBanners(banners: LocalBanner[]): void {
  ensureDataDir();
  memoryBannersCache = banners;
  try {
    fs.writeFileSync(BANNERS_FILE, JSON.stringify(banners, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local banners JSON:', err);
  }
}

export function addLocalBanner(data: Partial<LocalBanner>): LocalBanner {
  const banners = getLocalBanners();
  const newBanner: LocalBanner = {
    _id: 'banner-' + Date.now().toString(36),
    title: data.title || 'HOT DEALS',
    subtitle: data.subtitle || 'Too Hot to Last. Best Prices.',
    badge: data.badge || '11.11 SHOPPING FEST',
    discountText: data.discountText || '65%',
    ctaText: data.ctaText || 'Add to Cart',
    bgTheme: data.bgTheme || 'orange',
    displayMode: data.displayMode || 'daraz-stage',
    image: data.image || '/images/hd/products/school-backpack-blue.jpg',
    secondaryImages: data.secondaryImages || [],
    linkUrl: data.linkUrl || '/products',
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    order: Number(data.order) || banners.length + 1,
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    createdAt: new Date().toISOString(),
  };
  banners.push(newBanner);
  banners.sort((a, b) => (a.order || 99) - (b.order || 99));
  saveLocalBanners(banners);
  return newBanner;
}

export function updateLocalBanner(id: string, data: Partial<LocalBanner>): LocalBanner | null {
  const banners = getLocalBanners();
  const index = banners.findIndex(b => b._id === id);
  if (index === -1) return null;

  const updated: LocalBanner = {
    ...banners[index],
    ...data,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : banners[index].isActive,
  };
  banners[index] = updated;
  saveLocalBanners(banners);
  return updated;
}

export function deleteLocalBanner(id: string): boolean {
  const banners = getLocalBanners();
  const filtered = banners.filter(b => b._id !== id);
  if (filtered.length === banners.length) return false;
  saveLocalBanners(filtered);
  return true;
}

// ── Booklist Inquiries Store ──────────────────────────────────
export interface LocalBooklist {
  _id: string;
  studentName: string;
  grade: string;
  schoolName: string;
  parentPhone: string;
  city: string;
  notes: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

const BOOKLISTS_FILE = path.join(DATA_DIR, 'booklists.json');
let memoryBooklistsCache: LocalBooklist[] | null = null;

export function getLocalBooklists(): LocalBooklist[] {
  if (memoryBooklistsCache && memoryBooklistsCache.length > 0) {
    return memoryBooklistsCache;
  }
  ensureDataDir();
  if (!fs.existsSync(BOOKLISTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(BOOKLISTS_FILE, 'utf-8');
    const lists = JSON.parse(raw);
    const valid = Array.isArray(lists) ? lists : [];
    memoryBooklistsCache = valid;
    return valid;
  } catch (err) {
    console.error('Failed reading local booklists JSON:', err);
    return [];
  }
}

export function saveLocalBooklists(lists: LocalBooklist[]): void {
  ensureDataDir();
  memoryBooklistsCache = lists;
  try {
    fs.writeFileSync(BOOKLISTS_FILE, JSON.stringify(lists, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local booklists JSON:', err);
  }
}

export function addLocalBooklist(data: Omit<LocalBooklist, '_id' | 'createdAt'>): LocalBooklist {
  const lists = getLocalBooklists();
  const newItem: LocalBooklist = {
    _id: 'bl-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    ...data,
    createdAt: new Date().toISOString(),
  };
  lists.unshift(newItem);
  saveLocalBooklists(lists);
  return newItem;
}


