'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FolderTree, ShoppingBag, Box, 
  ShoppingCart, Ticket, Truck, Users, BarChart3, Settings,
  ChevronDown, ChevronRight, Menu, X, 
  TrendingUp, DollarSign, Clock, AlertTriangle, Award
} from 'lucide-react';
import '../globals.css';

const getActiveTabFromPath = (pathname: string) => {
  if (pathname.startsWith('/categories')) return 'Categories';
  if (pathname.startsWith('/products')) return 'Products';
  if (pathname.startsWith('/inventory')) return 'Inventory';
  if (pathname.startsWith('/orders')) return 'Orders';
  if (pathname.startsWith('/coupons')) return 'Coupons';
  if (pathname.startsWith('/delivery')) return 'Delivery';
  if (pathname.startsWith('/users')) return 'Users';
  if (pathname.startsWith('/analytics')) return 'Analytics Overview';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Dashboard Overview';
};

export default function MainAppLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Dashboard Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [openGroups, setOpenGroups] = useState({
    Dashboard: true, Catalog: true, Sales: true, Operations: true, Customers: true, Reports: true
  });

  useEffect(() => {
    if (pathname) {
      setActiveTab(getActiveTabFromPath(pathname));
    }
  }, [pathname]);

  const toggleGroup = (groupName: keyof typeof openGroups) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleNavigation = (route: string) => {
    router.push(route);
    setIsMobileMenuOpen(false); // Close mobile tray on link execution
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans relative overflow-x-hidden">
      
      {/* MOBILE HEADER BAR */}
      <header className="lg:hidden w-full bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-emerald-600 rounded-md rotate-45" />
          <span className="font-bold text-lg tracking-tight text-gray-900">NexaStore</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION SHEET */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0 top-16 lg:top-0' : '-translate-x-full'}
      `}>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Logo Brand Brand Area (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-2 mb-4 px-2 py-1">
            <div className="w-6 h-6 bg-emerald-600 rounded-md rotate-45" />
            <span className="font-bold text-xl tracking-tight text-gray-900">NexaStore</span>
          </div>
          
          <nav className="space-y-3">
            {/* Group: Dashboard & Widgets */}
            <div>
              <button onClick={() => toggleGroup('Dashboard')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Dashboard</span>
                {openGroups.Dashboard ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Dashboard && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                      activeTab === "Dashboard Overview" ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Overview
                  </button>
                  {[
                    { name: "Today's Revenue", icon: DollarSign },
                    { name: "Today's Orders", icon: ShoppingBag },
                    { name: "Pending Orders", icon: Clock },
                    { name: "Pending Deliveries", icon: Truck },
                    { name: "Low Stock", icon: AlertTriangle },
                    { name: "Recent Orders", icon: ShoppingCart },
                    { name: "Top Selling Products", icon: Award },
                  ].map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavigation('/dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <sub.icon className="w-3 h-3" />
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group: Catalog */}
            <div>
              <button onClick={() => toggleGroup('Catalog')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Catalog</span>
                {openGroups.Catalog ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Catalog && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  {[
                    { name: 'Categories', path: '/categories', icon: FolderTree },
                    { name: 'Products', path: '/products', icon: ShoppingBag },
                    { name: 'Inventory', path: '/inventory', icon: Box },
                  ].map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavigation(sub.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                        activeTab === sub.name ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group: Sales */}
            <div>
              <button onClick={() => toggleGroup('Sales')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Sales</span>
                {openGroups.Sales ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Sales && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  {[
                    { name: 'Orders', path: '/orders', icon: ShoppingCart },
                    { name: 'Coupons', path: '/coupons', icon: Ticket },
                  ].map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavigation(sub.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                        activeTab === sub.name ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group: Operations */}
            <div>
              <button onClick={() => toggleGroup('Operations')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Operations</span>
                {openGroups.Operations ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Operations && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  <button
                    onClick={() => handleNavigation('/delivery')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                      activeTab === "Delivery" ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Delivery
                  </button>
                </div>
              )}
            </div>

            {/* Group: Customers */}
            <div>
              <button onClick={() => toggleGroup('Customers')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Customers</span>
                {openGroups.Customers ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Customers && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  <button
                    onClick={() => handleNavigation('/users')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                      activeTab === "Users" ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Users
                  </button>
                </div>
              )}
            </div>

            {/* Group: Reports & Analytics */}
            <div>
              <button onClick={() => toggleGroup('Reports')} className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 hover:text-gray-600 cursor-pointer">
                <span>Reports</span>
                {openGroups.Reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {openGroups.Reports && (
                <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-2">
                  <button
                    onClick={() => handleNavigation('/analytics')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                      activeTab === "Analytics Overview" ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Analytics Overview
                  </button>
                  {[
                    { name: 'Revenue Metrics', icon: TrendingUp },
                    { name: 'Sales Pipeline', icon: DollarSign },
                    { name: 'Order Logs', icon: ShoppingCart },
                    { name: 'Top Products Performance', icon: Award },
                    { name: 'User Growth Curves', icon: Users },
                  ].map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavigation('/analytics')}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <sub.icon className="w-3 h-3" />
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Link */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => handleNavigation('/settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "Settings" ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </nav>
        </div>

        {/* User Account Bar Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">JD</div>
          <div className="truncate">
            <p className="text-xs font-semibold text-gray-900 truncate">James Davis</p>
            <p className="text-[10px] text-gray-400">Store Admin</p>
          </div>
        </div>
      </aside>

      {/* MOBILE DIM OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden top-16" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* DYNAMIC CANVAS VIEWS */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1400px] mx-auto">
        
        {/* Responsive Header Node */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Control Terminal</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{activeTab}</h1>
          </div>
          <div className="text-xs font-mono text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded shadow-2xs self-start sm:self-auto">
            Route: /{activeTab.toLowerCase().replace(/\s+/g, '-')}
          </div>
        </header>

        {/* Core page layouts injected directly right here */}
        {children}

      </main>
    </div>
  );
}