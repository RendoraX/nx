"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step =
  | "email"
  | "otp"
  | "password"
  | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] =
    useState<Step>("email");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to send OTP"
        );
      }

      setStep("otp");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Invalid OTP"
        );
      }

      setStep("password");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Reset failed"
        );
      }

      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    switch (step) {
      case "otp":
        setStep("email");
        break;
      case "password":
        setStep("otp");
        break;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        {step !== "email" &&
          step !== "success" && (
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
              Forgot Password
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Enter your email to receive
              a verification code.
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
              disabled={!email || loading}
              onClick={sendOtp}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Verify OTP
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Enter the code sent to
              <span className="font-semibold text-white">
                {" "}
                {email}
              </span>
            </p>

            <Input
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <button
              disabled={
                otp.length < 6 || loading
              }
              onClick={verifyOtp}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              New Password
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Create a new password.
            </p>

            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              disabled={
                password.length < 8 ||
                loading
              }
              onClick={resetPassword}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />

            <h1 className="mt-6 text-3xl font-bold text-white">
              Password Updated
            </h1>

            <p className="mt-3 text-slate-400">
              You can now login with your
              new password.
            </p>

            <button
              onClick={() =>
                router.push("/login")
              }
              className="mt-8 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white"
            >
              Back to Login
            </button>
          </div>
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