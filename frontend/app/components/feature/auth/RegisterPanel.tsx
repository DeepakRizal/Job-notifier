"use client";

import { apiFetch } from "@/app/lib/api";
import { isApiError } from "@/app/lib/errors";
import { AuthResponse } from "@/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Inputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPanel() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit = async (data: Inputs) => {
    try {
      const response = (await apiFetch("/auth/register", {
        method: "POST",
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      })) as AuthResponse;

      if (response.success) {
        router.push("/login");
      }
    } catch (error) {
      if (isApiError(error)) {
        const msg = error.message || "Registration failed";

        setError("root", { type: "server", message: msg });
      }
    }
  };

  return (
    <section className="ui-card ui-card-hover mx-auto max-w-md p-5 md:p-6 motion-safe:animate-[fadeIn_320ms_ease-out]">
      <div className="space-y-1.5 mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-text-title">
          Create your account
        </h2>
        <p className="text-xs text-text-muted">
          Start tracking your job applications in minutes.
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted" htmlFor="name">
            Full Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="ui-input"
            placeholder="Full name"
          />
          {errors.name && (
            <div className="text-sm text-center text-red-500">
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="email"
          >
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="ui-input"
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="text-sm text-center text-red-500">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="password"
          >
            Password
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="ui-input"
            placeholder="Enter your password"
          />
          <p className="text-[10px] text-text-muted">
            Must be at least 8 characters
          </p>

          {errors.password && (
            <div className="text-sm text-center text-red-500">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            id="confirm-password"
            type="password"
            className="ui-input"
            placeholder="confirm your password"
          />
          {errors.confirmPassword && (
            <div className="text-sm text-center text-red-500">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        {errors.root && (
          <div role="alert" className="text-sm text-center text-red-500">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          className="ui-btn-primary mt-1 w-full motion-safe:transition-transform motion-safe:active:scale-[0.98]"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="ui-btn-ghost px-0 py-0 text-[11px] font-medium text-accent hover:bg-transparent"
        >
          Sign in here
        </Link>
      </p>
    </section>
  );
}
