'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  Laptop, 
  Trash2, 
  Star, 
  Check, 
  Bell, 
  Clock,
  AlertCircle
} from 'lucide-react';

import { useAuthContext } from '@/providers/AuthProviders';
import AccountOrdersTab from '@/components/account/order/OrderHistoryTable';
import AccountAddressesTab from '@/components/account/address/AccountIndex';

type ActiveTab = 'profile' | 'orders' | 'addresses' | 'sessions' | 'reviews' | 'notifications';

const VALID_TABS: ActiveTab[] = ['profile', 'orders', 'addresses', 'sessions', 'reviews', 'notifications'];

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout, logoutAll } = useAuthContext();
  
  const getInitialTab = (): ActiveTab => {
    const tabParam = searchParams.get('tab') as ActiveTab;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      return tabParam;
    }
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [sessions, setSessions] = useState<any[]>([]);

  const currentSessionId = user?.currentSessionId || null;

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

  useEffect(() => {
    if (user) {
      setSessions(user.sessions || []);
    }
  }, [user]);

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(sess => sess.id !== id));
  };

  const handleRevokeAllOtherSessions = async () => {
    try {
      await logoutAll();
    } catch (error) {
      console.error('Failed to revoke other sessions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 antialiased flex flex-col text-gray-900">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="border-b border-gray-200 pb-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your profile, orders, and security settings.</p>
            </div>
            <button 
              onClick={logout}
              className="self-start sm:self-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <nav className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-6 gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'profile', label: 'Profile & Security', icon: UserIcon },
              { id: 'orders', label: 'Order History', icon: Package },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'sessions', label: 'Logged-in Devices', icon: Laptop },
              { id: 'reviews', label: 'My Reviews', icon: Star },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                    isSelected 
                      ? "bg-green-700 text-white" 
                      : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 stroke-[2]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex-1 w-full">
            
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="bg-[#1B3B2B] border border-[#1B3B2B] rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                  
                  <div className="relative z-10 space-y-4">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#C89B3C] shadow-md bg-white flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-[#1B3B2B]" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="font-serif text-2xl font-semibold text-[#FCFAF7] tracking-tight">
                          {user?.name || 'User Profile'}
                        </h2>
                        {user?.isVerified && (
                          <span className="inline-flex items-center justify-center bg-[#C89B3C] text-[#1B3B2B] p-0.5 rounded-full">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#EAE3D2] tracking-wide mt-1 font-mono">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-[#1B3B2B]/5 px-6 py-4 border-b border-[#EAE3D2]">
                      <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em]">Personal Details</h4>
                    </div>
                    <div className="p-6 divide-y divide-[#EAE3D2]/60 text-sm">
                      <div className="py-3 flex justify-between gap-4 first:pt-0">
                        <span className="text-[#7C7467] font-medium">Full Name:</span>
                        <span className="text-[#1A1A1A] font-semibold">{user?.name || '—'}</span>
                      </div>
                      <div className="py-3 flex justify-between gap-4">
                        <span className="text-[#7C7467] font-medium">Email:</span>
                        <span className="text-[#1A1A1A] font-semibold break-all">{user?.email || '—'}</span>
                      </div>
                      <div className="py-3 flex justify-between gap-4 last:pb-0">
                        <span className="text-[#7C7467] font-medium">Phone Number:</span>
                        <span className="text-[#1A1A1A] font-semibold">{user?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-[#1B3B2B]/5 px-6 py-4 border-b border-[#EAE3D2]">
                      <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em]">Account Details</h4>
                    </div>
                    <div className="p-6 divide-y divide-[#EAE3D2]/60 text-sm">
                      <div className="py-3 flex justify-between gap-4 first:pt-0">
                        <span className="text-[#7C7467] font-medium">Account Authority Tier:</span>
                        <span className="text-[#1B3B2B] font-bold tracking-wider uppercase text-xs bg-[#1B3B2B]/5 px-2.5 py-0.5 border border-[#1B3B2B]/10 rounded">
                          {user?.role || 'USER'}
                        </span>
                      </div>
                      <div className="py-3 flex justify-between gap-4">
                        <span className="text-[#7C7467] font-medium">Account Verification:</span>
                        <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded border ${
                          user?.isVerified 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {user?.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="py-3 flex justify-between gap-4 last:pb-0">
                        <span className="text-[#7C7467] font-medium">Created Timestamp:</span>
                        <span className="text-[#1A1A1A] font-semibold">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-[#1B3B2B]/5 px-6 py-4 border-b border-[#EAE3D2]">
                      <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em]">Security Settings</h4>
                    </div>
                    <div className="p-6 divide-y divide-[#EAE3D2]/60 text-sm">
                      <div className="py-3 flex justify-between items-center gap-4 first:pt-0">
                        <span className="text-[#7C7467] font-medium">Password Authorization:</span>
                        <button className="px-3 py-1 bg-[#1B3B2B] text-[#FCFAF7] text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#1B3B2B]/90 transition-colors shadow-sm cursor-pointer">
                          Reset Password
                        </button>
                      </div>
                      <div className="py-3 flex justify-between gap-4 last:pb-0">
                        <span className="text-[#7C7467] font-medium">Connected Active Sessions:</span>
                        <span className="text-[#1A1A1A] font-semibold font-mono">
                          {user?.sessions?.filter((s: any) => !s.revoked).length || 0} Tracks Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-[#1B3B2B]/5 px-6 py-4 border-b border-[#EAE3D2]">
                      <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-[0.1em]">Platform Context</h4>
                    </div>
                    <div className="p-6 divide-y divide-[#EAE3D2]/60 text-sm">
                      <div className="py-3 flex justify-between gap-4 first:pt-0">
                        <span className="text-[#7C7467] font-medium">Linked Addresses:</span>
                        <span className="text-[#1A1A1A] font-semibold">{user?.addresses?.length || 0} Saved</span>
                      </div>
                      <div className="py-3 flex justify-between gap-4">
                        <span className="text-[#7C7467] font-medium">Submitted Reviews:</span>
                        <span className="text-[#1A1A1A] font-semibold">{user?.reviews?.length || 0} Items</span>
                      </div>
                      <div className="py-3 flex justify-between gap-4 last:pb-0">
                        <span className="text-[#7C7467] font-medium">Pending Notifications:</span>
                        <span className="text-[#1A1A1A] font-semibold">
                          {user?.notifications?.filter((n: any) => !n.isRead).length || 0} Unread
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <AccountOrdersTab orders={user?.orders}/>
            )}

            {activeTab === 'addresses' && (
              <AccountAddressesTab />
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4 text-left">
                <div className="border-b border-gray-200 pb-3 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Logged-in Devices</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and manage the devices currently logged into your account.</p>
                  </div>
                  {sessions.filter(sess => sess.id !== currentSessionId && !sess.revoked).length > 0 && (
                    <button
                      onClick={handleRevokeAllOtherSessions}
                      className="self-start sm:self-auto px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Log Out All Other Devices
                    </button>
                  )}
                </div>

                {sessions.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No active login sessions found.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-sm">
                    {sessions.map((sess) => {
                      const isExpired = new Date(sess.expiresAt) < new Date();
                      const isCurrentSession = sess.id === currentSessionId;
                      
                      return (
                        <div key={sess.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${sess.revoked || isExpired ? 'opacity-50 bg-gray-50' : ''}`}>
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-md text-green-700">
                              <Laptop className="h-5 w-5 stroke-[2]" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-gray-900">{sess.userAgent || 'Unknown Browser / Device'}</p>
                                {isCurrentSession && !sess.revoked && !isExpired && (
                                  <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">Current Active Session</span>
                                )}
                                {!isCurrentSession && !sess.revoked && !isExpired && (
                                  <span className="text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">Other Active Device</span>
                                )}
                                {(sess.revoked || isExpired) && (
                                  <span className="text-[10px] font-bold bg-gray-100 border border-gray-300 text-gray-500 px-2 py-0.5 rounded-full">Logged Out</span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-gray-500">
                                <span>IP Address: {sess.ipAddress || 'Unknown IP'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Last Active: {sess.lastUsedAt ? new Date(sess.lastUsedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                </span>
                              </div>
                            </div>
                          </div>
                          {!sess.revoked && !isExpired && (
                            <button 
                              onClick={() => handleRevokeSession(sess.id)}
                              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-md transition-colors cursor-pointer self-start sm:self-auto"
                            >
                              Log Out Device
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 text-left">
                <div className="border-b border-gray-200 pb-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Your Product Reviews</h3>
                </div>

                {!user?.reviews || user.reviews.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
                    <Star className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">You haven't written any reviews yet.</p>
                  </div>
                ) : (
                  user.reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 shadow-sm">
                      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">{rev.product?.name || 'Product'}</h4>
                          <span className="text-xs text-gray-400 block mt-0.5">Reviewed on: {new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic font-light">"{rev.comment || 'No written review text provided.'}"</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 text-left">
                <div className="border-b border-gray-200 pb-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Account Notifications</h3>
                </div>

                {!user?.notifications || user.notifications.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Your notifications inbox is empty.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 shadow-sm">
                    {user.notifications.map((notif: any) => (
                      <div key={notif.id} className={`p-6 space-y-1.5 transition-colors ${!notif.isRead ? 'bg-green-50/40' : ''}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                          <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-light leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}