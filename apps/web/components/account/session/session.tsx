'use client';

import React, { useState } from 'react';
import { Laptop, Trash2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useSessions } from '@/hooks/useSession';

export default function AccountSessionsTab() {
  const {
    sessions,
    currentSessionId,
    isLoading,
    isProcessing,
    revokeSession,
    revokeAllOtherSessions,
  } = useSessions();

  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevokeSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to log out this device?")) return;
    try {
      setRevokingId(sessionId);
      await revokeSession(sessionId);
    } catch (error) {
      console.error("Could not revoke device:", error);
      alert("Failed to log out device.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!window.confirm("Are you sure you want to log out all other active devices?")) return;
    try {
      await revokeAllOtherSessions();
    } catch (error) {
      console.error("Could not revoke other devices:", error);
      alert("Failed to log out other devices.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 text-left animate-pulse">
        <div className="border-b border-gray-200 pb-3 mb-2 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
            <div className="h-3.5 w-80 bg-gray-100 rounded-md"></div>
          </div>
          <div className="h-9 w-44 bg-gray-200 rounded-md"></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-sm">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="space-y-2">
                  <div className="h-4 w-60 bg-gray-200 rounded-md"></div>
                  <div className="h-3 w-40 bg-gray-100 rounded-md"></div>
                </div>
              </div>
              <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Safe string normalization helper to avoid type/case mismatch false-negatives
  const isMatchCurrentSession = (sessionId: string) => {
    if (!currentSessionId || !sessionId) return false;
    return String(sessionId) === String(currentSessionId);
  };

  // Count active non-current sessions
  const activeOtherSessionsCount = sessions.filter(
    (sess) => !isMatchCurrentSession(sess.id) && !sess.revoked && new Date(sess.expiresAt) > new Date()
  ).length;

  return (
    <div className="space-y-4 text-left">
      <div className="border-b border-gray-200 pb-3 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Logged-in Devices</h3>
          <p className="text-sm text-gray-500 mt-1">Review and manage the devices currently logged into your account.</p>
        </div>
        {activeOtherSessionsCount > 0 && (
          <button
            onClick={handleRevokeAllOtherSessions}
            disabled={isProcessing}
            className="self-start sm:self-auto px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Log Out All Other Devices
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
          {[...sessions]
            // Fixed sort formula: moves current active session cleanly to top (index 0)
            .sort((a, b) => (isMatchCurrentSession(b.id) ? 1 : 0) - (isMatchCurrentSession(a.id) ? 1 : 0))
            .map((sess) => {
              const isExpired = new Date(sess.expiresAt) < new Date();
              const isCurrentSession = isMatchCurrentSession(sess.id);
              const isItemRevoking = revokingId === sess.id;

              return (
                <div
                  key={sess.id}
                  className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    sess.revoked || isExpired ? 'opacity-50 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-md text-green-700">
                      <Laptop className="h-5 w-5 stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {sess.userAgent || 'Unknown Browser / Device'}
                        </p>
                        {isCurrentSession && !sess.revoked && !isExpired && (
                          <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                            Current Active Session
                          </span>
                        )}
                        {!isCurrentSession && !sess.revoked && !isExpired && (
                          <span className="text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                            Other Active Device
                          </span>
                        )}
                        {(sess.revoked || isExpired) && (
                          <span className="text-[10px] font-bold bg-gray-100 border border-gray-300 text-gray-500 px-2 py-0.5 rounded-full">
                            Logged Out
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-gray-500">
                        <span>IP Address: {sess.ipAddress || 'Unknown IP'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Last Active:{' '}
                          {sess.lastUsedAt
                            ? new Date(sess.lastUsedAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button is strictly hidden on current session */}
                  {!sess.revoked && !isExpired && !isCurrentSession && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      disabled={isProcessing || isItemRevoking}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-md transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {isItemRevoking && <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />}
                      Log Out Device
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}