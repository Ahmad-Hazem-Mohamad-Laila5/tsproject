import React, { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
import { FiZap } from "react-icons/fi";

const Banner = () => {
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("banner_dismissed") === "true";
    setBannerVisible(!dismissed);
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);
    sessionStorage.setItem("banner_dismissed", "true");
  };

  if (!bannerVisible) return null;

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-app-green via-emerald-800 to-app-green text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <BsTruck className="size-4 shrink-0 text-emerald-100" />
            <span className="text-[11px] font-semibold tracking-wide sm:text-sm">
              Free delivery on orders above $20
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/20 sm:block" />

          <div className="hidden items-center gap-2 text-emerald-50 sm:flex">
            <span className="flex items-center justify-center rounded-full bg-yellow-400/15 p-1">
              <FiZap className="size-3.5 shrink-0 text-yellow-300" />
            </span>
            <span className="text-xs font-medium sm:text-sm">
              Farm-fresh produce delivered daily
            </span>
          </div>
        </div>

        <button
          onClick={dismissBanner}
          aria-label="Dismiss banner"
          className="absolute -right-20 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white"
        >
          <BiX className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
