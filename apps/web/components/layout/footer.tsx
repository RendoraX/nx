// apps/web/components/layout/footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#1F5E3B] text-[#FAF8F3] border-t border-[#C89B3C]/20 pt-12 sm:pt-16 pb-8 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-left">

        {/* Brand */}
        <div className="space-y-4">
          <span className="font-serif text-xl font-bold block text-[#FAF8F3]">
            Shri Ayurved
          </span>

          <p className="text-xs text-[#FAF8F3]/70 font-light leading-relaxed tracking-wide">
            Trusted Ayurvedic products and traditional essentials, selected with
            care and presented with clear product information.
          </p>

          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#C89B3C] tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-[#C89B3C]" />
            <span>Quality checked</span>
          </div>
        </div>

        {/* The Pillars */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C] mb-4">
            Explore
          </h4>

          <ul className="space-y-2 text-xs text-[#FAF8F3]/80 font-medium">
            <li>
              <Link
                href="/philosophy"
                className="hover:text-white transition-colors"
              >
                Our Philosophy
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Shop Products
              </Link>
            </li>

            <li>
              <Link
                href="/bespoke"
                className="hover:text-white transition-colors"
              >
                Custom Kits
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C] mb-4">
            Help
          </h4>

          <ul className="space-y-2 text-xs text-[#FAF8F3]/80 font-medium">

            {/* Route does not exist yet — intentionally non-clickable */}
            <li>
              <span className="cursor-default hover:text-white transition-colors">
                Worldwide Shipping
              </span>
            </li>

            <li>
              <Link
                href="/purity"
                className="hover:text-white transition-colors"
              >
                Product Information
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>

          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C] mb-4">
            Subscribe
          </h4>

          <p className="text-xs text-[#FAF8F3]/70 leading-relaxed font-light mb-2">
            Get updates about products and custom kits.
          </p>

          <input
            type="email"
            placeholder="Enter your email destination..."
            className="w-full bg-white/10 border border-[#FAF8F3]/20 text-xs rounded-md p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#C89B3C]"
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#FAF8F3]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#FAF8F3]/50 tracking-widest uppercase font-bold text-center sm:text-left">
        <span>
          © 2026 Shri Ayurved Inc. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}