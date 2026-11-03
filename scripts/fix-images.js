const fs = require('fs');

// 1. Update data/products.json
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
for (const p of products) {
  if (p._id === 'prod-wr-04') {
    p.images = [{ url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=900&q=80', alt: p.name }];
  } else if (p._id === 'prod-mt-06') {
    p.images = [{ url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=900&q=80', alt: p.name }];
  } else if (p._id === 'prod-gf-05') {
    p.images = [{ url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80', alt: p.name }];
  }
}
fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2), 'utf8');

// 2. Update src/lib/expanded-products.ts
let exp = fs.readFileSync('src/lib/expanded-products.ts', 'utf8');
exp = exp.replace(
  'https://images.unsplash.com/photo-1584447141569-19f4804eb586?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=900&q=80'
);
exp = exp.replace(
  `url: 'https://images.unsplash.com/photo-1585336261026-77884a44b8f5?auto=format&fit=crop&w=900&q=80', alt: 'Stabilo Boss Highlighters'`,
  `url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=900&q=80', alt: 'Stabilo Boss Highlighters'`
);
exp = exp.replace(
  `url: 'https://images.unsplash.com/photo-1585336261026-77884a44b8f5?auto=format&fit=crop&w=900&q=80', alt: 'Parker Jotter'`,
  `url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80', alt: 'Parker Jotter'`
);
fs.writeFileSync('src/lib/expanded-products.ts', exp, 'utf8');

console.log('Images fixed successfully in products.json and expanded-products.ts!');
