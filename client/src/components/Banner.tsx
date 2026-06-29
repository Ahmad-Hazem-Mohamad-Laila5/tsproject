import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
import { FiZap } from "react-icons/fi";

const Banner = () => {
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("banner_dismissed") === "true";
      setBannerVisible(!dismissed);
    } catch {
      setBannerVisible(true);
    }
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);

    try {
      sessionStorage.setItem("banner_dismissed", "true");
    } catch {
      //
    }
  };

  if (!bannerVisible) return null;

  return (
    <div className="relative overflow-hidden border-b border-app-border/30 bg-app-text text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.10),transparent_30%)]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 backdrop-blur-sm">
            <BsTruck className="size-3.5 shrink-0 text-app-orange" />
            <span className="text-[11px] font-semibold tracking-wide sm:text-sm">
              Free delivery on orders over $20
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/15 sm:block" />

          <div className="hidden items-center gap-2 text-white/80 sm:inline-flex">
            <FiZap className="size-3.5 text-yellow-300" />
            <span className="text-xs sm:text-sm">
              Fresh picks delivered daily
            </span>
          </div>
        </div>

        <button
          onClick={dismissBanner}
          aria-label="Dismiss banner"
          className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-white/75 transition-all duration-300 hover:bg-white/10 hover:text-white"
        >
          <BiX className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
