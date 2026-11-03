'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'si';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Utility
    'top.free_delivery': 'Free Delivery Islandwide on Orders Over Rs. 5,000',
    'top.trusted': 'Trusted by 10,000+ Sri Lankan Students & Parents',
    'top.track_order': 'Track Order',
    'top.help': '24/7 Support',
    'top.login': 'Login / Sign Up',
    'top.antigravity_badge': 'AZIP Store',

    // Nav
    'nav.search_placeholder': 'Search products...',
    'nav.wishlist': 'Wishlist',
    'nav.orders': 'Orders',
    'nav.cart': 'Cart',
    'nav.all_categories': 'All Categories',
    'nav.grade_kits': 'Grade Kits',
    'nav.books': 'Books',
    'nav.stationery': 'Stationery',
    'nav.backpacks': 'Bags',
    'nav.art': 'Art',
    'nav.calculators': 'Calculators',
    'nav.notebooks': 'Notebooks',
    'nav.essentials': 'Essentials',
    'nav.upload_booklist': 'Upload Booklist',

    // Hero Section
    'hero.badge': 'Back to School',
    'hero.title_pre': 'School supplies,',
    'hero.title_highlight': 'delivered',
    'hero.title_post': '',
    'hero.subtitle': 'Books, stationery and bags for every grade. Islandwide delivery.',
    'hero.cta_shop': 'Shop Now',
    'hero.cta_custom': 'Build a Grade Kit',
    'hero.better_learning': 'Better Learning',
    'hero.brighter_future': 'Brighter Future',
    'hero.feature_1': 'Genuine brands',
    'hero.feature_2': 'Grade bundles',
    'hero.feature_3': 'Fast delivery',

    // Banner
    'banner.limited': 'Limited offer',
    'banner.title': 'Up to 25% off school essentials',
    'banner.desc': 'Books, bags, calculators and art supplies',
    'banner.shop_now': 'See Deals',

    // Flash Sale
    'flash.title': "Today's Deals",
    'flash.subtitle': 'Ends tonight',
    'flash.hours': 'Hours',
    'flash.minutes': 'Mins',
    'flash.seconds': 'Secs',
    'flash.view_all': 'View All',
    'flash.stock_left': 'left',
    'flash.preview_360': '360° Preview',

    // Best Sellers
    'best.title': 'Best Sellers',
    'best.subtitle': 'Most loved by students',
    'best.view_all': 'View All',

    // Grade Kit Configurator
    'config.badge': 'Grade Kits',
    'config.title': 'Build a Grade Kit',
    'config.subtitle': 'Pick a grade, choose items, save on the bundle.',
    'config.select_grade': 'Select Grade',
    'config.included_items': 'Kit Items',
    'config.zero_g_weight': '',
    'config.standard_weight': 'Weight',
    'config.bundle_savings': 'You Save',
    'config.add_kit_to_cart': 'Add Kit to Cart',
    'config.customized': 'Kit Ready',

    // 360 Preview
    'preview.title': '360° Preview',
    'preview.drag_hint': 'Drag to rotate',
    'preview.specs': 'Specifications',
    'preview.add_cart': 'Add to Cart',

    // Cart Drawer
    'cart.title': 'Your Cart',
    'cart.free_shipping_hint': 'Add Rs. {amount} more for free delivery',
    'cart.free_shipping_unlocked': 'Free delivery unlocked',
    'cart.subtotal': 'Subtotal',
    'cart.coupon_label': 'Coupon code',
    'cart.coupon_placeholder': 'Enter code',
    'cart.coupon_apply': 'Apply',
    'cart.coupon_discount': 'Coupon Discount',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.empty_title': 'Your cart is empty',
    'cart.empty_desc': 'Add some items to get started.',

    // Trust Badges
    'trust.genuine': 'Genuine Products',
    'trust.genuine_sub': 'Original brands only',
    'trust.secure': 'Secure Payment',
    'trust.secure_sub': 'Card, Koko, Mintpay, COD',
    'trust.delivery': 'Islandwide Delivery',
    'trust.delivery_sub': '1–3 days',
    'trust.returns': 'Easy Returns',
    'trust.returns_sub': '7-day replacement',
  },
  si: {
    // Top Bar & Utility
    'top.free_delivery': 'රු. 5,000 ට වැඩි ඇණවුම් සඳහා දිවයින පුරා නොමිලේ බෙදාහැරීම',
    'top.trusted': 'ශ්‍රී ලාංකික සිසුන් සහ දෙමාපියන් 10,000+ කගේ විශ්වාසය',
    'top.track_order': 'ඇණවුම සොයන්න',
    'top.help': '24/7 පාරිභෝගික සහාය',
    'top.login': 'ඇතුල් වන්න / ලියාපදිංචි වන්න',
    'top.antigravity_badge': 'ඇන්ටි-ග්‍රැවිටි ඕර්බිට් අලෙවිසැල',

    // Nav
    'nav.search_placeholder': 'පාසල් පොත්, ඇට්ලස් ලිපිද්‍රව්‍ය, බෑග්, කැසියෝ කැල්කියුලේටර් සොයන්න...',
    'nav.wishlist': 'ප්‍රියතම ලැයිස්තුව',
    'nav.orders': 'ඇණවුම්',
    'nav.cart': 'සාප්පු මල්ල',
    'nav.all_categories': 'සියලුම අංශයන්',
    'nav.grade_kits': 'ශ්‍රේණි කට්ටල සකසනය',
    'nav.books': 'පාසල් පොත්පත්',
    'nav.stationery': 'ලිපිද්‍රව්‍ය',
    'nav.backpacks': 'පාසල් බෑග්',
    'nav.art': 'චිත්‍ර හා නිර්මාණ',
    'nav.calculators': 'කැල්කියුලේටර්',
    'nav.notebooks': 'අභ්‍යාස පොත්',
    'nav.essentials': 'අත්‍යවශ්‍ය දෑ',
    'nav.upload_booklist': 'පොත් ලැයිස්තුව Upload කරන්න',

    // Hero Section
    'hero.badge': 'අනාගතවාදී ශූන්‍ය-ගුරුත්ව අත්දැකීම',
    'hero.title_pre': 'ශූන්‍ය-ගුරුත්ව',
    'hero.title_highlight': 'සිසු කට්ටල',
    'hero.title_post': 'සහ ලිපිද්‍රව්‍ය',
    'hero.subtitle': '1 ශ්‍රේණියේ සිට උසස් පෙළ දක්වා සම්පූර්ණ විෂයමාලා පාසල් පැකේජ. පාවෙන තාක්ෂණය සහ ක්ෂණික දිවයින පුරා බෙදාහැරීම අත්විඳින්න.',
    'hero.cta_shop': 'සිසු කට්ටල බලන්න',
    'hero.cta_custom': 'ඔබේ ශ්‍රේණි කට්ටලය හදන්න',
    'hero.better_learning': 'සුවිශේෂී අධ්‍යාපනයක්',
    'hero.brighter_future': 'දීප්තිමත් අනාගතයක්',
    'hero.feature_1': 'නිල විෂය නිර්දේශිත පොත්',
    'hero.feature_2': 'සැහැල්ලු ශූන්‍ය-ගුරුත්ව බණ්ඩල්',
    'hero.feature_3': 'ක්ෂණික අධිවේගී ඩිලිවරි',

    // Banner
    'banner.limited': 'සීමිත කාලීන විශේෂ දීමනාව',
    'banner.title': 'පාසල් සමාරම්භක විශේෂ මිල අඩුකිරීම් — 25% දක්වා',
    'banner.desc': 'පොත් කට්ටල • කාර්යක්ෂම බෑග් • විද්‍යාත්මක කැල්කියුලේටර් • කලා උපකරණ',
    'banner.shop_now': 'දීමනා ලබාගන්න',

    // Flash Sale
    'flash.title': 'ක්ෂණික විශිෂ්ට දීමනා',
    'flash.subtitle': 'සීමිත කාලයකට පමණක් පවතින සුපිරි මිල අඩුකිරීම්',
    'flash.hours': 'පැය',
    'flash.minutes': 'මිනිත්තු',
    'flash.seconds': 'තත්පර',
    'flash.view_all': 'සියලු දීමනා',
    'flash.stock_left': 'ක් පමණක් ඉතිරිව ඇත',
    'flash.preview_360': '360° පෙනුම',

    // Best Sellers
    'best.title': 'වැඩිම අලෙවියක් සහිත නිෂ්පාදන',
    'best.subtitle': 'දිවයින පුරා දරු දැරියන් වඩාත්ම ප්‍රිය කරන උසස් ප්‍රමිතියේ උපකරණ',
    'best.view_all': 'සියල්ල බලන්න',

    // Grade Kit Configurator
    'config.badge': 'අන්තර්ක්‍රියාකාරී මෙවලම',
    'config.title': 'අභිමත ශ්‍රේණි කට්ටල සකසනය',
    'config.subtitle': 'ඔබේ දරුවාගේ ශ්‍රේණිය තෝරන්න, අවශ්‍ය පොත් සහ ලිපිද්‍රව්‍ය ලකුණු කර විශේෂ වට්ටම් සහිතව කට්ටලය සාදාගන්න!',
    'config.select_grade': 'ශ්‍රේණිය තෝරන්න',
    'config.included_items': 'කට්ටලයට ඇතුළත් අයිතම',
    'config.zero_g_weight': 'ශූන්‍ය-ගුරුත්ව බර: 0.00 kg',
    'config.standard_weight': 'සාමාන්‍ය බර',
    'config.bundle_savings': 'කට්ටල වට්ටමෙන් ඉතිරි වූ මුදල',
    'config.add_kit_to_cart': 'සම්පූර්ණ කට්ටලය මල්ලට එක්කරන්න',
    'config.customized': 'සකස් කළ කට්ටලය සූදානම්',

    // 360 Preview
    'preview.title': '360° පාවෙන ත්‍රිමාණ පෙනුම',
    'preview.drag_hint': 'කරකැවීම සඳහා මූසිකය හෝ ඇඟිල්ල හරහට අදින්න',
    'preview.specs': 'නිෂ්පාදන විස්තර',
    'preview.add_cart': 'මල්ලට එක්කරන්න',

    // Cart Drawer
    'cart.title': 'ඔබේ සාප්පු මල්ල',
    'cart.free_shipping_hint': 'නොමිලේ ඩිලිවරි සඳහා තවත් රු. {amount} ක භාණ්ඩ එක්කරන්න!',
    'cart.free_shipping_unlocked': '✨ නොමිලේ දිවයින පුරා බෙදාහැරීම හිමිවිය!',
    'cart.subtotal': 'එකතුව',
    'cart.coupon_label': 'වට්ටම් කූපන් කේතයක් තිබේද?',
    'cart.coupon_placeholder': 'කේතය ඇතුළත් කරන්න (උදා: ANTIGRAVITY)',
    'cart.coupon_apply': 'භාවිත කරන්න',
    'cart.coupon_discount': 'කූපන් වට්ටම',
    'cart.total': 'ගෙවිය යුතු මුළු මුදල',
    'cart.checkout': 'ගෙවීම් පිටුවට පිවිසෙන්න',
    'cart.empty_title': 'ඔබේ සාප්පු මල්ල හිස්ව පවතී',
    'cart.empty_desc': 'පාසල් පොත්, ලිපිද්‍රව්‍ය හෝ සිසු කට්ටල එක්කර සාප්පු සවාරිය අරඹන්න.',

    // Trust Badges
    'trust.genuine': '100% ප්‍රමිතිගත නිෂ්පාදන',
    'trust.genuine_sub': 'ප්‍රමුඛ පෙළේ ප්‍රකාශකයන්ගෙන් ඍජුවම',
    'trust.secure': 'ආරක්ෂිත ගෙවීම් ක්‍රම',
    'trust.secure_sub': 'කාඩ්පත් සහ භාණ්ඩ ලැබුණු පසු ගෙවීම් පහසුකම්',
    'trust.delivery': 'ක්ෂණික දිවයින පුරා බෙදාහැරීම',
    'trust.delivery_sub': 'ඕනෑම දිස්ත්‍රික්කයකට දින 1-3 කින්',
    'trust.returns': 'පහසු ආපසු භාරදීම',
    'trust.returns_sub': 'දින 7ක වගකීම් කාලය',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('azip_lang') as Language | null;
      if (stored === 'en' || stored === 'si') {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('azip_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'si' : 'en');
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
