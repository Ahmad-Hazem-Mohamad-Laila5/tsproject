import React, { useRef } from "react";
import { categoriesData } from "../../assets/assets";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeCategories = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Browse Categories</h2>
            <p className="text-sm text-app-text-light mt-1">
              Find exactly what you need using
            </p>
          </div>

          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="size-9 rounded-full border border-app-border/60 bg-white flex items-center justify-center text-zinc-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="size-9 rounded-full border border-app-border/60 bg-white flex items-center justify-center text-zinc-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div
          ref={scrollRef}
          className="flex items-center mt-8 overflow-x-scroll no-scrollbar scroll-smooth"
        >
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="group flex flex-col items-center gap-3 p-4"
            >
              <div className="size-18 sm:size-26 sm:p-2 rounded-2xl overflow-hidden bg-orange-100 group-hover:ring-2 ring-orange-300/75 transition-all">
                <img
                  src={cat.image}
                  className="w-full h-full object-contain rounded-full transition-all"
                  alt={cat.name}
                />
              </div>
              <span className="text-xs font-medium text-zinc-600 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;