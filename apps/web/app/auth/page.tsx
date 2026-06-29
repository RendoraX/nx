"use client";

import { useState } from "react";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step =
  | "email"
  | "name"
  | "password"
  | "phone"
  | "verify"
  | "success";

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  otp: string;
}

const initialForm: Form = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  otp: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] =
    useState<Step>("email");

  const [form, setForm] =
    useState<Form>(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const steps: Step[] = [
    "email",
    "name",
    "password",
    "phone",
    "verify",
  ];

  const progress =
    step === "success"
      ? 100
      : ((steps.indexOf(step) + 1) /
          steps.length) *
        100;

  const update = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const back = () => {
    switch (step) {
      case "name":
        setStep("email");
        break;
      case "password":
        setStep("name");
        break;
      case "phone":
        setStep("password");
        break;
      case "verify":
        setStep("phone");
        break;
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            password: form.password,
            ...(form.phone && {
              phone: form.phone,
            }),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      setStep("verify");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/vtoken",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Verification failed"
        );
      }

      setStep("success");
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        {step !== "success" && (
          <>
            <div className="mb-8">
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Step{" "}
                {steps.indexOf(step) + 1} of{" "}
                {steps.length}
              </p>
            </div>

            {step !== "email" && (
              <button
                onClick={back}
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === "email" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              What's your email?
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              We'll use it to create your
              account.
            </p>

            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
            />

            <button
              disabled={!form.email}
              onClick={() =>
                setStep("name")
              }
              className="mt-6 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {step === "name" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              What's your name?
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              So we know what to call you.
            </p>

            <div className="space-y-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={update}
              />

              <Input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={update}
              />
            </div>

            <button
              disabled={!form.firstName}
              onClick={() =>
                setStep("password")
              }
              className="mt-6 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Create password
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Must be at least 8
              characters.
            </p>

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
            />

            <button
              disabled={
                form.password.length < 8
              }
              onClick={() =>
                setStep("phone")
              }
              className="mt-6 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {step === "phone" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Phone number
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Optional. Used for order
              updates.
            </p>

            <Input
              name="phone"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={update}
            />

            <button
              disabled={loading}
              onClick={register}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>

            <button
              onClick={register}
              className="mt-4 w-full text-sm text-slate-400"
            >
              Skip
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <h1 className="text-3xl font-bold text-white">
              Verify Email
            </h1>

            <p className="mt-2 mb-8 text-slate-400">
              Enter the code sent to
              <span className="font-semibold text-white">
                {" "}
                {form.email}
              </span>
            </p>

            <Input
              name="otp"
              placeholder="123456"
              value={form.otp}
              onChange={update}
            />

            <button
              onClick={verifyEmail}
              disabled={
                loading ||
                form.otp.length < 6
              }
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify Email"
              )}
            </button>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />

            <h1 className="mt-6 text-3xl font-bold text-white">
              Welcome 🎉
            </h1>

            <p className="mt-3 text-slate-400">
              Your account has been created.
            </p>

            <button
              onClick={() =>
                router.push("/login")
              }
              className="mt-8 h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white"
            >
              Continue
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