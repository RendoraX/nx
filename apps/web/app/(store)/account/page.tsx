'use client';

import React, { act, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  Laptop, 
  Star, 
  Check, 
  Bell, 
  ShieldCheck,
  KeyRound,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { useAuthContext } from '@/providers/AuthProviders';
import { AuthService } from '@/services/auth.service';
import { PasswordInput } from '@/components/auth/password-input';
import AccountOrdersTab from '@/components/account/order/OrderHistoryTable';
import AccountAddressesTab from '@/components/account/address/AccountIndex';
import AccountSessionsTab from '@/components/account/session/session';

type ActiveTab = 'profile' | 'orders' | 'addresses' | 'sessions' | 'reviews' | 'notifications';

const VALID_TABS: ActiveTab[] = ['profile', 'orders', 'addresses', 'sessions', 'reviews', 'notifications'];

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAuthContext();
  
  const getInitialTab = (): ActiveTab => {
    const tabParam = searchParams.get('tab') as ActiveTab;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      return tabParam;
    }
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);

  // Password Reset Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as ActiveTab;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab('profile');
    }
  }, [searchParams]);

  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabId);
    router.push(`/account?${params.toString()}`);
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmittingPassword(true);
      const res = await AuthService.resetPassword({ password });
      if (res.success) {
        setPasswordSuccess(true);
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(false);
          setPassword('');
          setConfirmPassword('');
        }, 2000);
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] antialiased flex flex-col text-gray-900 selection:bg-[#C89B3C]/20">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Header Banner */}
        <div className="border-b border-[#EAE3D2] pb-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C89B3C] uppercase mb-2 block font-mono">
                Client Portal
              </span>
              <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-[#1B3B2B] tracking-tight">
                My Account
              </h1>
              <p className="text-sm text-[#7C7467] mt-1 font-light">
                Manage your personal details, order reservations, and security preferences.
              </p>
            </div>
            <button 
              onClick={logout}
              className="self-start sm:self-auto px-5 py-2.5 border border-[#1B3B2B]/20 text-[#1B3B2B] hover:bg-[#1B3B2B] hover:text-[#FCFAF7] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Navigation Sidebar */}
          <nav className="w-full lg:w-72 flex-shrink-0 flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-[#EAE3D2] pb-4 lg:pb-0 lg:pr-8 gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'profile', label: 'Profile & Security', icon: UserIcon },
              { id: 'orders', label: 'Order History', icon: Package },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'sessions', label: 'Logged-in Devices', icon: Laptop },
              { id: 'reviews', label: 'Product Reviews', icon: Star },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`flex items-center justify-between px-4 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isSelected 
                      ? "bg-[#1B3B2B] text-[#FCFAF7] shadow-md translate-x-1" 
                      : "bg-transparent text-[#7C7467] hover:text-[#1B3B2B] hover:bg-[#1B3B2B]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 stroke-[2] ${isSelected ? 'text-[#C89B3C]' : 'text-[#7C7467]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 hidden lg:block opacity-0 transition-opacity ${isSelected ? 'opacity-100 text-[#C89B3C]' : ''}`} />
                </button>
              );
            })}
          </nav>

          {/* Tab Content Canvas */}
          <div className="flex-1 w-full">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in text-left">
                
                {/* Hero Profile Card */}
                <div className="bg-[#1B3B2B] rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl border border-[#C89B3C]/30">
                  <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#C89B3C] shadow-lg bg-[#FCFAF7] flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-12 h-12 text-[#1B3B2B]" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2.5">
                        <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-[#FCFAF7] tracking-tight">
                          {user?.name || 'Valued Member'}
                        </h2>
                        {user?.isVerified && (
                          <span className="inline-flex items-center justify-center bg-[#C89B3C] text-[#1B3B2B] p-1 rounded-full shadow" title="Verified Account">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#EAE3D2]/80 tracking-widest uppercase mt-1 font-mono">{user?.email}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 bg-[#FCFAF7]/10 backdrop-blur-md px-4 py-2 rounded-full border border-[#FCFAF7]/15">
                    <ShieldCheck className="h-4 w-4 text-[#C89B3C]" />
                    <span className="text-xs font-semibold tracking-wider text-[#FCFAF7] uppercase">
                      {user?.isVerified ? 'Verified Client' : 'Pending Verification'}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal Overview */}
                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 border-b border-[#EAE3D2] pb-4 mb-6">
                        <div className="p-2 bg-[#1B3B2B]/5 rounded-lg text-[#1B3B2B]">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-[#1B3B2B]">Personal Overview</h3>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-[#EAE3D2]/40">
                          <span className="text-[#7C7467] font-medium">Full Name</span>
                          <span className="text-[#1A1A1A] font-semibold">{user?.name || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[#EAE3D2]/40">
                          <span className="text-[#7C7467] font-medium flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-[#C89B3C]" /> Email Address
                          </span>
                          <span className="text-[#1A1A1A] font-semibold font-mono text-xs break-all">{user?.email || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-[#7C7467] font-medium flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-[#C89B3C]" /> Phone Number
                          </span>
                          <span className="text-[#1A1A1A] font-semibold">{user?.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Card */}
                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 border-b border-[#EAE3D2] pb-4 mb-6">
                        <div className="p-2 bg-[#1B3B2B]/5 rounded-lg text-[#1B3B2B]">
                          <KeyRound className="h-5 w-5" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-[#1B3B2B]">Security & Access</h3>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-[#EAE3D2]/40">
                          <span className="text-[#7C7467] font-medium">Account Status</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                            user?.isVerified 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            {user?.isVerified ? 'Active & Secure' : 'Action Required'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-[#7C7467] font-medium">Password Authorization</span>
                          <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-4 py-2 bg-[#1B3B2B] text-[#FCFAF7] text-[11px] font-bold tracking-wider uppercase rounded-lg hover:bg-[#C89B3C] hover:text-[#1B3B2B] transition-all duration-300 shadow-sm cursor-pointer"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* OTHER TABS */}
            {activeTab === 'orders' && <AccountOrdersTab orders={user?.orders}/>}
            {activeTab === 'addresses' && <AccountAddressesTab />}
            {activeTab === 'sessions' && <AccountSessionsTab />}
            {activeTab === 'reviews' && <div className="min-h-[400px] w-full flex items-center justify-center bg-[#FDFCFB] p-6">
                <div className="max-w-md w-full bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-8 lg:p-10 text-center shadow-md relative overflow-hidden">
                  
                  {/* Subtle background glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C89B3C]/10 rounded-full blur-2xl"></div>
                  
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#C89B3C] uppercase mb-3 block font-mono">
                    Under Development
                  </span>
                  
                  <h2 className="font-serif text-3xl font-semibold text-[#1B3B2B] tracking-tight mb-3">
                    Coming Soon
                  </h2>
                  
                  <p className="text-sm text-[#7C7467] font-light leading-relaxed mb-6">
                    We are crafting something exceptional for this section. Stay tuned for future updates.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3B2B]/5 rounded-full border border-[#1B3B2B]/10">
                    <span className="w-2 h-2 rounded-full bg-[#C89B3C] animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-wider text-[#1B3B2B] uppercase">
                      In Progress
                    </span>
                  </div>

                </div>
              </div>
            }
            {activeTab === 'notifications' && 
              <div className="min-h-[400px] w-full flex items-center justify-center bg-[#FDFCFB] p-6">
                <div className="max-w-md w-full bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl p-8 lg:p-10 text-center shadow-md relative overflow-hidden">
                  
                  {/* Subtle background glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C89B3C]/10 rounded-full blur-2xl"></div>
                  
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#C89B3C] uppercase mb-3 block font-mono">
                    Under Development
                  </span>
                  
                  <h2 className="font-serif text-3xl font-semibold text-[#1B3B2B] tracking-tight mb-3">
                    Coming Soon
                  </h2>
                  
                  <p className="text-sm text-[#7C7467] font-light leading-relaxed mb-6">
                    We are crafting something exceptional for this section. Stay tuned for future updates.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3B2B]/5 rounded-full border border-[#1B3B2B]/10">
                    <span className="w-2 h-2 rounded-full bg-[#C89B3C] animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-wider text-[#1B3B2B] uppercase">
                      In Progress
                    </span>
                  </div>

                </div>
              </div>
            }

          </div>
        </div>
      </main>

      {/* UPDATE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3B2B]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-2xl max-w-md w-full p-8 shadow-2xl relative text-left">
            
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-6 right-6 text-[#7C7467] hover:text-[#1B3B2B] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-xl font-semibold text-[#1B3B2B]">Update Your Password</h3>
              <p className="text-xs text-[#7C7467] mt-1 font-light">Set a new password for your account.</p>
            </div>

            {passwordSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-emerald-900">Password updated successfully!</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  disabled={isSubmittingPassword}
                  required
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  disabled={isSubmittingPassword}
                  required
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="w-full h-11 bg-[#1B3B2B] hover:bg-[#C89B3C] text-[#FCFAF7] hover:text-[#1B3B2B] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Password Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}