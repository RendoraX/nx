'use client';
import React from 'react';
import { UserItem, UserRole, UserStatus } from '@/types/users';
import { ShieldAlert, UserCheck, ShieldCheck, Ban } from 'lucide-react';

interface TableProps {
  items: UserItem[];
  loading: boolean;
  onRoleShift: (userId: string, currentRole: UserRole) => void;
  onStatusToggle: (userId: string, currentStatus: UserStatus) => void;
}

export function UserTable({ items, loading, onRoleShift, onStatusToggle }: TableProps) {
    console.log('Rendering UserTable with items:', items);
  if (loading) {
    return <div className="w-full h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-mono">Scanning system account nodes...</div>;
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider select-none">
            <th className="p-4">Identity Details</th>
            <th className="p-4">System Role</th>
            <th className="p-4 text-center">Cart Buffer Count</th>
            <th className="p-4 text-center">Reviews Logged</th>
            <th className="p-4 text-center">Account Status</th>
            <th className="p-4 text-right w-36">Administrative Toggles</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {items.map(user => {
            const cartCount = user?.cart?.items.length ?? 0;
            const reviewCount = user.reviews?.length ?? 0;

            return (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-4">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] border font-black rounded uppercase tracking-wider ${
                    user.role === 'ADMIN' ? 'text-indigo-700 bg-indigo-50 border-indigo-100' : 'text-gray-600 bg-gray-50 border-gray-200'
                  }`}>
                    {user.role === 'ADMIN' ? <ShieldCheck className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5" />}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center font-bold font-mono text-gray-900">{cartCount} items</td>
                <td className="p-4 text-center font-bold font-mono text-gray-600">{reviewCount} entries</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                    user.isVerified === true ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    {user.isVerified === true ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-1.5 h-full items-center">
                  <button
                    type="button"
                    onClick={() => onRoleShift(user.id, user.role)}
                    title="Toggle Administrative Clearance"
                    className="p-1.5 hover:bg-gray-50 text-gray-400 hover:text-indigo-600 border border-gray-200 hover:border-indigo-100 rounded-md transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusToggle(user.id, user.status)}
                    title={user.status === 'active' ? 'Suspend Account Access' : 'Reactivate Account'}
                    className={`p-1.5 border rounded-md transition-all cursor-pointer ${
                      user.status === 'active' 
                        ? 'bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border-gray-200 hover:border-rose-100' 
                        : 'bg-rose-600 hover:bg-rose-700 text-white border-transparent'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
          {!items.length && !loading && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">No account nodes matching current filters found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}