// apps/web/components/layout/header.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '../../providers/AuthProviders';
import { 
  Sparkles, Menu, X, Search, Globe, Heart, ShoppingBag, User, LogOut, Loader2,
  Package, MapPin, Laptop, Star, Bell, Settings
} from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, loading, isAuthenticated, logout } = useAuthContext();

  // Close the desktop dropdown menu when clicking anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Announcement Strip */}
      <div className="bg-[#1B3B2B] text-[#FCFAF7] text-[10px] py-1.5 px-4 text-center font-medium tracking-[0.2em] uppercase border-b border-[#EAE3D2]/20 flex items-center justify-center gap-2">
        <Sparkles className="h-3 w-3 text-[#C89B3C]" />
        <span>Purity Is Our Pride • Fast Worldwide Handling • Traditional Sourcing</span>
      </div>

      {/* Header Container */}
      <header className="sticky top-0 z-50 bg-[#FCFAF7]/90 backdrop-blur-md border-b border-[#EAE3D2] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-1.5 text-[#1A1A1A] hover:text-[#1B3B2B] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 stroke-[1.5]" /> : <Menu className="h-5 w-5 stroke-[1.5]" />}
            </button>
            <Link href="/" className="text-left focus:outline-none">
              <span className="font-serif text-lg md:text-xl font-normal tracking-tight text-[#1B3B2B] block">Shri Ayurved</span>
            </Link>
          </div>

          {/* Premium Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by Formulation, Herb, Ritual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EAE3D2] text-[11px] rounded-none pl-3 pr-10 py-1.5 focus:outline-none focus:border-[#1B3B2B] text-[#1A1A1A] tracking-wide placeholder-[#A39785]"
            />
            <div className="absolute right-2.5 top-2 flex items-center gap-1.5 text-[#A39785]">
              <Search className="h-3.5 w-3.5 stroke-[1.5]" />
            </div>
          </div>

          {/* Navigation Items & User Dashboard Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#7C7467] mr-4">
              <Link href="/philosophy" className="hover:text-[#1B3B2B] transition-colors duration-300">Philosophy</Link>
              <Link href="/products" className="text-[#1B3B2B] font-semibold tracking-[0.2em]">Shop</Link>
              <Link href="/bespoke" className="hover:text-[#1B3B2B] transition-colors duration-300">Bespoke Kit</Link>
            </nav>

            <div className="h-3 w-[1px] bg-[#EAE3D2] hidden lg:block mr-2"></div>

            <button className="p-1.5 text-[#1A1A1A] hover:text-[#1B3B2B] flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest focus:outline-none transition-colors duration-300">
              <Globe className="h-3.5 w-3.5 text-[#A39785] stroke-[1.5]" />
              <span className="hidden sm:inline text-[#7C7467]">EN</span>
            </button>

            <Link href={isAuthenticated ? "/account/wishlist" : "/login?redirectTo=/account/wishlist"} className="p-1.5 text-[#1A1A1A] hover:text-[#1B3B2B] transition-colors duration-300">
              <Heart className="h-3.5 w-3.5 stroke-[1.5]" />
            </Link>

            <Link href="/cart" className="p-1.5 text-[#1A1A1A] hover:text-[#1B3B2B] relative transition-colors duration-300">
              <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#1B3B2B] rounded-full"></span>
            </Link>

            {/* Auth Conditional Context Handshake Node */}
            <div className="flex items-center gap-1 border-l border-[#EAE3D2] pl-1 ml-1 relative" ref={dropdownRef}>
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A39785] m-1.5" />
              ) : isAuthenticated ? (
                <>
                  {/* Account Name Dropdown Trigger Button */}
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-1.5 text-[#1B3B2B] flex items-center gap-1 text-[11px] font-medium transition-colors duration-300 focus:outline-none cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span className="hidden xl:inline max-w-[75px] truncate">{user?.name}</span>
                  </button>

                  {/* Responsive Absolute Float Dropdown Card (Desktop Context) */}
                  {dropdownOpen && (
                    <div className="hidden lg:block absolute right-0 top-full mt-2 w-56 bg-[#FCFAF7] border border-[#EAE3D2] shadow-md divide-y divide-[#EAE3D2] text-left z-50">
                      <div className="px-4 py-2.5">
                        <p className="text-[10px] uppercase font-semibold text-[#A39785] tracking-wider">Signed in as</p>
                        <p className="text-xs font-medium text-[#1B3B2B] truncate mt-0.5">{user?.name}</p>
                      </div>
                      <div className="py-1 flex flex-col">
                        <Link href="/account" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <Settings className="h-3.5 w-3.5 stroke-[1.5]" /> Account Settings
                        </Link>
                        <Link href="/account?tab=orders" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <Package className="h-3.5 w-3.5 stroke-[1.5]" /> Order History
                        </Link>
                        <Link href="/account?tab=addresses" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <MapPin className="h-3.5 w-3.5 stroke-[1.5]" /> Saved Addresses
                        </Link>
                        <Link href="/account?tab=sessions" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <Laptop className="h-3.5 w-3.5 stroke-[1.5]" /> Logged-in Devices
                        </Link>
                        <Link href="/account?tab=reviews" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <Star className="h-3.5 w-3.5 stroke-[1.5]" /> My Reviews
                        </Link>
                        <Link href="/account?tab=notifications" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5 font-medium flex items-center gap-2.5 transition-colors">
                          <Bell className="h-3.5 w-3.5 stroke-[1.5]" /> Notifications
                        </Link>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-[11px] font-medium text-red-700 hover:bg-red-50 flex items-center gap-2.5 text-left cursor-pointer transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5 stroke-[1.5]" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login" className="p-1.5 text-[#1A1A1A] hover:text-[#1B3B2B] transition-colors duration-300">
                  <User className="h-3.5 w-3.5 stroke-[1.5]" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu Layout */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE3D2] bg-[#FCFAF7] px-6 py-5 space-y-4 shadow-sm transition-all duration-300 divide-y divide-[#EAE3D2]/60">
            <div className="space-y-3 pb-3">
              <Link href="/philosophy" onClick={() => setMobileMenuOpen(false)} className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#7C7467] hover:text-[#1B3B2B]">Philosophy</Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#1B3B2B]">Shop</Link>
              <Link href="/bespoke" onClick={() => setMobileMenuOpen(false)} className="block text-[11px] uppercase tracking-[0.2em] font-medium text-[#7C7467] hover:text-[#1B3B2B]">Bespoke Kit</Link>
            </div>
            <div className="pt-4 space-y-2.5 text-left">
              {isAuthenticated ? (
                <>
                  <p className="text-[10px] uppercase font-semibold text-[#A39785] tracking-wider pl-1">Dashboard Menu ({user?.name})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <Settings className="h-3.5 w-3.5 stroke-[1.5]" /> Account Settings
                    </Link>
                    <Link href="/account?tab=orders" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 stroke-[1.5]" /> Order History
                    </Link>
                    <Link href="/account?tab=addresses" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 stroke-[1.5]" /> Saved Addresses
                    </Link>
                    <Link href="/account?tab=sessions" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <Laptop className="h-3.5 w-3.5 stroke-[1.5]" /> Logged-in Devices
                    </Link>
                    <Link href="/account?tab=reviews" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 stroke-[1.5]" /> My Reviews
                    </Link>
                    <Link href="/account?tab=notifications" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-[11px] text-[#7C7467] hover:text-[#1B3B2B] font-medium flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 stroke-[1.5]" /> Notifications
                    </Link>
                  </div>
                  <div className="pt-3 border-t border-[#EAE3D2]/40 mt-2">
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }} 
                      className="w-full py-2 bg-red-50 text-red-700 text-center rounded text-[11px] uppercase tracking-wider font-semibold cursor-pointer border border-red-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-center w-full py-2 bg-[#1B3B2B] text-white text-[11px] uppercase tracking-wider font-semibold rounded"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}