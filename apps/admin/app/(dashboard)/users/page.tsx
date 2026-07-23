'use client';
import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { UserFilters } from '@/components/users/user-filters';
import { UserTable } from '@/components/users/user-table';
import { Users2, ShieldCheck, UserX, ShieldAlert } from 'lucide-react';

export default function UsersAdministrationDashboard() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  const { users, summary, loading } = useUsers();

  // Instant client-side filtering execution (Keeps API footprint clean while typing)
  const filteredUsers = users.filter(user => {
    const nameStr = user.name?.toLowerCase() ?? '';
    const emailStr = user.email?.toLowerCase() ?? '';
    const query = search.trim().toLowerCase();

    const matchesSearch = !query || nameStr.includes(query) || emailStr.includes(query);
    const matchesRole = role === 'all' || user.role === role;
    const matchesStatus = status === 'all' || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-200 gap-2">
        <div>
          <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">Account Matrix Controls</h2>
          <p className="text-xs text-gray-400">View and audit platform user registrations securely.</p>
        </div>
      </div>

      {/* RE-ARCHITECTED SUMMARY SLABS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div><span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Accounts</span><span className="text-lg font-black text-gray-900 font-mono mt-0.5 block">{summary.total}</span></div>
          <div className="p-2 bg-gray-50 text-gray-600 rounded-lg border border-gray-100"><Users2 className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div><span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Active Admins</span><span className="text-lg font-black text-indigo-600 font-mono mt-0.5 block">{summary.admins}</span></div>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100"><ShieldCheck className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div><span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Suspended Accounts</span><span className="text-lg font-black text-rose-600 font-mono mt-0.5 block">{summary.suspended}</span></div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100"><UserX className="w-4 h-4" /></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
          <div><span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px]">Unverified Credentials</span><span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">{summary.unverified}</span></div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100"><ShieldAlert className="w-4 h-4" /></div>
        </div>
      </div>

      <UserFilters 
        search={search} setSearch={setSearch} 
        role={role} setRole={setRole} 
        status={status} setStatus={setStatus} 
      />

      <UserTable 
        items={filteredUsers} 
        loading={loading} 
        onRoleShift={() => {}} // Disabled as requested
        onStatusToggle={() => {}} // Disabled as requested
      />
    </div>
  );
}