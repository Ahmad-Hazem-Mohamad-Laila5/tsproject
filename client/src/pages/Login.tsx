import React, { useState } from "react";
import herobg from "../assets/hero_bg.jpeg";
import { Link } from "react-router-dom";
import { BiBasket, BiUser } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CgPassword } from "react-icons/cg";
import toast, { LoaderIcon } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginState) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-cream lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-app-green">
        <img
          src={herobg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-app-green/95 via-app-green/90 to-app-green-light/80" />

        <div className="relative z-10 max-w-md px-10 text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
            Fresh groceries, faster checkout
          </div>

          <h2 className="mb-4 text-4xl font-semibold leading-tight">
            Welcome back to your everyday essentials
          </h2>

          <p className="text-base leading-7 text-white/70">
            Sign in to manage orders, save favorites, and check out faster with
            a smoother shopping experience.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md rounded-[28px] border border-app-border/60 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-app-green text-white">
                <BiBasket className="size-6" />
              </span>
              <span className="text-2xl font-semibold text-app-green">
                INSAS
              </span>
            </Link>

            <h1 className="mb-2 text-2xl font-semibold text-app-text">
              {isLoginState ? "Sign in to your account" : "Create your account"}
            </h1>

            <p className="text-sm text-app-text-light">
              {isLoginState ? "New here?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLoginState((prev) => !prev)}
                className="ml-1 font-semibold text-app-orange transition-colors hover:text-app-orange-dark"
              >
                {isLoginState ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginState && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-app-text"
                >
                  Full name
                </label>
                <div className="relative">
                  <BiUser className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-app-border bg-white pl-11 pr-4 text-sm text-app-text outline-none transition-all placeholder:text-app-text-light/70 focus:border-app-green focus:ring-4 focus:ring-app-green/10"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-app-text"
              >
                Email address
              </label>
              <div className="relative">
                <MdEmail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  inputMode="email"
                  className="h-12 w-full rounded-xl border border-app-border bg-white pl-11 pr-4 text-sm text-app-text outline-none transition-all placeholder:text-app-text-light/70 focus:border-app-green focus:ring-4 focus:ring-app-green/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-app-text"
              >
                Password
              </label>
              <div className="relative">
                <CgPassword className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete={
                    isLoginState ? "current-password" : "new-password"
                  }
                  className="h-12 w-full rounded-xl border border-app-border bg-white pl-11 pr-12 text-sm text-app-text outline-none transition-all placeholder:text-app-text-light/70 focus:border-app-green focus:ring-4 focus:ring-app-green/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-app-text-light transition-colors hover:bg-app-cream hover:text-app-text"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="size-4" />
                  ) : (
                    <FiEye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {isLoginState && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-app-green transition-colors hover:text-app-green-light"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-app-green text-sm font-semibold text-white transition-colors hover:bg-app-green-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoaderIcon className="animate-spin" />
              ) : isLoginState ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-6 text-app-text-light">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
