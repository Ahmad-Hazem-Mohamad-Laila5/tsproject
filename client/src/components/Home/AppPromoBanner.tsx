import { appPromoBannerData, assets } from "../../assets/assets";
import {
  BiLogoApple,
  BiLogoPlayStore,
  BiCheckShield,
  BiTimeFive,
} from "react-icons/bi";

const AppPromoBanner = () => {
  return (
    <section className="mx-auto my-14 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[30px] border border-app-border bg-gradient-to-br from-app-text via-app-green to-app-orange p-6 sm:p-8 lg:p-10">
        <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-app-orange/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-app-green-light/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl text-center md:text-left">
            <span className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 backdrop-blur-md">
              Mobile shopping experience
            </span>

            <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
              {appPromoBannerData.title}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 md:mx-0 mx-auto sm:text-base">
              {appPromoBannerData.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <button className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-left text-app-text shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]">
                <BiLogoApple className="size-6 shrink-0" />
                <span>
                  <span className="block text-[11px] text-app-text-light">
                    Download on the
                  </span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </button>

              <button className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-left text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 active:scale-[0.98]">
                <BiLogoPlayStore className="size-6 shrink-0" />
                <span>
                  <span className="block text-[11px] text-white/60">
                    Get it on
                  </span>
                  <span className="block text-sm font-semibold">
                    Google Play
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-slate-100 backdrop-blur-md">
                <BiCheckShield className="size-5 text-app-orange" />
                Secure checkout
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-slate-100 backdrop-blur-md">
                <BiTimeFive className="size-5 text-app-green-lighter" />
                Faster ordering
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[360px]">
              <div className="absolute inset-0 rounded-[30px] bg-white/10 blur-2xl" />
              <div className="relative rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-2xl shadow-black/10">
                <div className="rounded-[24px] bg-app-cream p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-app-text-light">
                        App preview
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-app-text">
                        Smarter grocery delivery
                      </h3>
                    </div>
                    <span className="rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold text-app-orange">
                      New
                    </span>
                  </div>

                  <div className="rounded-[20px] bg-white p-4 shadow-sm">
                    <img
                      src={assets.delivery_truck}
                      alt="Delivery illustration"
                      className="mx-auto h-40 w-auto object-contain sm:h-48"
                    />
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between rounded-xl border border-app-border bg-white px-4 py-3">
                      <span className="text-sm font-medium text-app-text">
                        Live order tracking
                      </span>
                      <span className="h-2.5 w-2.5 rounded-full bg-app-green" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-app-border bg-white px-4 py-3">
                      <span className="text-sm font-medium text-app-text">
                        Easy reordering
                      </span>
                      <span className="h-2.5 w-2.5 rounded-full bg-app-orange" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoBanner;
