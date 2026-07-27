// apps/web/services/auth.service.ts
import api from '@/lib/axios';

export const AuthService = {
  /**
   * Registers a new account footprint. Does not log user in automatically 
   * to satisfy strict secure verification flow.
   */
  async register(data: Record<string, any>): Promise<any> {
    try {
      const response = await api.post('http://localhost:4000/api/auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('AuthService register error:', error);
      throw error?.response?.data || new Error('Registration failed across server layers.');
    }
  },

  /**
   * Performs the operation so that user can ask for new otp share
   */
  async resendVerificationOtp(email : string){
    try {
        await api.post("http://localhost:4000/api/auth/resend-verification" , {email})
    } catch (error : any) {
        console.error('AuthService resend verification mail error' , error);
        throw error?.response?.data?.error || new Error("Otp resend logic failed in backend")
    }
  },
  /**
   * Performs standard authentication. Resolves access tokens safely.
   */
  async login(data: Record<string, any>): Promise<any> {
    try {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    } catch (error: any) {
      console.error('AuthService login error:', error);
      throw error?.response?.data || new Error('Authentication parameters rejected.');
    }
  },

  /**
   * Invalidates remote sessions and triggers server cookie removal sweeps.
   */
  async logout(): Promise<any> {
    try {
      const response = await api.post('http://localhost:4000/api/auth/logout');
      return response.data;
    } catch (error: any) {
      console.error('AuthService logout error:', error);
      throw error?.response?.data || new Error('Session termination rejected.');
    }
  },
  /**
   * Invalidates remote sessions and triggers server cookie removal sweeps.
   */
  async logoutAll(): Promise<any> {
    try {
      const response = await api.post('http://localhost:4000/api/auth/logout-all');
      return response.data;
    } catch (error: any) {
      console.error('AuthService logout error:', error);
      throw error?.response?.data || new Error('Session termination rejected.');
    }
  },

  /**
   * Generates a generic payload notification request for password modifications.
   * Returns a generic success response to prevent account enumeration.
   */
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      // Return a generic success indicator even if email does not exist to block exploitation
      return { success: true, message: 'If this account is registered, a link will arrive shortly.' };
    }
  },

  /**
   * Uses validation verification tokens to finalize credentials overrides.
   */
  async resetPassword(data: Record<string, any>): Promise<any> {
    try {
      const response = await api.post('/api/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('AuthService resetPassword error:', error);
      throw error?.response?.data || new Error('Token expired or credential verification parameters invalid.');
    }
  },

  /**
   * Confirms email ownership tokens during user boarding lifecycle steps.
   */
  async verifyEmail(token: string): Promise<any> {
    try {
      const response = await api.post('http://localhost:4000/api/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      console.error('AuthService verifyEmail error:', error);
      throw error?.response?.data || new Error('Activation token expired or signature failed verification checks.');
    }
  },

  /**
   * Queries active session profiles utilizing background token verification parameters.
   */
  async me(): Promise<any> {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || new Error('Active authorization trace unverified.');
    }
  }
};