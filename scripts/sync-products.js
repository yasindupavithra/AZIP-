const fs = require('fs');
const path = require('path');

// Read the expanded products
const expandedFile = fs.readFileSync(path.join(__dirname, '../src/lib/expanded-products.ts'), 'utf-8');

// Use node to eval and export the products
const productsJsonMatch = expandedFile.match(/export const ALL_EXPANDED_PRODUCTS = (\[[\s\S]*?\]);\s*$/);

if (!productsJsonMatch) {
  console.error('Could not parse expanded products');
  process.exit(1);
}

// Convert typescript-like array to valid JSON object
const products = eval(productsJsonMatch[1]);

console.log('Total products loaded:', products.length);

// Check count per category
const counts = {};
products.forEach((p) => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Category breakdown:', counts);

// Write to data/products.json
const dataPath = path.join(__dirname, '../data/products.json');
fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8');
console.log('Successfully wrote to data/products.json');
