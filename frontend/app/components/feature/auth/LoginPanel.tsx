"use client";

import { apiFetch } from "@/lib/api";
import { isApiError } from "@/lib/errors";
import { useUserStore } from "@/lib/stores/user-store";
import { AuthResponse } from "@/types/user";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

interface Inputs {
  email: string;
  password: string;
}

export function LoginPanel() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();

  const { setUser } = useUserStore(
    useShallow((s) => ({
      setUser: s.setUser,
    }))
  );

  const onSubmit = async (data: Inputs) => {
    try {
      const response = (await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        data: { email: data.email, password: data.password },
      })) as AuthResponse;

      setUser(response.user);

      if (response.success) {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      if (isApiError(error)) {
        const msg = error.message || "Login failed";

        setError("root", { type: "server", message: msg });
      }
    }
  };

  return (
    <section className="ui-card ui-card-hover mx-auto max-w-md p-6 md:p-8 motion-safe:animate-[fadeIn_320ms_ease-out]">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-text-title">
          Sign in to your dashboard
        </h2>
        <p className="text-xs text-text-muted">
          Use the same email you used to set up job alerts.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="email"
          >
            Email
          </label>
          <input
            {...register("email", {
              required: "Email is Required",
            })}
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
            {...register("password", {
              required: "Password is Required",
            })}
            id="password"
            type="password"
            className="ui-input"
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="text-sm text-red-500">
              {errors.password.message}
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
          className="ui-btn-primary mt-2 w-full motion-safe:transition-transform motion-safe:active:scale-[0.98]"
        >
          {isSubmitting ? "Loging in...." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="ui-btn-ghost px-0 py-0 text-[11px] font-medium text-accent hover:bg-transparent"
        >
          Register here
        </a>
      </p>
    </section>
  );
}
