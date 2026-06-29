"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step =
  | "email"
  | "password"
  | "forgot";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] =
    useState<Step>("email");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Invalid credentials"
        );
      }

      // save token
      localStorage.setItem(
        "token",
        data.token
      );

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (step === "password") {
      setStep("email");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        {step === "password" && (
          <button
            onClick={back}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === "email" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Welcome back
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Enter your email to continue.
            </p>

            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button
              disabled={!email}
              onClick={() =>
                setStep("password")
              }
              className="mt-6 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button
                onClick={() =>
                  router.push("/auth")
                }
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Enter password
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              {email}
            </p>

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              disabled={
                !password || loading
              }
              onClick={login}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            <button
              className="mt-4 w-full text-sm text-indigo-400 hover:text-indigo-300"
              onClick={() =>
                router.push(
                  "/forgot-password"
                )
              }
            >
              Forgot password?
            </button>
          </>
        )}
      </div>
    </main>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
    />
  );
}