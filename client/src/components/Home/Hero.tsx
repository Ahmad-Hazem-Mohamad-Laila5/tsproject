import { BiRightArrowAlt, BiStar, BiPackage, BiTimeFive } from "react-icons/bi";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Hero = () => {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[28px] min-h-[420px] lg:min-h-[470px]">
      <img
        src={assets.vege}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-app-text/90 via-app-text/65 to-app-text/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-app-text/35 via-transparent to-app-orange/10" />

      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-app-green/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-app-orange/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[420px] max-w-[1400px] items-center px-4 py-12 sm:px-6 lg:min-h-[470px] lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 backdrop-blur-md">
              <BiStar className="size-4 text-app-orange" />
              Fresh picks, delivered smarter
            </span>

            <h1 className="max-w-2xl text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              Better groceries for a
              <span className="block text-app-green-light">
                faster, cleaner routine
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-[15px]">
              Discover quality essentials, fresh produce, and everyday favorites
              in a shopping experience designed to feel simple, fast, and
              beautifully organized.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-app-green px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-app-green/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-app-green-light active:scale-[0.98]"
              >
                Shop now
                <BiRightArrowAlt className="size-5" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 active:scale-[0.98]"
              >
                Browse categories
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-slate-100 backdrop-blur-md">
                <BiPackage className="size-5 text-app-orange" />
                Curated daily essentials
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-slate-100 backdrop-blur-md">
                <BiTimeFive className="size-5 text-app-green-lighter" />
                Fast delivery windows
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="w-full max-w-[320px] rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-2xl shadow-black/10">
              <div className="rounded-[20px] bg-white/95 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-app-text-light">
                      This week
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-app-text">
                      Fresh arrivals
                    </h3>
                  </div>
                  <span className="rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold text-app-orange">
                    New
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: "Organic vegetables", sub: "Picked today" },
                    { name: "Seasonal fruits", sub: "Top quality selection" },
                    { name: "Daily dairy & bakery", sub: "Ready for delivery" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-app-border bg-app-cream px-3.5 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-app-text">
                          {item.name}
                        </p>
                        <p className="text-[12px] text-app-text-light">
                          {item.sub}
                        </p>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full bg-app-green" />
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-xl bg-app-text px-4 py-4 text-white">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">
                    Exclusive offer
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">Up to 30% off</p>
                      <p className="text-xs text-white/70">
                        On selected essentials
                      </p>
                    </div>
                    <span className="rounded-full bg-app-green px-3 py-1 text-[11px] font-semibold">
                      Limited
                    </span>
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

export default Hero;
