import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';
import Vendor from '@/lib/models/Vendor';
import Product from '@/lib/models/Product';
import { hashPassword } from '@/lib/auth';

// GET /api/seed - Seed database with initial data
export async function GET() {
  try {
    await dbConnect();

    // Check if already seeded
    const existingAdmin = await Admin.findOne({ email: 'admin@azipstore.lk' });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Database already seeded' });
    }

    // Create default admin
    const passwordHash = await hashPassword('admin123');
    const admin = await Admin.create({
      email: 'admin@azipstore.lk',
      passwordHash,
      name: 'AZip Admin',
      role: 'superadmin',
    });

    // Create default vendor
    const vendor = await Vendor.create({
      name: 'AZip Store',
      slug: 'azip-store',
      description: 'Your one-stop shop for educational materials and electronics in Kandy',
      contactEmail: 'admin@azipstore.lk',
      contactPhone: '+94812222222',
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94XXXXXXXXX',
      address: {
        street: 'Peradeniya Road',
        city: 'Kandy',
        province: 'Central',
        postalCode: '20000',
      },
    });

    // Create sample products
    const sampleProducts = [
      // Stationery & Books
      {
        vendor: vendor._id,
        name: 'Premium A4 Notebook - 200 Pages',
        slug: 'premium-a4-notebook-200pages',
        description: 'High-quality ruled A4 notebook with 200 pages. Perfect for school and university students. Durable cover with smooth writing paper.',
        category: 'exercise-books',
        subcategory: 'Notebooks',
        price: 450,
        compareAtPrice: 550,
        images: [{ url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', publicId: 'sample-1', alt: 'A4 Notebook' }],
        stock: 150,
        sku: 'AZ-NB-001',
        tags: ['notebook', 'a4', 'school', 'university'],
        specifications: new Map([['Pages', '200'], ['Size', 'A4'], ['Type', 'Ruled']]),
        isFeatured: true,
      },
      {
        vendor: vendor._id,
        name: 'Pilot G2 Gel Pen Set (5 Pack)',
        slug: 'pilot-g2-gel-pen-set-5pack',
        description: 'Smooth writing Pilot G2 gel pens in assorted colors. Fine 0.7mm tip for precise writing.',
        category: 'writing-instruments',
        subcategory: 'Pens',
        price: 850,
        compareAtPrice: 1000,
        images: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80', publicId: 'sample-2', alt: 'Gel Pen Set' }],
        stock: 200,
        sku: 'AZ-PN-001',
        tags: ['pen', 'gel', 'pilot', 'writing'],
        specifications: new Map([['Tip Size', '0.7mm'], ['Pack', '5 pens'], ['Type', 'Gel']]),
        isFeatured: true,
      },
      {
        vendor: vendor._id,
        name: 'School Geometry Set - Complete',
        slug: 'school-geometry-set-complete',
        description: 'Complete geometry set including compass, protractor, set square, ruler, and eraser. Essential for mathematics students.',
        category: 'mathematical-instruments',
        subcategory: 'School Supplies',
        price: 650,
        images: [{ url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80', publicId: 'sample-3', alt: 'Geometry Set' }],
        stock: 80,
        sku: 'AZ-GS-001',
        tags: ['geometry', 'maths', 'school', 'compass'],
        specifications: new Map([['Items', '6 pieces'], ['Material', 'Stainless Steel + Plastic']]),
      },
      {
        vendor: vendor._id,
        name: 'Oxford English Dictionary - Student Edition',
        slug: 'oxford-english-dictionary-student',
        description: 'Compact student edition Oxford English Dictionary. Over 120,000 words and phrases.',
        category: 'books',
        subcategory: 'Books',
        price: 2500,
        compareAtPrice: 3200,
        images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80', publicId: 'sample-4', alt: 'Dictionary' }],
        stock: 30,
        sku: 'AZ-BK-001',
        tags: ['dictionary', 'oxford', 'english', 'book'],
        specifications: new Map([['Pages', '1200+'], ['Edition', 'Student'], ['Language', 'English']]),
        isFeatured: true,
      },
      {
        vendor: vendor._id,
        name: 'Heavy Duty School Bag - Navy Blue',
        slug: 'heavy-duty-school-bag-navy',
        description: 'Durable school backpack with multiple compartments, laptop sleeve, and padded straps. Water-resistant material.',
        category: 'school-accessories',
        subcategory: 'Bags',
        price: 3500,
        compareAtPrice: 4200,
        images: [{ url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', publicId: 'sample-5', alt: 'School Bag' }],
        stock: 45,
        sku: 'AZ-BG-001',
        tags: ['bag', 'backpack', 'school', 'laptop'],
        specifications: new Map([['Capacity', '30L'], ['Material', 'Polyester'], ['Laptop', 'Up to 15.6"']]),
      },
      {
        vendor: vendor._id,
        name: 'Art Color Pencils - 24 Pack',
        slug: 'art-color-pencils-24pack',
        description: 'Professional quality colored pencils for art students. Vibrant colors with smooth laydown.',
        category: 'art-craft',
        subcategory: 'Art Supplies',
        price: 1200,
        images: [{ url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', publicId: 'sample-6', alt: 'Color Pencils' }],
        stock: 100,
        sku: 'AZ-AP-001',
        tags: ['pencils', 'color', 'art', 'drawing'],
        specifications: new Map([['Count', '24 colors'], ['Type', 'Wax-based']]),
      },
      // Electronics
      {
        vendor: vendor._id,
        name: 'Casio FX-991EX Scientific Calculator',
        slug: 'casio-fx991ex-calculator',
        description: 'Advanced scientific calculator with 552 functions. High-resolution LCD display. Ideal for A/L and university students.',
        category: 'electronics',
        subcategory: 'Calculators',
        price: 7500,
        compareAtPrice: 8500,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'Scientific Calculator' }],
        stock: 25,
        sku: 'AZ-EL-001',
        tags: ['calculator', 'casio', 'scientific', 'exam'],
        specifications: new Map([['Functions', '552'], ['Display', 'LCD'], ['Power', 'Solar + Battery']]),
        isFeatured: true,
      },
      {
        vendor: vendor._id,
        name: 'SanDisk 32GB USB 3.0 Flash Drive',
        slug: 'sandisk-32gb-usb3-flash-drive',
        description: 'High-speed USB 3.0 flash drive. Perfect for storing documents, presentations, and project files.',
        category: 'electronics',
        subcategory: 'Storage',
        price: 1500,
        compareAtPrice: 1800,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'USB Flash Drive' }],
        stock: 60,
        sku: 'AZ-EL-002',
        tags: ['usb', 'flash drive', 'sandisk', 'storage'],
        specifications: new Map([['Capacity', '32GB'], ['USB', '3.0'], ['Speed', 'Up to 130MB/s']]),
      },
      {
        vendor: vendor._id,
        name: 'JBL Tune 510BT Wireless Headphones',
        slug: 'jbl-tune-510bt-headphones',
        description: 'Wireless on-ear headphones with JBL Pure Bass sound. 40-hour battery life. Perfect for online classes.',
        category: 'electronics',
        subcategory: 'Audio',
        price: 9500,
        compareAtPrice: 11000,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'Wireless Headphones' }],
        stock: 15,
        sku: 'AZ-EL-003',
        tags: ['headphones', 'jbl', 'wireless', 'bluetooth'],
        specifications: new Map([['Battery', '40 hours'], ['Bluetooth', '5.0'], ['Type', 'On-ear']]),
        isFeatured: true,
      },
      {
        vendor: vendor._id,
        name: 'Logitech M185 Wireless Mouse',
        slug: 'logitech-m185-wireless-mouse',
        description: 'Reliable wireless mouse with nano receiver. Comfortable design for extended use. 12-month battery life.',
        category: 'electronics',
        subcategory: 'Accessories',
        price: 2200,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'Wireless Mouse' }],
        stock: 40,
        sku: 'AZ-EL-004',
        tags: ['mouse', 'logitech', 'wireless', 'computer'],
        specifications: new Map([['Battery', '12 months'], ['Connection', '2.4GHz Wireless'], ['DPI', '1000']]),
      },
      {
        vendor: vendor._id,
        name: 'LED Desk Lamp with USB Charging',
        slug: 'led-desk-lamp-usb-charging',
        description: 'Adjustable LED desk lamp with 3 brightness levels and USB charging port. Eye-care technology for study sessions.',
        category: 'electronics',
        subcategory: 'Lighting',
        price: 3800,
        compareAtPrice: 4500,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'LED Desk Lamp' }],
        stock: 20,
        sku: 'AZ-EL-005',
        tags: ['lamp', 'led', 'desk', 'study', 'usb'],
        specifications: new Map([['Brightness', '3 Levels'], ['USB', 'Charging Port'], ['Power', '5W']]),
      },
      {
        vendor: vendor._id,
        name: 'Power Bank 10000mAh',
        slug: 'power-bank-10000mah',
        description: 'Compact 10000mAh power bank with dual USB output. Keep your devices charged throughout the day.',
        category: 'electronics',
        subcategory: 'Accessories',
        price: 3200,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray', publicId: 'sample', alt: 'Power Bank' }],
        stock: 35,
        sku: 'AZ-EL-006',
        tags: ['power bank', 'charging', 'portable', 'battery'],
        specifications: new Map([['Capacity', '10000mAh'], ['Output', 'Dual USB'], ['Input', 'USB-C']]),
      },
    ];

    await Product.insertMany(sampleProducts);

    return NextResponse.json({
      message: 'Database seeded successfully!',
      data: {
        admin: { email: admin.email, password: 'admin123' },
        vendor: vendor.name,
        products: sampleProducts.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Seed failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
