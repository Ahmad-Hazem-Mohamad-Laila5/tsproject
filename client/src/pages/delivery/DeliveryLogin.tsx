import { useEffect, useState } from "react";
import { BikeIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import api from "../../config/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DeliveryLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/delivery/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("delivery_token", data.token);
      localStorage.setItem("delivery_partner", JSON.stringify(data.partner));

      toast.success("Signed in successfully.");
      navigate("/delivery");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to sign in right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("delivery_token")) {
      navigate("/delivery");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-app-cream lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-app-green lg:flex lg:min-h-screen lg:items-center lg:justify-center">
        <img
          src={heroSectionData.hero_image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />

        <div className="relative z-10 max-w-md px-10 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
            <BikeIcon className="size-8" />
          </div>

          <h2 className="mb-4 text-4xl font-semibold text-white">
            Delivery Partner Portal
          </h2>

          <p className="text-base leading-7 text-white/70">
            Track deliveries, manage assigned orders, and stay updated
            throughout your shift.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-app-green/10 px-4 py-1.5 text-sm font-medium text-app-green">
              <ShieldCheckIcon className="size-4" />
              Secure access
            </div>

            <div className="mb-4 flex items-center justify-center gap-2">
              <BikeIcon className="size-7 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                FreshCart
              </span>
            </div>

            <h1 className="mb-2 text-2xl font-semibold text-app-text sm:text-3xl">
              Delivery partner login
            </h1>

            <p className="text-sm text-app-text-light">
              Sign in to manage deliveries and order updates.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="delivery-email"
                  className="mb-1.5 block text-sm font-medium text-app-text"
                >
                  Email
                </label>
                <input
                  id="delivery-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-password"
                  className="mb-1.5 block text-sm font-medium text-app-text"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="delivery-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-app-border bg-white px-4 py-3 pr-12 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-app-text-light transition-colors hover:text-app-green"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs leading-5 text-app-text-light">
                  This portal is for registered delivery partners only.
                </p>

                <button
                  type="button"
                  className="text-xs font-medium text-app-green transition-colors hover:text-app-green-light"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-app-green py-3 text-sm font-semibold text-white transition-colors hover:bg-app-green-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
