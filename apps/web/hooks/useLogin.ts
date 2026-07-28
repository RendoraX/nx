// apps/web/hooks/useLogin.ts
import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "../providers/AuthProviders";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { refreshSession } = useAuthContext();

  const login = async (
    credentials: Record<string, any>,
    redirectTo: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const data = await AuthService.login(credentials);

      console.log("LOGIN SUCCESS:", data);

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // 1. Refresh global user context state
      await refreshSession();

      // 2. Prevent redirect loops if target is /login
      const target = redirectTo === "/login" ? "/account" : redirectTo;
      const safeRedirect =
        target && target.startsWith("/")
          ? target
          : "/account";

      console.log("GOING TO:", safeRedirect);

      router.replace(safeRedirect);

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      toast(err.message || "Check your credentials and try again.");
      setError(
        err?.message || "Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}