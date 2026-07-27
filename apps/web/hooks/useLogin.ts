// apps/web/hooks/useLogin.ts
import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

      const safeRedirect =
        redirectTo && redirectTo.startsWith("/")
          ? redirectTo
          : "/account";

      console.log("GOING TO:", safeRedirect);

      router.replace(safeRedirect);
      router.refresh();

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      toast(err.message);
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