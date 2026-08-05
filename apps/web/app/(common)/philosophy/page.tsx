// apps/web/app/philosophy/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  ChevronRight, 
  Sun, 
  Award, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  Heart
} from 'lucide-react';

export default function PhilosophyPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#FCFAF7] overflow-x-hidden antialiased flex flex-col text-[#2B2B2B] selection:bg-[#1F5E3B]/10 relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-b from-[#C89B3C]/10 via-[#1F5E3B]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#C89B3C]/5 via-[#1F5E3B]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="w-full bg-white border-b border-[#EAE3D2] py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10 shadow-2xs">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 bg-[#FCFAF7] border border-[#EAE3D2] px-4 py-2 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#1F5E3B] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" /> Our Promise of Quality and Respect
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#2B2B2B] tracking-tight leading-[1.12]">
            Products for <span className="font-serif italic text-[#1F5E3B]">Every Religion</span>, Rooted in <span className="font-serif italic text-[#C89B3C]">Pure Ayurveda</span>
          </h1>

          <p className="text-[#7C7467] text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light">
            We provide clean, natural, and high-quality products for everyone. While our primary focus is honoring Hindu traditions and Ayurvedic care, our store welcomes and respects people of all faiths worldwide.
          </p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#A39785]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span onClick={() => router.push('/')} className="cursor-pointer hover:text-[#1F5E3B] transition-colors duration-300">Home</span>
          <ChevronRight className="w-3 h-3 text-[#EAE3D2] shrink-0" />
          <span className="text-[#2B2B2B] font-semibold shrink-0">Our Philosophy</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span className="font-light text-[#7C7467] tracking-normal text-xs font-mono">100% Quality Guaranteed</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 space-y-24">
        
        {/* SECTION 1: FAITH INCLUSIVITY & HINDU TRADITION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border-b border-[#C89B3C] pb-1 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
              <Heart className="w-3.5 h-3.5 text-[#C89B3C]" /> Respect for All Beliefs
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2B2B2B] leading-[1.18]">
              Hindu Tradition at Heart, Open to All Religions
            </h2>
            <p className="text-[#7C7467] text-sm sm:text-base leading-relaxed font-light">
              Our highest priority is providing authentic products for Hindu worship, prayer, and daily health rituals. We ensure that every item is pure, clean, and made with total honesty according to traditional methods.
            </p>
            <p className="text-[#7C7467] text-sm sm:text-base leading-relaxed font-light">
              At the same time, we believe in kindness and peace for everyone. Our wellness items and natural products are made to support people of every religion, culture, and background.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono tracking-wider text-[#2B2B2B]">
              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#EAE3D2]">
                <CheckCircle2 className="w-4 h-4 text-[#1F5E3B] shrink-0" />
                <span>Clean & Pure Ingredients</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-white border border-[#EAE3D2]">
                <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>Respectful to Every Faith</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#EAE3D2] p-8 sm:p-12 relative shadow-xs space-y-8">
            <div className="w-14 h-14 bg-[#FCFAF7] border border-[#EAE3D2] flex items-center justify-center text-[#1F5E3B]">
              <Sun className="w-7 h-7 text-[#C89B3C]" />
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#2B2B2B]">Honest and Pure Standards</h3>
              <p className="text-[#7C7467] text-xs sm:text-sm leading-relaxed font-light">
                We take special care in how our items are made. We do not use harmful chemicals or artificial fillers. Everything you buy from us is safe, natural, and respectful of your home.
              </p>
            </div>
            <div className="border-t border-[#EAE3D2] pt-6 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#7C7467]">
              <span>Quality Certified</span>
              <span className="text-[#1F5E3B] font-bold">100% Organic</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: AYURVEDA WELLNESS */}
        <section className="bg-white border border-[#EAE3D2] p-8 sm:p-14 lg:p-16 shadow-2xs space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#1F5E3B]">
              Natural Health
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2B2B2B]">
              The Best Quality Ayurvedic Products
            </h2>
            <p className="text-[#7C7467] text-sm sm:text-base leading-relaxed font-light">
              Ayurveda is an ancient natural system of health and wellness. We bring you the finest herbal products that help keep your body and mind healthy and balanced.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[#EAE3D2]">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#C89B3C] tracking-widest uppercase">01 / Natural Process</div>
              <h4 className="font-serif text-lg text-[#2B2B2B]">Safe Extraction</h4>
              <p className="text-[#7C7467] text-xs sm:text-sm leading-relaxed font-light">
                We process herbs slowly and gently so they keep all their natural health benefits.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#C89B3C] tracking-widest uppercase">02 / Pure Sourcing</div>
              <h4 className="font-serif text-lg text-[#2B2B2B]">Clean Ingredients</h4>
              <p className="text-[#7C7467] text-xs sm:text-sm leading-relaxed font-light">
                We pick herbs from clean, natural environments to ensure the highest quality.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#C89B3C] tracking-widest uppercase">03 / Quality Check</div>
              <h4 className="font-serif text-lg text-[#2B2B2B]">Tested for Safety</h4>
              <p className="text-[#7C7467] text-xs sm:text-sm leading-relaxed font-light">
                Every batch is inspected carefully so you receive only pure and safe products.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE PILLARS */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B]">Why Choose Our Store</h2>
            <p className="text-xs sm:text-sm text-[#7C7467] font-light max-w-xl mx-auto">
              Our promises to you, every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B] p-8 transition-all duration-300 space-y-4 shadow-2xs group">
              <div className="w-10 h-10 bg-[#FCFAF7] border border-[#EAE3D2] flex items-center justify-center text-[#1F5E3B] group-hover:bg-[#1F5E3B] group-hover:text-white transition-colors duration-300">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#2B2B2B]">Pure Ayurveda</h3>
              <p className="text-[#7C7467] text-xs leading-relaxed font-light">
                No chemical additives or artificial ingredients. Just 100% natural herbs.
              </p>
            </div>

            <div className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B] p-8 transition-all duration-300 space-y-4 shadow-2xs group">
              <div className="w-10 h-10 bg-[#FCFAF7] border border-[#EAE3D2] flex items-center justify-center text-[#C89B3C] group-hover:bg-[#C89B3C] group-hover:text-white transition-colors duration-300">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#2B2B2B]">Hindu Focus</h3>
              <p className="text-[#7C7467] text-xs leading-relaxed font-light">
                Authentic, high-purity ritual items crafted for sacred Hindu worship.
              </p>
            </div>

            <div className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B] p-8 transition-all duration-300 space-y-4 shadow-2xs group">
              <div className="w-10 h-10 bg-[#FCFAF7] border border-[#EAE3D2] flex items-center justify-center text-[#1F5E3B] group-hover:bg-[#1F5E3B] group-hover:text-white transition-colors duration-300">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#2B2B2B]">All Religions</h3>
              <p className="text-[#7C7467] text-xs leading-relaxed font-light">
                Products designed to bring peace and health to people of any belief.
              </p>
            </div>

            <div className="bg-white border border-[#EAE3D2] hover:border-[#1F5E3B] p-8 transition-all duration-300 space-y-4 shadow-2xs group">
              <div className="w-10 h-10 bg-[#FCFAF7] border border-[#EAE3D2] flex items-center justify-center text-[#C89B3C] group-hover:bg-[#C89B3C] group-hover:text-white transition-colors duration-300">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#2B2B2B]">Top Quality</h3>
              <p className="text-[#7C7467] text-xs leading-relaxed font-light">
                Premium packaging and safe, fast delivery directly to your home.
              </p>
            </div>

          </div>
        </section>

        {/* CALL TO ACTION REDIRECTING TO /products */}
        <section className="bg-white border border-[#EAE3D2] p-10 sm:p-16 text-center space-y-8 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C89B3C]/5 rounded-full blur-2xl pointer-events-none" />
          
          <ShieldCheck className="w-10 h-10 text-[#C89B3C] mx-auto stroke-[1.25]" />
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B]">Explore Our Products</h2>
            <p className="text-xs sm:text-sm text-[#7C7467] font-light leading-relaxed">
              Browse our complete catalog of Ayurvedic wellness items and worship essentials today.
            </p>
          </div>

          <div>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-3 h-14 px-10 border border-[#1F5E3B] text-[#FCFAF7] bg-[#1F5E3B] text-[11px] font-mono font-medium uppercase tracking-[0.25em] hover:bg-[#154128] transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 text-[#C89B3C]" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}