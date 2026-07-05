'use client'
import React, { useState } from 'react';
import { 
  LayoutDashboard, FolderTree, ShoppingBag, Box, 
  ShoppingCart, Ticket, Truck, Users, BarChart3, Settings,
  ChevronDown, ChevronRight, Search, Plus, Menu, X, 
  TrendingUp, DollarSign, Clock, AlertTriangle, Award
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation groupings collapsible state hooks
  const [openGroups, setOpenGroups] = useState({
    Dashboard: true,
    Catalog: true,
    Sales: true,
    Operations: true,
    Customers: true,
    Reports: true
  });

  const toggleGroup = (groupName : any) => {
    setOpenGroups((prev : any) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleTabChange = (tabName : any) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); // Close mobile drawer on selection
  };

  return (
    <h1>DashBoard</h1>
  );
}