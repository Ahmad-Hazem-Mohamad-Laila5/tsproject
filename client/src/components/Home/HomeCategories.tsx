import  { useRef } from "react";
import { categoriesData } from "../../assets/assets";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeCategories = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
              Collections
            </span>
            <h2 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Browse categories
            </h2>
            <p className="mt-1 text-sm text-app-text-light">
              Explore curated groups designed for faster shopping.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex size-10 items-center justify-center rounded-full border border-app-border bg-white text-app-text-light shadow-sm transition-all duration-300 hover:border-app-green/30 hover:bg-app-green/5 hover:text-app-green"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex size-10 items-center justify-center rounded-full border border-app-border bg-white text-app-text-light shadow-sm transition-all duration-300 hover:border-app-orange/30 hover:bg-app-orange/5 hover:text-app-orange"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="group min-w-[180px] sm:min-w-[200px] shrink-0"
            >
              <div className="rounded-[22px] border border-app-border/70 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-app-green/20 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-app-cream border border-app-border/50">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-app-text">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-app-text-light">Shop now</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          <button
            onClick={() => scroll("left")}
            className="flex size-9 items-center justify-center rounded-full border border-app-border bg-white text-app-text-light shadow-sm transition-all hover:border-app-green/30 hover:bg-app-green/5 hover:text-app-green"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex size-9 items-center justify-center rounded-full border border-app-border bg-white text-app-text-light shadow-sm transition-all hover:border-app-orange/30 hover:bg-app-orange/5 hover:text-app-orange"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
