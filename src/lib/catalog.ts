export type StoreCategory = {
  slug: string;
  label: string;
  description: string;
};

export interface CatalogProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{ url: string; alt?: string }>;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  specifications?: Record<string, string>;
}

export const STORE_CATEGORIES: StoreCategory[] = [
  { slug: 'books', label: 'Books', description: 'School books, text books, reference books, novels and religious books.' },
  { slug: 'school-books', label: 'School Books', description: 'Grade 1 to A/L, term books, scholarship and revision materials.' },
  { slug: 'exercise-books', label: 'Exercise Books', description: 'CR books, ruled books, blank books, note books and practical books.' },
  { slug: 'writing-instruments', label: 'Writing Instruments', description: 'Pens, pencils, markers, highlighters and correction tools.' },
  { slug: 'mathematical-instruments', label: 'Mathematical Instruments', description: 'Geometry sets, rulers, protractors, calculators and maths tools.' },
  { slug: 'art-craft', label: 'Art & Craft', description: 'Colour pencils, paints, sketch pens, glue, craft papers and modelling tools.' },
  { slug: 'office-supplies', label: 'Office Supplies', description: 'A4/A3 paper, files, folders, staplers, clips and document organisers.' },
  { slug: 'school-accessories', label: 'School Accessories', description: 'Bags, lunch boxes, water bottles, book covers and name tags.' },
  { slug: 'files-organization', label: 'Files & Organization', description: 'Clear files, display books, binders, folders and organizers.' },
  { slug: 'educational-materials', label: 'Educational Materials', description: 'Flash cards, charts, maps, globes and teaching aids.' },
  { slug: 'preschool-kids', label: 'Preschool & Kids', description: 'Colouring books, activity books, alphabet books and kids art supplies.' },
  { slug: 'science-laboratory', label: 'Science & Laboratory', description: 'Science books, practical books, lab materials and educational models.' },
  { slug: 'gifts-accessories', label: 'Gifts & Accessories', description: 'Greeting cards, gift wraps, bookmarks, key tags and decorative stationery.' },
  { slug: 'electronics', label: 'Electronics', description: 'Calculators, USB drives, audio gear and power accessories.' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  STORE_CATEGORIES.map((category) => [category.slug, category.label])
);

export const CATEGORY_IMAGES: Record<string, string> = {
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  'school-books': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  'exercise-books': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  'writing-instruments': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80',
  'mathematical-instruments': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
  'art-craft': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  'office-supplies': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80',
  'school-accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  'files-organization': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'educational-materials': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  'preschool-kids': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
  'science-laboratory': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
  'gifts-accessories': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  electronics: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
};

export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    _id: 'prod-001',
    name: 'Premium A4 Hardcover CR Notebook - 200 Pages',
    slug: 'premium-a4-hardcover-cr-notebook-200-pages',
    description: 'High-grade 80gsm smooth paper CR book with durable hardcover binding. Ruled lines for neat, effortless writing in schools, universities, and offices.',
    category: 'exercise-books',
    subcategory: 'CR Books',
    price: 490,
    compareAtPrice: 600,
    images: [
      { url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', alt: 'A4 CR Notebook' },
      { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80', alt: 'Notebook Paper' }
    ],
    stock: 120,
    sku: 'AZ-CR-001',
    tags: ['cr book', 'a4', 'school', 'ruled', 'notebook'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 48,
    badge: 'Best Seller',
    specifications: {
      'Pages': '200 Pages',
      'Paper Weight': '80 GSM Premium White',
      'Ruling': 'Single Ruled',
      'Cover': 'Matte Laminated Hardcover'
    }
  },
  {
    _id: 'prod-002',
    name: 'Casio FX-991CW ClassWiz Scientific Calculator',
    slug: 'casio-fx-991cw-scientific-calculator',
    description: 'Authentic Casio ClassWiz FX-991CW with 540+ functions, high-resolution natural textbook display, and QR code integration for Sri Lankan O/L, A/L, and University examinations.',
    category: 'electronics',
    subcategory: 'Calculators',
    price: 9800,
    compareAtPrice: 11500,
    images: [
      { url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=900&q=80', alt: 'Scientific Calculator' },
      { url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=80', alt: 'Casio Calculator' }
    ],
    stock: 35,
    sku: 'AZ-EL-991',
    tags: ['calculator', 'casio', 'scientific', 'al exam', 'maths'],
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 82,
    badge: 'Top Pick',
    specifications: {
      'Functions': '540+ Scientific Functions',
      'Display': 'High-Res Natural 4-gradation Display',
      'Power': 'Solar Cell + 1x LR44 Battery',
      'Warranty': '3 Years Authorized Warranty'
    }
  },
  {
    _id: 'prod-003',
    name: 'Pilot G2 Retractable Gel Pen 0.7mm (Pack of 5)',
    slug: 'pilot-g2-gel-pen-pack-of-5',
    description: 'The world-famous smooth writing gel pen with dynamic gel ink formula and comfortable rubberized grip. Longest writing gel pen in the market.',
    category: 'writing-instruments',
    subcategory: 'Pens',
    price: 1350,
    compareAtPrice: 1600,
    images: [
      { url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80', alt: 'Pilot Gel Pens' },
      { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80', alt: 'Pen Tip' }
    ],
    stock: 250,
    sku: 'AZ-PLT-G2',
    tags: ['pilot', 'gel pen', 'pens', 'stationery'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 65,
    badge: 'Popular',
    specifications: {
      'Tip Size': '0.7mm Medium Tip',
      'Colors': '3x Blue, 1x Black, 1x Red',
      'Ink Type': 'Quick-drying Dynamic Gel Ink',
      'Refillable': 'Yes (Pilot G2 Refills)'
    }
  },
  {
    _id: 'prod-004',
    name: 'Oxford English-Sinhala-Tamil Student Dictionary',
    slug: 'oxford-trilingual-student-dictionary',
    description: 'Comprehensive trilingual dictionary for Sri Lankan students containing over 45,000 definitions, pronunciation guides, grammar charts, and real-world example sentences.',
    category: 'books',
    subcategory: 'Dictionaries',
    price: 2850,
    compareAtPrice: 3400,
    images: [
      { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80', alt: 'Dictionary' },
      { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80', alt: 'Open Book' }
    ],
    stock: 45,
    sku: 'AZ-BK-OXF',
    tags: ['dictionary', 'oxford', 'english', 'sinhala', 'tamil'],
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 39,
    specifications: {
      'Pages': '1120 Pages',
      'Cover': 'Flexible Durable Vinyl Cover',
      'Edition': 'Latest Revised Edition',
      'Target Group': 'School & College Students'
    }
  },
  {
    _id: 'prod-005',
    name: 'Faber-Castell 36 Watercolour Eco Pencils Set with Brush',
    slug: 'faber-castell-36-watercolour-pencils-set',
    description: 'Hexagonal coloured pencils with water-soluble lead. Easily converts into brilliant watercolour paintings with just a few wet brush strokes. Break-resistant SV bonding.',
    category: 'art-craft',
    subcategory: 'Colour Pencils',
    price: 2450,
    compareAtPrice: 2950,
    images: [
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', alt: 'Watercolour Pencils' },
      { url: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=900&q=80', alt: 'Art Sketching' }
    ],
    stock: 80,
    sku: 'AZ-FC-36',
    tags: ['faber castell', 'art', 'colour pencils', 'watercolour', 'painting'],
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 54,
    badge: 'Artist Choice',
    specifications: {
      'Pack Contains': '36 Colours + 1 Natural Bristle Brush',
      'Lead': '3.3mm Water-Soluble Pigment',
      'Wood': '100% Certified Sustainable Forestry',
      'Safety': 'Non-toxic, safe for children'
    }
  },
  {
    _id: 'prod-006',
    name: 'Helix Oxford Maths Geometry Precision Box (9-Piece Set)',
    slug: 'helix-oxford-maths-geometry-precision-set',
    description: 'The traditional metal tin mathematical instrument set featuring embossed metal storage tin, precision metal compass, 9cm pencil, ruler, 45 & 60 set squares, 180 protractor, eraser, and sharpener.',
    category: 'mathematical-instruments',
    subcategory: 'Geometry Sets',
    price: 950,
    compareAtPrice: 1200,
    images: [
      { url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80', alt: 'Maths Geometry Set' }
    ],
    stock: 140,
    sku: 'AZ-MAT-HLX',
    tags: ['geometry', 'maths', 'helix oxford', 'compass', 'ruler'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 71,
    badge: 'Essential',
    specifications: {
      'Contents': '9 Essential Mathematical Tools',
      'Case': 'Self-centering Metal Embossed Tin',
      'Material': 'Stainless Steel & Shatter-resistant Acrylic'
    }
  },
  {
    _id: 'prod-007',
    name: 'Ergonomic Waterproof Student Backpack - 32L Navy Blue',
    slug: 'ergonomic-waterproof-student-backpack-navy',
    description: 'Heavy duty multi-pocket school and campus backpack with padded S-curve shoulder straps, breathable back panel, internal 15.6" laptop sleeve, and rainproof Oxford fabric.',
    category: 'school-accessories',
    subcategory: 'Bags',
    price: 3950,
    compareAtPrice: 4800,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', alt: 'Navy Backpack' },
      { url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=900&q=80', alt: 'School Bag' }
    ],
    stock: 45,
    sku: 'AZ-BAG-32L',
    tags: ['backpack', 'school bag', 'laptop bag', 'waterproof'],
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 33,
    badge: 'Hot Deal',
    specifications: {
      'Capacity': '32 Liters',
      'Compartments': '4 Zipped Pockets + 2 Side Water Bottle Pouches',
      'Laptop Sleeve': 'Fits up to 15.6 Inch Laptops / Tablets',
      'Fabric': 'High Density Water-Repellent Nylon'
    }
  },
  {
    _id: 'prod-008',
    name: 'Atlas High Quality A4 Copier Paper (80 GSM / 500 Sheets Box)',
    slug: 'atlas-a4-copier-paper-80gsm-500-sheets',
    description: 'Ultra-white 80gsm premium printing and photocopy paper. Jam-free high-speed laser and inkjet compatibility. Perfect for assignments, office reports, and study notes.',
    category: 'office-supplies',
    subcategory: 'Paper',
    price: 1850,
    compareAtPrice: 2200,
    images: [
      { url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80', alt: 'A4 Copier Paper' }
    ],
    stock: 300,
    sku: 'AZ-PPR-A4',
    tags: ['a4 paper', 'photocopy paper', 'atlas', 'stationery', 'office'],
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 95,
    specifications: {
      'Size': 'A4 (210 x 297 mm)',
      'Grammage': '80 GSM',
      'Sheets': '500 Sheets Ream',
      'Whiteness': '102% CIE High Brightness'
    }
  },
  {
    _id: 'prod-009',
    name: 'SanDisk Ultra Dual Drive Luxe 64GB Type-C & USB 3.1',
    slug: 'sandisk-ultra-dual-drive-luxe-64gb',
    description: 'All-metal 2-in-1 flash drive with reversible USB Type-C and traditional Type-A connector. Seamlessly move files between smartphones, tablets, MacBooks, and PCs.',
    category: 'electronics',
    subcategory: 'Storage',
    price: 2950,
    compareAtPrice: 3600,
    images: [
      { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80', alt: 'SanDisk Dual Drive' }
    ],
    stock: 55,
    sku: 'AZ-SD-64G',
    tags: ['sandisk', 'usb', 'type c', 'flash drive', 'storage'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 42,
    badge: 'Tech Deal',
    specifications: {
      'Capacity': '64 GB',
      'Interface': 'USB 3.1 Gen 1 + USB Type-C',
      'Read Speed': 'Up to 150 MB/s',
      'Casing': 'Cast Metal Swivel Housing'
    }
  },
  {
    _id: 'prod-010',
    name: 'Mont Marte Studio Acrylic Colour Paint Set (18 x 36ml)',
    slug: 'mont-marte-studio-acrylic-paint-set-18-tubes',
    description: 'High quality pigments with smooth buttery consistency, brilliant lightfastness, and fast drying satin finish. Ideal for paper, canvas, wood, and craft projects.',
    category: 'art-craft',
    subcategory: 'Paints',
    price: 3600,
    compareAtPrice: 4400,
    images: [
      { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80', alt: 'Acrylic Paint Set' }
    ],
    stock: 40,
    sku: 'AZ-ART-MM18',
    tags: ['acrylic paints', 'art', 'mont marte', 'canvas', 'painting'],
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 29,
    specifications: {
      'Quantity': '18 Tubes x 36ml',
      'Finish': 'Satin Gloss',
      'Base': 'Water-based, quick dry'
    }
  },
  {
    _id: 'prod-011',
    name: 'Stabilo Boss Original Pastel Highlighters (Set of 6)',
    slug: 'stabilo-boss-pastel-highlighters-set-of-6',
    description: 'Subtle, aesthetic pastel hues for textbook study and bullet journaling. Anti-dry-out technology allows up to 4 hours cap-off time without drying.',
    category: 'writing-instruments',
    subcategory: 'Highlighters',
    price: 1650,
    compareAtPrice: 1950,
    images: [
      { url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=80', alt: 'Pastel Highlighters' }
    ],
    stock: 90,
    sku: 'AZ-STB-PST',
    tags: ['stabilo', 'highlighter', 'pastel', 'study', 'stationery'],
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 68,
    badge: 'Trend',
    specifications: {
      'Colours': '6 Pastel Shades (Milky Yellow, Pastel Pink, Lilac, Mint, Turquoise, Peach)',
      'Line Width': '2.0mm + 5.0mm Chisel Tip',
      'Technology': 'Anti-Dry-Out 4h'
    }
  },
  {
    _id: 'prod-012',
    name: 'Clear Display Book / Portfolio File 40 Pockets (A4)',
    slug: 'clear-display-book-40-pockets-a4',
    description: 'Heavy duty presentation book with 40 clear anti-glare copy-safe transparent pockets. Spine label insert for organized indexing of certificates and projects.',
    category: 'files-organization',
    subcategory: 'Files',
    price: 680,
    compareAtPrice: 850,
    images: [
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', alt: 'Display File' }
    ],
    stock: 160,
    sku: 'AZ-FIL-40P',
    tags: ['file', 'display book', 'folder', 'certificates', 'office'],
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 22,
    specifications: {
      'Pockets': '40 Bound Top-Loading Pockets',
      'Capacity': '80 A4 Sheets (Back-to-Back)',
      'Material': 'Acid-Free Archival Safe Polypropylene'
    }
  }
];

export function getCategoryLabel(slug?: string | null): string {
  if (!slug || slug === 'all') return 'All Products';
  return CATEGORY_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCategoryImage(slug?: string | null): string {
  if (!slug) return CATEGORY_IMAGES.books;
  return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES.books;
}
