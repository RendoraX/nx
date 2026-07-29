'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { sessionService, SessionPayload } from '../services/session.service';
import { useAuthContext } from '@/providers/AuthProviders';

export function useSessions() {
  const { user, setUser } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  // Read current active session ID from user context or JWT payload
  const currentSessionId: string | undefined = user?.currentSessionId;

  // Single source of truth derived from global user context
  const sessions: SessionPayload[] = user?.sessions || [];

  // Refetch active sessions from server and update global auth context
  const refetchSessions = useCallback(async () => {
    try {
      const freshSessions = await sessionService.getAll();
      setUser((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          sessions: freshSessions,
        };
      });
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Initial fetch on mount
  useEffect(() => {
    refetchSessions();
  }, [refetchSessions]);

  // Revoke specific session and trigger fresh sync
  const revokeSession = async (sessionId: string) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const resData = await sessionService.revoke(sessionId);
          console.log("REQ++++++++++++++++++++++++++++++++++++++++++++++")
          if (resData?.success) {
            await refetchSessions();
            resolve(resData);
          } else {
            reject(new Error(resData?.message || "Failed to revoke session."));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // Revoke all other sessions and trigger fresh sync
  const revokeAllOtherSessions = async () => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const resData = await sessionService.revokeAllOthers();
          if (resData?.success) {
            await refetchSessions();
            resolve(resData);
          } else {
            reject(new Error(resData?.message || "Failed to revoke other sessions."));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  return {
    sessions,
    currentSessionId,
    isLoading,
    isProcessing: isPending,
    revokeSession,
    revokeAllOtherSessions,
    refetchSessions,
  };
}