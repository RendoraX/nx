"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Globe, 
  ShoppingBag, 
  Heart, 
  User, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Package, 
  HelpCircle, 
  ArrowRight,
  Menu,
  X,
  Compass,
  Layers3,
  Flame,
  Droplet,
  BookOpen,
  Gem,
  Award,
  Loader2,
  AlertCircle
} from "lucide-react";

// --- Custom Data Access Layer Hook ---
import { useProducts } from "@/hooks/useProduct";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";

// --- Types & Interfaces ---
interface Product {
  id: string;
  name: string;
  hindiName?: string;
  sanskritName?: string;
  category: {
    name : string
  };
  price: string;
  badge?: string;
  images : [{
    url: string;
    alt?: string;
  }];
  description?: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  comparePrice : string
}

// --- Rigorous Data Structures directly map from specifications ---
const PRIMARY_PILLARS = [
  { id: "ayurveda", title: "Ayurvedic Products", desc: "Time-tested herbal treatments and cold-pressed extractions.", activeColor: "border-[#1F5E3B]" },
  { id: "religious", title: "Religious Essentials", desc: "Pristine brassware, holy water, and text scriptures.", activeColor: "border-[#C89B3C]" },
  { id: "custom-kits", title: "Custom Pooja Kits", desc: "Choose the puja items and amounts that you need.", activeColor: "border-[#E6D5B8]" }
];

const EXTENDED_CATEGORIES = [
  { id: "raw-herbs", name: "Raw Herbs & Powders", hindi: "जड़ी-बूटी / चूर्ण", items: ["Ashwagandha Root", "Shatavari Powder", "Brahmi Leaves", "Triphala Churna"] },
  { id: "cold-oils", name: "Cold Pressed & Raw Oils", hindi: "कच्ची घानी तेल", items: ["Black Seed Oil", "Pure Sesame Oil", "Neem Oil Extract"] },
  { id: "ritual-brass", name: "Brass & Temple Accessories", hindi: "पीतल एवं मंदिर सजावट", items: ["Handcrafted Diya", "Pooja Thali Set", "Ganga Jal Vessel"] },
  { id: "incense-camphor", name: "Incense, Camphor & Chandan", hindi: "धूप, कपूर एवं चंदन", items: ["Bhimseni Camphor", "Mysore Sandal Paste", "Natural Dhoop Sticks"] },
  { id: "yantra-rudraksha", name: "Yantras, Books & Rudraksha", hindi: "यंत्र, ग्रंथ एवं रुद्राक्ष", items: ["Panchmukhi Rudraksha", "Sanatan Pooja Texts", "Copper Vastu Yantras"] },
  { id: "festival-kits", name: "Festival Collections & Kits", hindi: "त्यौहार एवं पूजा किट", items: ["Navratri Samagri Box", "Hawan Ingredients Pack", "Custom Customizations"] }
];

const SEARCH_DIMENSIONS = [
  "Product name", "Health concern", "Herb", "Puja", "Festival", "Sanskrit name", "Hindi name", "English name"
];

const TARGET_DEMOGRAPHICS = [
  "Families who perform puja at home", "Priests and puja guides",
  "People who use Ayurvedic products", "Older adults and spiritual learners",
  "Families looking for fair prices"
];

const FAQS = [
  { q: "How do you keep prices fair?", a: "We work with growers and local makers where possible, helping us offer good products at fair prices." },
  { q: "Can I choose what goes in my puja kit?", a: "Yes. Choose the items and amounts you need. Leave out anything you already have at home." },
  { q: "Where can I find certificates and customer reviews?", a: "We will show product certificates and customer reviews here once they are available." }
];

export default function LuxuryLandingPage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activeSearchTip, setActiveSearchTip] = useState(0);

  // Bind parameters dynamically to query state hooks to drive declarative remote caching layers
  const { data : productsData, isLoading, isError, error } = useProducts({
    categoryId: activeFilter === "all" ? undefined : activeFilter,
    search: searchQuery || undefined
  });



  // Extract products array array safely matching expected layout architecture structures
  const products: Product[] = Array.isArray(productsData?.products) ? productsData.products : (productsData as any)?.products || [];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#2B2B2B] font-sans antialiased selection:bg-[#E6D5B8] selection:text-[#1F5E3B]">
      
      {/* 1. TOP ANNOUNCEMENT BAR & HEADER */}
      
      <main>
        
        {/* 3. HERO IMMERSION SECTION */}
        <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E6D5B8] bg-gradient-to-b from-white to-[#FAF8F3]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Direct Copy Positioning */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-[#E6D5B8] px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F5E3B]">
                <Compass className="h-3.5 w-3.5 text-[#C89B3C]" /> {t('Beyond E-Commerce • Pure Sanctuary Framework')}
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2B2B2B] leading-[1.12] tracking-tight">
                {t('Traditional knowledge,')} <br />
                <span className="font-serif italic text-[#1F5E3B]">{t('honestly priced')}</span> {t('for every home.')}
              </h1>

              <p className="text-[#6B6B6B] text-sm md:text-base max-w-2xl leading-[1.65]">
                {t("Welcome to India's most transparent platform for premium Ayurvedic formulations, wild-harvested raw herbs, cold-pressed extraction oils, and sacred ritual artifacts. Designed for seamless use by families, pundits, and spiritual seekers alike.")}
              </p>

              {/* Dynamic Capability Micro-Dashboard for Search Parameters */}
              <div className="p-4 bg-white border border-[#E6D5B8] rounded-md max-w-xl space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C89B3C] block">{t('Find products by:')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_DIMENSIONS.map((dim, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => setActiveSearchTip(idx)}
                      className={`text-[10px] px-2.5 py-1 rounded-sm border cursor-pointer transition-all font-medium ${
                        activeSearchTip === idx ? "bg-[#1F5E3B] text-white border-[#1F5E3B]" : "bg-[#FAF8F3] border-[#E6D5B8]/60 text-[#6B6B6B] hover:border-[#1F5E3B]"
                      }`}
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Architecture Action Anchors */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href={"/bespoke"}
                  className="bg-[#1F5E3B] text-[#FAF8F3] hover:bg-[#153F28] transition-all px-8 py-4 rounded-md text-xs font-bold uppercase tracking-widest shadow-sm focus:outline-none"
                >
                  {t('Build Custom Kit')}
                </Link>
                <a 
                  href="#categories"
                  className="bg-transparent border border-[#1F5E3B] text-[#1F5E3B] hover:bg-[#1F5E3B]/5 transition-all px-8 py-4 rounded-md text-xs font-bold uppercase tracking-widest"
                >
                  {t('Explore Raw Herbs')}
                </a>
              </div>
            </div>

            {/* Visual Identity Frame */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-full aspect-[4/5] max-w-[380px] rounded-sm bg-white border border-[#E6D5B8] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FAF8F3] rounded-bl-full border-l border-b border-[#E6D5B8]/40"></div>
                
                <div className="space-y-6 z-10 relative">
                  <div className="w-10 h-10 rounded-sm bg-[#1F5E3B]/5 flex items-center justify-center text-[#1F5E3B]">
                    <Award className="h-5 w-5 text-[#C89B3C]" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-[#C89B3C] tracking-widest block">{t('How We Choose Products')}</span>
                    <h3 className="font-serif text-xl font-medium text-[#2B2B2B]">{t('Carefully Sourced Products')}</h3>
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {t('We do not make claims like "Lowest Price" or "Number One in India." We share clear product details and choose trusted suppliers.')}
                  </p>
                </div>

                <div className="border-t border-[#E6D5B8] pt-4 mt-6 flex justify-between items-center text-[10px] text-[#2B2B2B] font-bold tracking-widest uppercase z-10">
                  <span>Shri Ayurved Traditional</span>
                  <span className="text-[#1F5E3B]">Verified Platform</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. THE THREE PILARS PHILOSOPHY */}
        <section id="philosophy" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E6D5B8]/40 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C89B3C] block">{t('Why Shop With Us')}</span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#2B2B2B]">{t('Traditional Products, Easier to Find')}</h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              {t('Find Ayurvedic products, herbs, oils, and puja essentials in one place, with clear details and fair prices.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRIMARY_PILLARS.map((pillar) => (
              <div 
                key={pillar.id}
                className={`bg-white p-8 rounded-sm border-t-4 ${pillar.activeColor} border-x border-b border-[#E6D5B8] text-left space-y-4 shadow-sm`}
              >
                <h3 className="font-serif text-xl font-bold text-[#2B2B2B]">{t(pillar.title)}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{t(pillar.desc)}</p>
                <div className="text-[10px] font-bold text-[#1F5E3B] uppercase tracking-wider pt-2 flex items-center gap-1">
                  {t('Available now')} <CheckCircle2 className="h-3 w-3 text-[#6FA36F]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. DENSE SPECIFIED CATEGORY NAVIGATION MATRIX */}
        <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left max-w-xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1F5E3B] block">{t('Our product range')}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2B2B2B]">{t('Browse by category')}</h2>
            </div>
            <span className="text-xs font-semibold text-[#6B6B6B] bg-white border border-[#E6D5B8] px-4 py-2 rounded-sm uppercase tracking-wider">
              {t('Find puja and wellness essentials')}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTENDED_CATEGORIES.map((ext, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[#E6D5B8] p-6 rounded-sm flex flex-col justify-between hover:border-[#C89B3C] transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#FAF8F3] pb-3">
                    <h3 className="font-serif font-bold text-base text-[#2B2B2B] group-hover:text-[#1F5E3B] transition-colors">{t(ext.name)}</h3>
                    <span className="text-xs font-medium text-[#C89B3C] italic">{ext.hindi}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {ext.items.map((item, i) => (
                      <li key={i} className="text-xs text-[#6B6B6B] flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#C89B3C] rounded-full"></span> {t(item)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 text-left">
                  <button 
                    onClick={() => {
                      const el = document.getElementById("showcase");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[10px] uppercase font-bold tracking-widest text-[#1F5E3B] flex items-center gap-1 group-hover:gap-2 transition-all focus:outline-none"
                  >
                    {t('View products')} <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. EXTENDED CORE UNIQUE VALUE: CUSTOM POOJA KIT DESIGN MANIFESTO */}
        <section id="custom-kit" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-[#E6D5B8]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-block bg-[#C89B3C]/10 px-3 py-1 rounded-sm text-[10px] font-bold text-[#C89B3C] uppercase tracking-widest">
                {t('Build a kit that fits your needs')}
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#2B2B2B] leading-snug">
                {t('Make your puja kit your way:')} <br />
                <span className="font-serif italic text-[#1F5E3B]">{t('Choose your items and amounts.')}</span>
              </h2>
              <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed">
                {t('Choose the puja items and amounts you need. Leave out anything you already have at home, and see the price update as you make changes.')}
              </p>
              
              <div className="p-4 bg-[#FAF8F3] border border-[#E6D5B8] text-xs text-[#6B6B6B] space-y-2 rounded-sm">
                <p className="italic">{t('Your kit price updates as you change the items and amounts.')}</p>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-[#FAF8F3] p-6 border border-[#E6D5B8] rounded-sm space-y-4">
                <div className="w-8 h-8 rounded-full bg-[#1F5E3B] text-white flex items-center justify-center font-serif text-xs font-bold">I</div>
                <h3 className="font-serif font-bold text-base text-[#2B2B2B]">{t('Choose puja items')}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{t('Pick herbs, camphor, oils, wood, or brass items for your kit.')}</p>
              </div>

              <div className="bg-[#FAF8F3] p-6 border border-[#E6D5B8] rounded-sm space-y-4">
                <div className="w-8 h-8 rounded-full bg-[#1F5E3B] text-white flex items-center justify-center font-serif text-xs font-bold">II</div>
                <h3 className="font-serif font-bold text-base text-[#2B2B2B]">{t('Set amounts')}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{t('Choose how much of each item you need.')}</p>
              </div>

              <div className="bg-[#FAF8F3] p-6 border border-[#E6D5B8] rounded-sm space-y-4">
                <div className="w-8 h-8 rounded-full bg-[#1F5E3B] text-white flex items-center justify-center font-serif text-xs font-bold">III</div>
                <h3 className="font-serif font-bold text-base text-[#2B2B2B]">{t('Delivery to your home')}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{t('Choose your kit and enter your delivery address at checkout.')}</p>
              </div>
            </div>

          </div>
        </section>

        {/* 7. DYNAMIC PRODUCT GRID DISPLAY */}
       <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
    <div className="text-left space-y-1">
      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C89B3C] block">{t('Our products')}</span>
      <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2B2B2B]">{t('Popular products')}</h2>
    </div>

    {/* Strict Internal Tab Filtering States */}
    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wider">
      {["all", "raw-herbs", "cold-oils", "ritual-brass", "incense-camphor"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 border transition-all ${
            activeFilter === filter 
              ? "bg-[#1F5E3B] text-white border-[#1F5E3B]" 
              : "bg-white text-[#2B2B2B] border-[#E6D5B8] hover:border-[#1F5E3B]"
          }`}
        >
          {t(filter === 'all' ? 'All' : filter.replaceAll('-', ' '))}
        </button>
      ))}
    </div>
  </div>

  {/* Asynchronous Cache Matrix Layout Resolution States */}
  {isLoading && (
    <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white border border-[#E6D5B8] rounded-sm">
      <Loader2 className="h-6 w-6 text-[#1F5E3B] animate-spin" />
      <span className="text-xs uppercase tracking-widest text-[#6B6B6B] font-medium">{t('Loading products...')}</span>
    </div>
  )}

  {isError && (
    <div className="py-16 px-6 flex flex-col items-center justify-center gap-3 bg-red-50/50 border border-red-200 rounded-sm text-center max-w-xl mx-auto">
      <AlertCircle className="h-6 w-6 text-red-700" />
      <h4 className="font-serif text-base font-bold text-red-900">{t('Products could not be loaded')}</h4>
      <p className="text-xs text-red-700 leading-relaxed">
        {error instanceof Error ? error.message : t('Please try again in a moment.')}
      </p>
    </div>
  )}

  {!isLoading && !isError && products.length === 0 && (
    <div className="py-24 text-center bg-white border border-[#E6D5B8] rounded-sm">
      <span className="text-xs uppercase tracking-widest text-[#6B6B6B] font-medium italic">{t('No products found in this category.')}</span>
    </div>
  )}

  {/* Clean Product Grid Card Assembly */}
  {!isLoading && !isError && products.length > 0 && (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        // Correctly capture primary visual nodes from Cloudinary image matrices
        const primaryImage = product.images?.[0]?.url;
        
        return (
          <div 
            key={product.id}
            className="bg-white border border-[#E6D5B8] p-5 rounded-sm flex flex-col justify-between hover:shadow-sm transition-shadow group"
          >
            <div>
              <div className="w-full aspect-square bg-[#FAF8F3] rounded-sm border border-[#E6D5B8]/40 flex items-center justify-center relative overflow-hidden mb-4">
                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                  <span className="absolute top-3 left-3 bg-white border border-[#E6D5B8] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 text-[#1F5E3B] z-10">
                    Save ₹{Number(product.comparePrice) - Number(product.price)}
                  </span>
                )}
                {primaryImage ? (
                  <img 
                    src={primaryImage} 
                    alt={product.images[0].alt || product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]/40 font-serif">{t('Product image unavailable')}</span>
                )}
              </div>

              <div className="text-left space-y-1">
                {/* Dynamically access deep name property inside category objects safely */}
                <span className="text-[9px] font-bold text-[#C89B3C] uppercase tracking-widest block">
                  {t(product.category?.name || 'Other products')}
                </span>
                <h3 className="font-serif font-bold text-base text-[#2B2B2B] tracking-tight">{product.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  {product.sanskritName && <span className="italic font-medium text-[#1F5E3B]">{product.sanskritName}</span>}
                  {product.sanskritName && product.hindiName && <span className="text-[#E6D5B8]">|</span>}
                  {product.hindiName && <span className="font-medium text-xs">{product.hindiName}</span>}
                  {!product.sanskritName && !product.hindiName && product.description && (
                    <span className="font-light text-xs truncate max-w-full block text-[#7C7467]">{product.description}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#FAF8F3] flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] text-[#6B6B6B] uppercase block tracking-wider">{t('Price')}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-[#2B2B2B] font-mono">₹{product.price}</span>
                  {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                    <span className="text-xs text-[#A39785] line-through font-mono">₹{product.comparePrice}</span>
                  )}
                </div>
              </div>
              <button 
                className="bg-[#1F5E3B] text-white hover:bg-[#153F28] p-2.5 rounded-sm transition-colors focus:outline-none cursor-pointer"
                aria-label={`${t('Add to cart')}: ${product.name}`}
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>

        {/* 8. TARGET DEMOGRAPHICS MANIFESTO MATRIX */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6D5B8]/40">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 text-left space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1F5E3B] block">{t('Made for everyone')}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2B2B2B]">{t('Easy to use for every family')}</h2>
              <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed">
                {t('Find puja and wellness products with clear names, prices, and details.')}
              </p>
            </div>
            <div className="lg:col-span-8 bg-white border border-[#E6D5B8] p-6 rounded-sm text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C89B3C] block mb-4">{t('For homes, puja, and everyday wellness')}</span>
              <div className="grid sm:grid-cols-2 gap-4">
                {TARGET_DEMOGRAPHICS.map((target, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#6B6B6B] border-b border-[#FAF8F3] pb-2">
                    <span className="w-1.5 h-1.5 bg-[#1F5E3B] rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>{t(target)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. TRUST MATRICES & COMPLIANCE PLACEHOLDERS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] border-t border-b border-[#E6D5B8]">
          <div className="max-w-7xl mx-auto space-y-12 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1F5E3B] block">{t('Product checks')}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2B2B2B]">{t('Clear product information')}</h2>
              <p className="text-[#6B6B6B] text-xs md:text-sm">{t('We only share details that have been checked. More information will be added when it is available.')}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white border border-[#E6D5B8] p-6 rounded-sm space-y-3">
                <ShieldCheck className="h-5 w-5 text-[#1F5E3B]" />
                <h3 className="font-serif font-bold text-sm text-[#2B2B2B]">{t('AYUSH licence')}</h3>
                <div className="p-3 bg-[#FAF8F3] border border-dashed border-[#E6D5B8] rounded-sm font-mono text-[10px] text-[#6B6B6B]">
                  {t('Certificate details will be added when available.')}
                </div>
              </div>

              <div className="bg-white border border-[#E6D5B8] p-6 rounded-sm space-y-3">
                <FileText className="h-5 w-5 text-[#1F5E3B]" />
                <h3 className="font-serif font-bold text-sm text-[#2B2B2B]">{t('FSSAI certificate')}</h3>
                <div className="p-3 bg-[#FAF8F3] border border-dashed border-[#E6D5B8] rounded-sm font-mono text-[10px] text-[#6B6B6B]">
                  {t('Certificate details will be added when available.')}
                </div>
              </div>

              <div className="bg-white border border-[#E6D5B8] p-6 rounded-sm space-y-3">
                <Layers className="h-5 w-5 text-[#1F5E3B]" />
                <h3 className="font-serif font-bold text-sm text-[#2B2B2B]">{t('Lab test reports')}</h3>
                <div className="p-3 bg-[#FAF8F3] border border-dashed border-[#E6D5B8] rounded-sm font-mono text-[10px] text-[#6B6B6B]">
                  {t('Lab report details will be added when available.')}
                </div>
              </div>

              <div className="bg-white border border-[#E6D5B8] p-6 rounded-sm space-y-3">
                <CheckCircle2 className="h-5 w-5 text-[#1F5E3B]" />
                <h3 className="font-serif font-bold text-sm text-[#2B2B2B]">{t('Packing and delivery')}</h3>
                <div className="p-3 bg-[#FAF8F3] border border-dashed border-[#E6D5B8] rounded-sm font-mono text-[10px] text-[#6B6B6B]">
                  {t('Delivery information will be shown with your order.')}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6D5B8]/60 text-center">
              <span className="text-[10px] italic text-[#6B6B6B] block">
                {t('Customer reviews will appear here when available.')}
              </span>
            </div>
          </div>
        </section>

        {/* 10. DEEP EXPERT FAQ ACCORDION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <HelpCircle className="h-5 w-5 text-[#C89B3C] mx-auto" />
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2B2B2B]">{t('Common questions')}</h2>
              <p className="text-[#6B6B6B] text-xs">{t('Simple answers about prices, products, and custom puja kits.')}</p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-[#E6D5B8] rounded-sm overflow-hidden bg-[#FAF8F3]/30">
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left font-serif font-bold text-sm text-[#2B2B2B] flex items-center justify-between hover:bg-[#FAF8F3] focus:outline-none"
                    aria-expanded={faqOpen === idx}
                  >
                    <span>{t(faq.q)}</span>
                    <ChevronRight className={`h-4 w-4 text-[#C89B3C] transform transition-transform duration-200 ${faqOpen === idx ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {faqOpen === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-[#6B6B6B] leading-relaxed border-t border-[#E6D5B8]/40 bg-white">
                          {t(faq.a)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. CLEAN INFORMATIONAL NEWSLETTER REGISTRY */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] border-t border-[#E6D5B8] text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="font-serif text-xl font-normal text-[#2B2B2B]">{t('Get product updates')}</h2>
            <p className="text-[#6B6B6B] text-xs max-w-sm mx-auto leading-relaxed">
              {t('Sign up to hear about new products and seasonal collections.')}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 pt-2">
              <label htmlFor="newsletter-email" className="sr-only">{t('Email address')}</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder={t('Enter your email')}
                className="bg-white border border-[#E6D5B8] rounded-sm px-4 py-2.5 text-xs flex-1 focus:outline-none focus:border-[#1F5E3B]"
              />
              <button 
                type="submit" 
                className="bg-[#1F5E3B] text-white hover:bg-[#153F28] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-colors"
              >
                {t('Subscribe')}
              </button>
            </form>
          </div>
        </section>

      </main>



    </div>
  );
}