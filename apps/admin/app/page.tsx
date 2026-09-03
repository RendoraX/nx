// apps/web/app/admin/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Tag, 
  BarChart3, 
  Settings, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Loader2
} from "lucide-react";

const ADMIN_NAVIGATION_NODES = [
  {
    title: "Main Dashboard",
    description: "Overview metrics, real-time store performance, and analytics summaries.",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "Primary",
    highlight: true,
  },
  {
    title: "Orders Management",
    description: "Track processing status, manage shipments, and update order fulfillments.",
    href: "/admin/orders",
    icon: ShoppingBag,
    badge: "Live Streams",
    highlight: false,
  },
  {
    title: "Products Catalog",
    description: "Add new inventory, configure price tiers, manage variants, and track stock.",
    href: "/admin/products",
    icon: Package,
    badge: "Inventory",
    highlight: false,
  },
  {
    title: "Categories & Tags",
    description: "Organize store navigation hierarchy, purity attributes, and collection tags.",
    href: "/admin/categories",
    icon: Tag,
    badge: "Structure",
    highlight: false,
  },
  {
    title: "Customer Directory",
    description: "View registered users, inspect wishlists, and manage account privileges.",
    href: "/admin/users",
    icon: Users,
    badge: "Accounts",
    highlight: false,
  },
  {
    title: "Sales & Analytics",
    description: "Comprehensive financial reporting, dynamic export controls, and sales charts.",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: "Reports",
    highlight: false,
  },
  {
    title: "System Settings",
    description: "Configure store parameters, operational rules, and API connection keys.",
    href: "/admin/settings",
    icon: Settings,
    badge: "Config",
    highlight: false,
  },
];

export default function AdminHomePage() {
  const router = useRouter();

  // Redirect to Dashboard by default upon mounting
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#2B2B2B] antialiased selection:bg-[#C89B3C]/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Operational Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE3D2] pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#1F5E3B] text-white text-[9px] font-mono font-bold tracking-[0.2em] px-2.5 py-1 uppercase rounded-none">
                Atelier System
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C7467] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" /> Authenticated Admin Node
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2B2B] font-normal tracking-tight">
              Shri Vishwanath Management Console
            </h1>
          </div>

          <div className="flex items-center space-x-3 bg-white border border-[#EAE3D2] p-3 rounded-none shadow-2xs">
            <Loader2 className="w-4 h-4 text-[#1F5E3B] animate-spin" />
            <span className="text-xs font-mono text-[#7C7467] uppercase tracking-wider">
              Redirecting to Dashboard...
            </span>
          </div>
        </div>

        {/* Navigation Grid Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADMIN_NAVIGATION_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <Link
                key={node.href}
                href={node.href}
                className={`group p-6 rounded-none border transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer ${
                  node.highlight
                    ? "bg-gradient-to-br from-[#1F5E3B]/5 to-white border-[#1F5E3B] ring-1 ring-[#1F5E3B]/20"
                    : "bg-white border-[#EAE3D2] hover:border-[#1F5E3B]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-none border ${
                      node.highlight 
                        ? "bg-[#1F5E3B] text-white border-[#1F5E3B]" 
                        : "bg-[#FCFAF7] text-[#1F5E3B] border-[#EAE3D2] group-hover:border-[#1F5E3B]"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.15em] px-2.5 py-1 border border-[#EAE3D2] bg-[#FCFAF7] text-[#7C7467]">
                      {node.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-serif text-[#2B2B2B] group-hover:text-[#1F5E3B] transition-colors flex items-center gap-2">
                      {node.title}
                      {node.highlight && <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />}
                    </h2>
                    <p className="text-xs text-[#7C7467] font-light leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#EAE3D2]/60 flex items-center justify-between text-xs font-mono uppercase tracking-[0.15em] text-[#1F5E3B] font-bold">
                  <span>Access Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}