import React from 'react';
import { LayoutDashboard, ShoppingBag, ShoppingCart, DollarSign, Users, BarChart3, Store, CreditCard, Settings, HelpCircle, ChevronDown, ArrowUpRight } from 'lucide-react';

export default function Sidebar({ isOpen , toggleMobileSidebar } : {isOpen : boolean, toggleMobileSidebar: () => void }) {
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
    { icon: <ShoppingBag size={18} />, label: 'Products', hasSub: true },
    { 
      icon: <ShoppingCart size={18} />, 
      label: 'Orders', 
      hasSub: true, 
      isOpen: true,
      subItems: ['All Orders', 'Returns', 'Order Tracking'] 
    },
    { icon: <DollarSign size={18} />, label: 'Sales' },
    { icon: <Users size={18} />, label: 'Customers' },
    { icon: <BarChart3 size={18} />, label: 'Reports' },
  ];

  const settingsItems = [
    { icon: <Store size={18} />, label: 'Marketplace Sync' },
    { icon: <CreditCard size={18} />, label: 'Payment Gateways' },
    { icon: <Settings size={18} />, label: 'Settings', hasSub: true },
    { icon: <HelpCircle size={18} />, label: 'Help Center' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#ECEEE9] flex flex-col justify-between p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <span className="font-bold text-xl text-[#27332A]">Prodex</span>
          </div>
          <button onClick={toggleMobileSidebar} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded">✕</button>
        </div>

        {/* Workspace Switcher */}
        <div className="flex items-center justify-between bg-[#F7F9F6] border border-[#ECEEE9] rounded-xl p-2.5 mb-6 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center text-white text-[10px] font-bold">W</div>
            <span className="text-sm font-semibold text-[#27332A]">Uxerflow</span>
          </div>
          <ChevronDown size={14} className="text-[#8A968D]" />
        </div>

        {/* Main Navigation */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968D] px-3 block mb-2">Main</span>
            <nav className="space-y-1">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active && !item.subItems ? 'bg-[#F2F7F1] text-[#4E6B52]' : 'text-[#55635A] hover:bg-[#F7F9F6]'}`}>
                    <div className="flex items-center gap-2E px-0.5">
                      <span className={item.active ? 'text-[#4E6B52]' : 'text-[#8A968D]'}>{item.icon}</span>
                      <span className="ml-2">{item.label}</span>
                    </div>
                    {item.hasSub && <ChevronDown size={14} className="text-[#8A968D]" />}
                  </button>
                  {item.subItems && (
                    <div className="mt-1 ml-7 pl-3 border-l border-[#ECEEE9] space-y-1">
                      {item.subItems.map((sub, sIdx) => (
                        <a key={sIdx} href="#" className={`block py-1.5 text-xs font-medium rounded-lg ${sub === 'All Orders' ? 'text-[#4E6B52] font-semibold' : 'text-[#8A968D] hover:text-[#27332A]'}`}>{sub}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Settings Section */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968D] px-3 block mb-2">Settings</span>
            <nav className="space-y-1">
              {settingsItems.map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#55635A] hover:bg-[#F7F9F6] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8A968D]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.hasSub && <ChevronDown size={14} className="text-[#8A968D]" />}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Upgrades */}
      <div className="space-y-4 pt-4 border-t border-[#ECEEE9]">
        <div className="flex items-center justify-between px-2 text-sm text-[#55635A]">
          <div className="flex items-center gap-2"><span>🌙</span><span>Dark Mode</span></div>
          <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-3.5 h-3.5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" /></div>
        </div>
        <div className="bg-[#F2F7F1] border border-[#E7ECE5] rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-[#27332A]">Upgrade to</span>
            <span className="bg-[#4F46E5] text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">Premium</span>
          </div>
          <p className="text-[11px] text-[#8A968D] mb-3">Your Premium Account will expire in <span className="font-semibold text-[#27332A]">18 days</span>.</p>
          <button className="w-full bg-[#27332A] text-white py-2 rounded-xl text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-1">Upgrade Now <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </aside>
  );
}