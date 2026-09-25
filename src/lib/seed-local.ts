import { saveLocalProducts } from './local-db';
import { INITIAL_CATALOG_PRODUCTS } from './catalog';

saveLocalProducts(INITIAL_CATALOG_PRODUCTS);
console.log('Successfully saved ' + INITIAL_CATALOG_PRODUCTS.length + ' products to data/products.json');
