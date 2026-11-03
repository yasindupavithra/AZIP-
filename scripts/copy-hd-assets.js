const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\0c82be20-c3a5-4a5f-a5a6-44fb38117345';
const pub = 'c:\\Users\\user\\Desktop\\Nagoya\\AZIP\\public\\images\\hd';

const dirs = ['hero', 'products', 'categories', 'banners'];
dirs.forEach(d => {
  const dirPath = path.join(pub, d);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

const files = fs.readdirSync(brain);

function copyFirstMatch(pattern, destRelative) {
  const match = files.find(f => f.startsWith(pattern) && f.endsWith('.jpg'));
  if (match) {
    const src = path.join(brain, match);
    const dst = path.join(pub, destRelative);
    fs.copyFileSync(src, dst);
    console.log(`Copied ${match} -> ${destRelative}`);
  } else {
    console.warn(`No match found for pattern: ${pattern}`);
  }
}

copyFirstMatch('azip_hero_student_kit', 'hero/hero-student-kit-hd.jpg');
copyFirstMatch('atlas_exercise_books', 'products/atlas-exercise-book.jpg');
copyFirstMatch('pilot_g2_pens', 'products/pilot-g2-pens.jpg');
copyFirstMatch('casio_fx991cw', 'products/casio-fx991cw.jpg');
copyFirstMatch('faber_castell_watercolor', 'products/faber-castell-water-color.jpg');
copyFirstMatch('highlighters_pastel_set', 'products/highlighters-set.jpg');
copyFirstMatch('sticky_notes_cube', 'products/sticky-notes.jpg');
copyFirstMatch('student_water_bottle', 'products/water-bottle.jpg');
copyFirstMatch('student_lunchbox_blue', 'products/lunch-box.jpg');
copyFirstMatch('student_school_shoes', 'products/school-shoes.jpg');
copyFirstMatch('geometry_set_tin', 'products/geometry-set.jpg');
copyFirstMatch('drawing_kit_case', 'products/drawing-kit.jpg');
copyFirstMatch('delivery_truck_3d', 'banners/delivery-truck.jpg');

// Copy categories
const catMaps = [
  ['products/atlas-exercise-book.jpg', 'categories/school-books.jpg'],
  ['products/pilot-g2-pens.jpg', 'categories/pens-writing.jpg'],
  ['products/faber-castell-water-color.jpg', 'categories/art-supplies.jpg'],
  ['products/casio-fx991cw.jpg', 'categories/calculators-geometry.jpg'],
  ['products/atlas-exercise-book.jpg', 'categories/exercise-books.jpg'],
];

catMaps.forEach(([srcRel, dstRel]) => {
  const src = path.join(pub, srcRel);
  const dst = path.join(pub, dstRel);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${srcRel} -> ${dstRel}`);
  }
});

console.log('ALL ASSETS COPIED SUCCESSFULLY!');
