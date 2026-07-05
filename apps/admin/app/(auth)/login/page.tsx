"use client";

import React, { useState } from 'react';
import image from './hero.png';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading , setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loginData = {
        email,
        password,
      };
      const result = await axios.post(`http://localhost:4000/api/auth/login` , loginData , {
        withCredentials: true,
      })

      console.log('Login Data:', result);
      toast.success('Login successful!');
    } catch (error:any) {
      console.error('Login Error:', error.message | error);
      toast.error('Login failed. Please check your credentials and try again.');
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:fixed lg:inset-0 lg:overflow-hidden select-none bg-[#FAF8F2] flex flex-col lg:flex-row font-['Plus_Jakarta_Sans'] text-[#55635A]">
      
      {/* LEFT PANEL: Hero Section */}
      <div className="relative w-full lg:w-1/2 min-h-[45vh] lg:h-full flex flex-col justify-between p-6 sm:p-10 lg:p-[5%] overflow-hidden bg-[#FAF8F2]">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center mix-blend-multiply opacity-90 pointer-events-none"
          style={{ 
            backgroundImage: `url(${image.src})`, 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F2] via-transparent to-transparent z-0" />

        <div className="relative z-10 max-w-xl mt-4 lg:mt-6">
          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl lg:text-[3.85vw] font-medium text-[#27332A] leading-[1.15] lg:leading-[1.12] tracking-normal">
            Rooted in <span className="text-[#4E6B52] font-semibold">Nature.</span><br />
            Guided by <span className="text-[#6B8F71] italic font-normal">Tradition.</span>
          </h1>
          
          <div className="flex items-center gap-3 my-4 lg:my-6">
            <div className="h-[1px] w-12 bg-[#C6A15B]/40"></div>
            <span className="text-[#C6A15B] text-xs">❀</span>
            <div className="h-[1px] w-12 bg-[#C6A15B]/40"></div>
          </div>

          <p className="text-sm sm:text-base lg:text-[1.05vw] text-[#55635A] max-w-sm font-light leading-relaxed">
            Premium Ayurvedic herbs and authentic puja products, crafted for a better tomorrow.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-1 bg-white/80 backdrop-blur-md border border-[#E8E5DC] rounded-2xl p-4 sm:p-6 shadow-sm w-full max-w-lg mt-8 lg:mt-0 lg:mb-4">
          <div className="flex flex-col items-center text-center px-0.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F2F7F1] flex items-center justify-center text-[#4E6B52] mb-2">
              <span className="text-xs sm:text-sm">🌱</span>
            </div>
            <h4 className="font-bold text-[11px] sm:text-xs text-[#27332A] mb-0.5">Pure & Natural</h4>
            <p className="text-[9px] sm:text-[10px] text-[#8A968D]">Carefully Sourced</p>
          </div>

          <div className="flex flex-col items-center text-center px-0.5 border-x border-[#ECEEE9]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F2F7F1] flex items-center justify-center text-[#4E6B52] mb-2">
              <span className="text-xs sm:text-sm">🛡️</span>
            </div>
            <h4 className="font-bold text-[11px] sm:text-xs text-[#27332A] mb-0.5">Trusted & Authentic</h4>
            <p className="text-[9px] sm:text-[10px] text-[#8A968D]">Quality You Can Trust</p>
          </div>

          <div className="flex flex-col items-center text-center px-0.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F2F7F1] flex items-center justify-center text-[#4E6B52] mb-2">
              <span className="text-xs sm:text-sm">🧘</span>
            </div>
            <h4 className="font-bold text-[11px] sm:text-xs text-[#27332A] mb-0.5">Tradition & Wellness</h4>
            <p className="text-[9px] sm:text-[10px] text-[#8A968D]">Rooted in Ayurveda</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Container */}
      <div className="w-full lg:w-1/2 min-h-[55vh] lg:h-full flex flex-col justify-between items-center p-6 sm:p-10 lg:p-8 bg-[#F7F9F6] ayurvedic-pattern-bg relative">
        
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-80 sm:h-80 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="#4E6B52" strokeWidth="0.5">
            <path d="M0,100 Q40,60 100,0 M40,60 Q70,30 100,0 M20,80 Q50,50 70,30" />
          </svg>
        </div>

        <div className="hidden lg:block h-2" />

        {/* Card Frame */}
        <div className="w-full max-w-[450px] bg-white border border-[#E7ECE5] rounded-[24px] p-6 sm:p-10 shadow-xl shadow-slate-900/[0.015] relative z-10 my-auto">
          
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="mb-2 text-[#4E6B52]">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M32 8C32 8 44 20 44 32C44 40.8366 38.6274 48 32 48C25.3726 48 20 40.8366 20 32C20 20 32 8 32 8Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 18C32 18 38 26 38 32" fill="currentColor" fillOpacity="0.1"/>
              </svg>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#27332A] tracking-[0.18em] uppercase">Ayurveda</h2>
            <h3 className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#C6A15B] uppercase font-semibold mt-0.5">Natural Healing</h3>
            
            <div className="flex items-center gap-2 my-3 sm:my-4 w-1/4">
              <div className="h-[1px] w-full bg-[#E7ECE5]"></div>
              <span className="text-[#C6A15B] text-[10px]">❀</span>
              <div className="h-[1px] w-full bg-[#E7ECE5]"></div>
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-medium text-[#27332A] mt-1">Welcome Back!</h1>
            <p className="text-xs text-[#8A968D] mt-1">Sign in to access your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#27332A] uppercase tracking-wider block">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 z-20 text-[#8A968D] pointer-events-none">
                  <Mail size={17} strokeWidth={2} />
                </span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="admin-input-premium !pl-12 relative z-10 w-full" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#27332A] uppercase tracking-wider block">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 z-20 text-[#8A968D] pointer-events-none">
                  <Lock size={17} strokeWidth={2} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="admin-input-premium !pl-12 !pr-12 relative z-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 z-20 flex items-center text-[#8A968D] hover:text-[#4E6B52] transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#55635A]">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#6B8F71] rounded border-[#E7ECE5] cursor-pointer"
                />
                Remember Me
              </label>
              <a href="#forgot" className="font-semibold text-[#C6A15B] hover:text-[#a07f43] transition-colors">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="admin-btn-submit group mt-2" disabled={isLoading}>
            {
              isLoading ? <LoaderCircle/> : <span>Login</span>
            }
              <ArrowRight size={17} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          <div className="mt-6 sm:mt-7 flex items-center justify-center gap-2 text-[10px] text-[#8A968D] font-bold uppercase tracking-wider">
            <div className="h-[1px] w-8 sm:w-10 bg-[#ECEEE9]"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B8F71]">🛡️</span> Secure Admin Access
            </div>
            <div className="h-[1px] w-8 sm:w-10 bg-[#ECEEE9]"></div>
          </div>

        </div>

        <div className="w-full text-center text-[11px] text-[#8A968D] font-light py-4 lg:py-2 mt-4 lg:mt-0">
          © {new Date().getFullYear()} Ayurveda Natural Healing. All rights reserved.
        </div>

      </div>

    </div>
  );
}