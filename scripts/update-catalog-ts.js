const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/lib/catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf-8');

// Find start of INITIAL_CATALOG_PRODUCTS
const startMarker = 'export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = [';
const endMarker = 'export function getCategoryLabel';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found in catalog.ts');
  process.exit(1);
}

// Add import at top if not present
if (!content.includes("from './expanded-products'")) {
  content = "import { ALL_EXPANDED_PRODUCTS } from './expanded-products';\n" + content;
}

// Re-find indices after import addition
const newStartIndex = content.indexOf(startMarker);
const newEndIndex = content.indexOf(endMarker);

const replacement = 'export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = ALL_EXPANDED_PRODUCTS as CatalogProduct[];\n\n';

const newContent = content.substring(0, newStartIndex) + replacement + content.substring(newEndIndex);

fs.writeFileSync(catalogPath, newContent, 'utf-8');
console.log('Successfully updated catalog.ts to use ALL_EXPANDED_PRODUCTS!');
