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
