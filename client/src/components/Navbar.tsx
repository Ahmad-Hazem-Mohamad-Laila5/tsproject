import { useEffect, useState } from "react";
import {
  BiBasket,
  BiBox,
  BiChevronDown,
  BiLogOut,
  BiMap,
  BiMenu,
  BiPackage,
  BiSearch,
  BiShield,
  BiTag,
  BiUser,
  BiX,
} from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  // ✅ cartCount (مصحح)
  const { cartCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchSubmit(searchQuery);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-app-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to={"/"}
            className="flex shrink-0 items-center gap-2 text-lg font-semibold text-zinc-900 sm:text-[22px]"
          >
            <span className="flex size-8 items-center justify-center rounded-2xl bg-app-green text-white shadow-sm sm:size-9">
              <BiBasket size={20} />
            </span>
            <span>Instacart</span>
          </Link>

          <div className="flex w-full items-center justify-end gap-2 sm:gap-4 lg:gap-8">
            {/* Nav links - desktop */}
            <div className="hidden items-center gap-1 text-sm font-medium text-zinc-600 md:flex">
              <Link
                to={"/"}
                className="rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                Home
              </Link>
              <Link
                to={"/products"}
                className="rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                Products
              </Link>
              <Link
                className="rounded-full px-3 py-2 text-app-orange transition-colors hover:bg-orange-50"
                to={"/deals"}
              >
                Deals
              </Link>
            </div>

            {/* Search - desktop */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(searchQuery);
              }}
              className="hidden max-w-xs flex-1 text-sm sm:flex lg:max-w-sm"
            >
              <div className="relative w-full">
                <BiSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full border border-app-orange/10 bg-orange-50/70 pl-10 pr-4 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-app-orange/20 focus:bg-white focus:ring-4 focus:ring-app-orange/10"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Cart button */}
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-zinc-100"
                onClick={() => setIsCartOpen(true)}
                aria-label="Open cart"
              >
                <CgShoppingCart className="size-5 text-zinc-900" />
                {/* ✅ cartCount (مصحح) */}
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-app-orange text-[10px] font-semibold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User avatar - desktop */}
              <div className="relative hidden sm:block">
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-transparent p-1.5 pr-2 transition-all hover:border-zinc-200 hover:bg-zinc-50"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <BiChevronDown
                      className={`size-4 text-zinc-500 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={"/login"}
                    className="flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-app-green"
                  >
                    <BiUser size={16} />
                    Sign In
                  </Link>
                )}

                {/* Desktop dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-app-border bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                      {user && (
                        <div className="border-b border-app-border bg-zinc-50/80 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {user?.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            {user?.email}
                          </p>
                        </div>
                      )}
                      <div
                        className="flex flex-col p-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {user && (
                          <Link
                            to={"/orders"}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
                          >
                            <BiPackage size={17} /> My Orders
                          </Link>
                        )}
                        {user && (
                          <Link
                            to={"/addresses"}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
                          >
                            <BiMap size={17} /> Addresses
                          </Link>
                        )}
                        <Link
                          to={"/products"}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
                        >
                          <BiBox size={17} /> Products
                        </Link>
                        <Link
                          to={"/deals"}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
                        >
                          <BiTag size={17} /> Deals
                        </Link>
                        {user?.isAdmin && (
                          <Link
                            to={"/admin/products"}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50"
                          >
                            <BiShield
                              className="text-app-orange-dark"
                              size={17}
                            />
                            <span className="text-app-orange-dark">
                              Admin Panel
                            </span>
                          </Link>
                        )}
                        {user && (
                          <div className="mt-1 border-t border-app-border pt-2">
                            <button
                              onClick={logout}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-app-error transition-colors hover:bg-red-50"
                            >
                              <BiLogOut size={17} /> Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Hamburger - mobile only */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-zinc-100 sm:hidden"
                aria-label="Toggle menu"
              >
                <span
                  className={`absolute transition-all duration-300 ${
                    mobileMenuOpen
                      ? "rotate-0 opacity-100"
                      : "rotate-90 opacity-0"
                  }`}
                >
                  <BiX className="size-6 text-zinc-800" />
                </span>
                <span
                  className={`absolute transition-all duration-300 ${
                    mobileMenuOpen
                      ? "-rotate-90 opacity-0"
                      : "rotate-0 opacity-100"
                  }`}
                >
                  <BiMenu className="size-6 text-zinc-800" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-300 sm:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile side drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[82%] max-w-[340px] flex-col border-l border-app-border bg-white shadow-[0_0_60px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out sm:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <Link
            to={"/"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-semibold text-zinc-900"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-app-green text-white">
              <BiBasket size={17} />
            </span>
            Instacart
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
            aria-label="Close menu"
          >
            <BiX className="size-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="border-b border-app-border bg-gradient-to-br from-zinc-50 to-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-lg font-bold text-white shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search - mobile */}
        <div className="border-b border-app-border px-4 py-3">
          <div className="relative">
            <BiSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchSubmit(searchQuery);
                  setMobileMenuOpen(false);
                }
              }}
              className="h-10 w-full rounded-full border border-app-orange/10 bg-orange-50/70 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-app-orange/20 focus:bg-white focus:ring-4 focus:ring-app-orange/10"
            />
          </div>
        </div>

        {/* Links */}
        <div
          className="flex flex-1 flex-col overflow-y-auto p-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <p className="mb-1 px-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Navigation
          </p>

          <Link
            to={"/"}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-zinc-100">
              🏠
            </span>
            Home
          </Link>

          <Link
            to={"/products"}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-orange-50">
              <BiBox className="size-4 text-app-orange" />
            </span>
            Products
          </Link>

          <Link
            to={"/deals"}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-app-orange transition-colors hover:bg-orange-50"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-orange-50">
              <BiTag className="size-4 text-app-orange" />
            </span>
            Deals
          </Link>

          {user && (
            <>
              <p className="mb-1 mt-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                My Account
              </p>

              <Link
                to={"/orders"}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
              >
                <span className="flex size-8 items-center justify-center rounded-xl bg-orange-50">
                  <BiPackage className="size-4 text-app-orange" />
                </span>
                My Orders
              </Link>

              <Link
                to={"/addresses"}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-orange-50 hover:text-app-orange"
              >
                <span className="flex size-8 items-center justify-center rounded-xl bg-orange-50">
                  <BiMap className="size-4 text-app-orange" />
                </span>
                Addresses
              </Link>
            </>
          )}

          {user?.isAdmin && (
            <>
              <p className="mb-1 mt-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Admin
              </p>
              <Link
                to={"/admin/products"}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-orange-50"
              >
                <span className="flex size-8 items-center justify-center rounded-xl bg-orange-100">
                  <BiShield className="size-4 text-app-orange-dark" />
                </span>
                <span className="text-app-orange-dark">Admin Panel</span>
              </Link>
            </>
          )}

          {!user && (
            <Link
              to={"/login"}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gray-950 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-app-green"
            >
              <BiUser size={17} />
              Sign In
            </Link>
          )}
        </div>

        {/* Logout */}
        {user && (
          <div className="border-t border-app-border p-3">
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-app-error transition-colors hover:bg-red-50">
              <span className="flex size-8 items-center justify-center rounded-xl bg-red-50">
                <BiLogOut className="size-4 text-app-error" />
              </span>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
