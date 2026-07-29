// apps/web/app/account/services/sessionService.ts

import api from "@/lib/axios";


export interface SessionPayload {
  id: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  revoked: boolean;
  expiresAt: Date | string;
  lastUsedAt?: Date | string | null;
  createdAt?: Date | string;
}

export const sessionService = {
  // Fetch all sessions for the authenticated user
  async getAll(): Promise<SessionPayload[]> {
    const res = await api.get('http://localhost:4000/api/auth/account/sessions', {
      cache: false,
    });
    return res.data.sessions || res.data;
  },

  // Revoke a single active device session
  async revoke(sessionId: string) {
    const res = await api.post(`http://localhost:4000/api/auth/account/sessions/${sessionId}/revoke`);
    return res.data;
  },

  // Revoke all active sessions except the current one
  async revokeAllOthers() {
    const res = await api.post('http://localhost:4000/api/auth/account/sessions/revoke-others');
    return res.data;
  }
};