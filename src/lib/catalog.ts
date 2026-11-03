import { ALL_EXPANDED_PRODUCTS } from './expanded-products';
export type StoreCategory = {
  slug: string;
  label: string;
  description: string;
  iconName?: string;
};

export interface ProductVariant {
  name: string; // e.g. "Page Count" or "Ink Color"
  options: string[]; // e.g. ["80 Pages", "120 Pages", "200 Pages"]
}

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
  brand?: string;
  grade?: string; // e.g. "Grade 1-5", "Grade 6-9", "Grade 10-11 (O/L)", "Grade 12-13 (A/L)"
  language?: string; // e.g. "Sinhala", "English", "Tamil"
  rulingType?: string; // e.g. "Single Ruled", "Square Grid", "Blank / Plain", "CR Hardcover", "Practical"
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface MegaCategorySubItem {
  label: string;
  href: string;
  badge?: string;
}

export interface MegaCategoryColumn {
  title: string;
  items: MegaCategorySubItem[];
}

export interface MegaCategoryPillar {
  id: string;
  title: string;
  slug: string;
  iconName: string;
  description: string;
  columns: MegaCategoryColumn[];
  featuredImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
}

export const MEGA_MENU_TREE: MegaCategoryPillar[] = [
  {
    id: 'school-education',
    title: 'School Education',
    slug: 'school-books',
    iconName: 'GraduationCap',
    description: 'Grade-wise textbooks, revision guides, term papers & scholarship packs.',
    columns: [
      {
        title: 'By Grade / Level',
        items: [
          { label: 'Grade 1 - 5 (Primary)', href: '/products?category=school-books&grade=Grade+1-5' },
          { label: 'Grade 6 - 9 (Junior Secondary)', href: '/products?category=school-books&grade=Grade+6-9' },
          { label: 'Grade 10 - 11 (O/L Exam)', href: '/products?category=school-books&grade=Grade+10-11+(O%2FL)', badge: 'Hot' },
          { label: 'Grade 12 - 13 (A/L Science & Maths)', href: '/products?category=school-books&grade=Grade+12-13+(A%2FL)' },
          { label: 'Grade 12 - 13 (A/L Commerce & Arts)', href: '/products?category=school-books&grade=Grade+12-13+(A%2FL)' },
        ]
      },
      {
        title: 'Exams & Revision',
        items: [
          { label: 'Grade 5 Scholarship Packs', href: '/products?category=school-books&search=scholarship', badge: 'Top Seller' },
          { label: 'O/L Past Papers & Model Papers', href: '/products?category=school-books&search=past+papers' },
          { label: 'A/L Resource Books & Revision', href: '/products?category=school-books&search=revision' },
          { label: 'Term Test Question Papers', href: '/products?category=school-books&search=term+papers' },
        ]
      },
      {
        title: 'Medium of Study',
        items: [
          { label: 'Sinhala Medium Textbooks', href: '/products?category=school-books&language=Sinhala' },
          { label: 'English Medium Textbooks', href: '/products?category=school-books&language=English' },
          { label: 'Tamil Medium Textbooks', href: '/products?category=school-books&language=Tamil' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'School Booklist Direct Upload',
    featuredSubtitle: 'Upload your syllabus booklist and get instant home delivery!'
  },
  {
    id: 'exercise-notebooks',
    title: 'Exercise & Note Books',
    slug: 'exercise-books',
    iconName: 'BookOpen',
    description: 'CR, single ruled, square grid, blank, practical and spiral notebooks.',
    columns: [
      {
        title: 'CR Hardcover Books',
        items: [
          { label: 'CR 80 Pages Single Ruled', href: '/products?category=exercise-books&ruling=CR+Hardcover&search=80' },
          { label: 'CR 120 Pages Single Ruled', href: '/products?category=exercise-books&ruling=CR+Hardcover&search=120' },
          { label: 'CR 160 Pages Single Ruled', href: '/products?category=exercise-books&ruling=CR+Hardcover&search=160' },
          { label: 'CR 200 Pages Single Ruled', href: '/products?category=exercise-books&ruling=CR+Hardcover&search=200', badge: 'Popular' },
          { label: 'CR 400 Pages Heavy Duty', href: '/products?category=exercise-books&ruling=CR+Hardcover&search=400' },
        ]
      },
      {
        title: 'Standard Exercise Books',
        items: [
          { label: 'Single Ruled Exercise Books', href: '/products?category=exercise-books&ruling=Single+Ruled' },
          { label: 'Square Grid (Maths / Primary)', href: '/products?category=exercise-books&ruling=Square+Grid' },
          { label: 'Blank / Plain Drawing Books', href: '/products?category=exercise-books&ruling=Blank+%2F+Plain' },
          { label: 'Science Practical Lab Books', href: '/products?category=exercise-books&ruling=Practical' },
          { label: 'Spiral Note Books & Wirebound', href: '/products?category=exercise-books&search=spiral' },
        ]
      },
      {
        title: 'Popular Brands',
        items: [
          { label: 'Atlas CR & Exercise Books', href: '/products?category=exercise-books&search=atlas' },
          { label: 'Mango & Zebra Notebooks', href: '/products?category=exercise-books&search=mango' },
          { label: 'Oxford Premium Binders', href: '/products?category=exercise-books&search=oxford' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Atlas & Premium Notebooks',
    featuredSubtitle: '80gsm high-whiteness smooth paper for effortless handwriting.'
  },
  {
    id: 'general-books',
    title: 'General Books',
    slug: 'books',
    iconName: 'Book',
    description: 'Novels, storybooks, dictionaries, Sinhala/English/Tamil literature.',
    columns: [
      {
        title: 'Fiction & Novels',
        items: [
          { label: 'Sinhala Novels & Classics', href: '/products?category=books&language=Sinhala' },
          { label: 'English Fiction & Bestsellers', href: '/products?category=books&language=English' },
          { label: 'Tamil Literature & Poems', href: '/products?category=books&language=Tamil' },
          { label: 'Youth & Teen Fiction', href: '/products?category=books&search=teen' },
        ]
      },
      {
        title: 'Dictionaries & Reference',
        items: [
          { label: 'Oxford Trilingual Dictionaries', href: '/products?category=books&search=oxford', badge: 'Essential' },
          { label: 'Sinhala-English Dictionaries', href: '/products?category=books&search=dictionary' },
          { label: 'Grammar & Spoken English', href: '/products?category=books&search=grammar' },
          { label: 'General Knowledge & Encyclopedias', href: '/products?category=books&search=knowledge' },
        ]
      },
      {
        title: 'Children & Preschool',
        items: [
          { label: 'Alphabet & Counting Books', href: '/products?category=books&search=preschool' },
          { label: 'Coloring & Activity Storybooks', href: '/products?category=books&search=coloring' },
          { label: 'Bedtime Fairytales & Fables', href: '/products?category=books&search=story' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Oxford & Literature Corner',
    featuredSubtitle: 'Explore over 5,000 titles in Sinhala, English & Tamil.'
  },
  {
    id: 'writing-instruments',
    title: 'Writing & Math Instruments',
    slug: 'writing-instruments',
    iconName: 'PenTool',
    description: 'Pens, pencils, geometry sets, protractors and scientific calculators.',
    columns: [
      {
        title: 'Pens & Markers',
        items: [
          { label: 'Pilot G2 & Gel Pens', href: '/products?category=writing-instruments&search=pilot', badge: 'Top Brand' },
          { label: 'Atlas Fine Ballpoint Pens', href: '/products?category=writing-instruments&search=atlas' },
          { label: 'Stabilo Pastel Highlighters', href: '/products?category=writing-instruments&search=stabilo' },
          { label: 'Whiteboard & Permanent Markers', href: '/products?category=writing-instruments&search=marker' },
          { label: 'Correction Tapes & Liquid Refills', href: '/products?category=writing-instruments&search=correction' },
        ]
      },
      {
        title: 'Mathematical Instruments',
        items: [
          { label: 'Casio ClassWiz FX-991CW Calculator', href: '/products?category=electronics&search=casio', badge: 'Approved' },
          { label: 'Helix Oxford Geometry Box (9-Pc)', href: '/products?category=mathematical-instruments&search=helix' },
          { label: 'Steel Rulers & Protractors', href: '/products?category=mathematical-instruments&search=ruler' },
          { label: 'Precision Metal Compasses', href: '/products?category=mathematical-instruments&search=compass' },
        ]
      },
      {
        title: 'Pencils & Drawing',
        items: [
          { label: '2B Exam Pencils & Mechanical Pencils', href: '/products?category=writing-instruments&search=pencil' },
          { label: 'Dust-Free Erasers & Metal Sharpeners', href: '/products?category=writing-instruments&search=eraser' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Casio & Pilot Genuine Store',
    featuredSubtitle: 'Authorized Sri Lankan distributor warranty & genuine guarantee.'
  },
  {
    id: 'art-craft-office',
    title: 'Art, Craft & Office Supplies',
    slug: 'art-craft',
    iconName: 'Palette',
    description: 'Paints, brushes, papers, display files, and office desk supplies.',
    columns: [
      {
        title: 'Art & Fine Craft',
        items: [
          { label: 'Faber-Castell Watercolour Pencils', href: '/products?category=art-craft&search=faber', badge: 'Top Pick' },
          { label: 'Mont Marte Acrylic & Poster Paints', href: '/products?category=art-craft&search=paint' },
          { label: 'Artist Brushes & Canvas Boards', href: '/products?category=art-craft&search=brush' },
          { label: 'A3 & A4 Drawing Pads', href: '/products?category=art-craft&search=pad' },
          { label: 'Glues, Glue Guns & Craft Scissors', href: '/products?category=art-craft&search=glue' },
        ]
      },
      {
        title: 'Office & Filing Systems',
        items: [
          { label: 'Atlas A4 Copier Paper (80 GSM)', href: '/products?category=office-supplies&search=paper' },
          { label: 'Clear Display Files (40/60 Pockets)', href: '/products?category=files-organization' },
          { label: 'Box Files & Document Binders', href: '/products?category=files-organization&search=binder' },
          { label: 'Heavy Duty Staplers & Punchers', href: '/products?category=office-supplies&search=stapler' },
        ]
      },
      {
        title: 'School Accessories',
        items: [
          { label: 'Waterproof Ergonomic Backpacks', href: '/products?category=school-accessories&search=backpack' },
          { label: 'Stainless Steel Water Bottles', href: '/products?category=school-accessories&search=bottle' },
          { label: 'BPA-Free School Lunch Boxes', href: '/products?category=school-accessories&search=lunch' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Faber-Castell & Mont Marte',
    featuredSubtitle: 'Vibrant artist pigments, craft papers & premium office tools.'
  }
];

export const GRADES_LIST = [
  'Grade 1-5',
  'Grade 6-9',
  'Grade 10-11 (O/L)',
  'Grade 12-13 (A/L)'
];

export const LANGUAGES_LIST = [
  'Sinhala',
  'English',
  'Tamil'
];

export const RULING_TYPES_LIST = [
  'Single Ruled',
  'Square Grid',
  'Blank / Plain',
  'CR Hardcover',
  'Practical'
];

export const BRANDS_LIST = [
  'Atlas',
  'Richard',
  'Promate',
  'Rathna',
  'Sarasavi Publishers',
  'MD Gunasena',
  'Master Guide',
  'Susara Publishers',
  'Samudra Book Publishers',
  'NIE Sri Lanka',
  'DSI Samson',
  'Casio',
  'Pilot',
  'Faber-Castell',
  'Stabilo',
  'Nataraj',
  'Maped',
  'Double A',
  'Kangaroo',
  'SanDisk',
  'Logitech',
  'Parker',
  'Orange Electric'
];

export interface SchoolBundleKit {
  id: string;
  name: string;
  gradeBadge: string;
  price: number;
  originalPrice: number;
  savingsPercentage: number;
  image: string;
  description: string;
  itemsIncluded: string[];
}

export const BACK_TO_SCHOOL_BUNDLES: SchoolBundleKit[] = [
  {
    id: 'bundle-g6-9',
    name: 'Grade 6 - 9 Complete Back-to-School Master Pack',
    gradeBadge: 'Grade 6-9 Essential',
    price: 6450,
    originalPrice: 7900,
    savingsPercentage: 18,
    image: '/images/hd/products/atlas-exercise-book.jpg',
    description: 'Complete all-in-one stationery set for junior secondary students containing CR books, Pilot gel pens, geometry kit, and drawing supplies.',
    itemsIncluded: [
      '4x Atlas A4 CR Hardcover 200-Page Single Ruled Books',
      '2x Atlas Square Grid Maths Exercise Books (80p)',
      '1x Helix Oxford 9-Piece Metal Geometry Precision Set',
      '1x Pack of 5 Pilot G2 Gel Pens (0.7mm Medium)',
      '1x Faber-Castell 12 Watercolour Eco Pencils Set',
      '1x Clear A4 Display File (20 Pockets)'
    ]
  },
  {
    id: 'bundle-al-science',
    name: 'A/L Science & Maths Exam Success Kit',
    gradeBadge: 'Grade 12-13 A/L',
    price: 13950,
    originalPrice: 16500,
    savingsPercentage: 15,
    image: '/images/hd/products/casio-fx991cw.jpg',
    description: 'Specially assembled kit for Advanced Level Physical & Biological Science students. Includes Casio scientific calculator and heavy duty CR books.',
    itemsIncluded: [
      '1x Casio FX-991CW ClassWiz Scientific Calculator (3-Year Warranty)',
      '6x Atlas A4 Hardcover CR Notebooks (200-Page Single Ruled)',
      '2x Science Practical Lab Books with Grid Graph Sheets',
      '1x Pack of 6 Stabilo Boss Pastel Highlighters',
      '1x SanDisk 64GB Type-C / USB Dual Flash Drive'
    ]
  },
  {
    id: 'bundle-primary-art',
    name: 'Primary Student Creative Art & Craft Bundle',
    gradeBadge: 'Grade 1-5 Primary',
    price: 3450,
    originalPrice: 4200,
    savingsPercentage: 18,
    image: '/images/hd/products/faber-castell-water-color.jpg',
    description: 'Fun, safe, non-toxic art and craft essentials to spark creativity for primary school students in Grades 1 to 5.',
    itemsIncluded: [
      '1x Faber-Castell 24 Watercolour Eco Pencils with Brush',
      '1x Mont Marte Poster Paint Set (12 Vibrant Colours)',
      '2x A4 Blank Drawing & Sketching Pad (50 Sheets)',
      '1x Children Safety Scissors & Non-toxic Glue Stick',
      '1x Nataraj 2B Exam Pencils Box (10 Pencils + Eraser)'
    ]
  }
];

export const STORE_CATEGORIES: StoreCategory[] = [
  { slug: 'books', label: 'General Books', description: 'School books, text books, reference books, novels and religious books.', iconName: 'Book' },
  { slug: 'school-books', label: 'School Books', description: 'Grade 1 to A/L, term books, scholarship and revision materials.', iconName: 'GraduationCap' },
  { slug: 'exercise-books', label: 'Exercise Books', description: 'CR books, ruled books, blank books, note books and practical books.', iconName: 'BookOpen' },
  { slug: 'writing-instruments', label: 'Writing Instruments', description: 'Pens, pencils, markers, highlighters and correction tools.', iconName: 'PenTool' },
  { slug: 'mathematical-instruments', label: 'Mathematical Instruments', description: 'Geometry sets, rulers, protractors, calculators and maths tools.', iconName: 'Calculator' },
  { slug: 'art-craft', label: 'Art & Craft', description: 'Colour pencils, paints, sketch pens, glue, craft papers and modelling tools.', iconName: 'Palette' },
  { slug: 'office-supplies', label: 'Office Supplies', description: 'A4/A3 paper, files, folders, staplers, clips and document organisers.', iconName: 'Briefcase' },
  { slug: 'school-accessories', label: 'School Accessories', description: 'Bags, lunch boxes, water bottles, book covers and name tags.', iconName: 'Backpack' },
  { slug: 'files-organization', label: 'Files & Organization', description: 'Clear files, display books, binders, folders and organizers.', iconName: 'FolderArchive' },
  { slug: 'educational-materials', label: 'Educational Materials', description: 'Flash cards, charts, maps, globes and teaching aids.', iconName: 'Sparkles' },
  { slug: 'preschool-kids', label: 'Preschool & Kids', description: 'Colouring books, activity books, alphabet books and kids art supplies.', iconName: 'Smile' },
  { slug: 'science-laboratory', label: 'Science & Laboratory', description: 'Science books, practical books, lab materials and educational models.', iconName: 'FlaskConical' },
  { slug: 'gifts-accessories', label: 'Gifts & Accessories', description: 'Greeting cards, gift wraps, bookmarks, key tags and decorative stationery.', iconName: 'Gift' },
  { slug: 'electronics', label: 'Electronics', description: 'Calculators, USB drives, audio gear and power accessories.', iconName: 'Cpu' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  STORE_CATEGORIES.map((category) => [category.slug, category.label])
);

export const CATEGORY_IMAGES: Record<string, string> = {
  books: '/images/hd/products/sl-dictionary-novels.jpg',
  'school-books': '/images/hd/products/sl-textbooks-stack.jpg',
  'exercise-books': '/images/hd/products/atlas-exercise-book.jpg',
  'writing-instruments': '/images/hd/products/sl-writing-pens-pencils.jpg',
  'mathematical-instruments': '/images/hd/products/geometry-set.jpg',
  'art-craft': '/images/hd/products/sl-art-pencils-paints.jpg',
  'office-supplies': '/images/hd/products/sl-office-paper-stapler.jpg',
  'school-accessories': '/images/hd/products/school-backpack-blue.jpg',
  'files-organization': '/images/hd/products/sl-files-binders.jpg',
  'educational-materials': '/products/globe.jpg',
  'preschool-kids': '/images/hd/products/sl-preschool-crayons-clay.jpg',
  'science-laboratory': '/products/microscope.jpg',
  'gifts-accessories': '/images/hd/products/sl-executive-gift-pen.jpg',
  electronics: '/images/hd/products/sl-electronics-study.jpg',
};

export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = ALL_EXPANDED_PRODUCTS as CatalogProduct[];

export function getCategoryLabel(slug?: string | null): string {
  if (!slug || slug === 'all') return 'All Products';
  return CATEGORY_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCategoryImage(slug?: string | null): string {
  if (!slug) return CATEGORY_IMAGES.books;
  return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES.books;
}

/**
 * Resilient product resolver: matches by exact _id / slug / sku, normalized prefix,
 * or keyword token overlap so no product link ever fails with "Product Not Found".
 */
export function resolveProductBySlugOrId(
  rawKey?: string | null,
  list: CatalogProduct[] = INITIAL_CATALOG_PRODUCTS
): CatalogProduct | null {
  const pool = list && list.length > 0 ? list : INITIAL_CATALOG_PRODUCTS;
  if (!pool.length) return null;
  if (!rawKey) return pool[0];

  let decoded = rawKey;
  try {
    decoded = decodeURIComponent(rawKey);
  } catch {
    decoded = rawKey;
  }
  const key = decoded.trim().toLowerCase();

  // 1. Exact match on _id, slug, or sku
  const exact = pool.find(
    (p) =>
      p._id?.toLowerCase() === key ||
      p.slug?.toLowerCase() === key ||
      p.sku?.toLowerCase() === key
  );
  if (exact) return exact;

  // 2. Base slug match (ignoring trailing -01..-99 numbering)
  const stripNum = (s: string) => s.replace(/-\d+$/, '');
  const baseKey = stripNum(key);
  const byBase = pool.find((p) => {
    const pBase = stripNum((p.slug || '').toLowerCase());
    return (
      pBase === baseKey ||
      pBase.startsWith(baseKey) ||
      baseKey.startsWith(pBase) ||
      pBase.includes(baseKey) ||
      baseKey.includes(pBase)
    );
  });
  if (byBase) return byBase;

  // 3. Keyword token overlap scoring
  const stopWords = new Set(['the', 'and', 'for', 'with', 'pack', 'set', 'of', 'in', 'to', 'a', 'an']);
  const tokens = baseKey
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !stopWords.has(t));

  if (tokens.length > 0) {
    let bestProduct: CatalogProduct | null = null;
    let bestScore = 0;

    for (const p of pool) {
      const haystack = `${p.slug} ${p.name} ${p.brand || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (haystack.includes(tok)) {
          score += tok.length >= 4 ? 3 : 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestProduct = p;
      }
    }

    if (bestProduct && bestScore > 0) {
      return bestProduct;
    }
  }

  // 4. Guaranteed fallback so Product Detail Page never shows a broken 404 screen
  return pool[0];
}
