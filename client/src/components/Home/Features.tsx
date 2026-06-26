import React from "react";
import { heroSectionData } from "../../assets/assets";

const Features = () => {
  return (
    <section className="bg-white py-2 border border-app-border/60 rounded-2xl shadow-sm overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-app-border/40">
          {heroSectionData.hero_features.map((fe, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 px-4 py-5 transition-colors duration-200 hover:bg-app-cream/40 first:rounded-tl-2xl last:rounded-br-2xl"
            >
              {/* Icon container */}
              <div className="size-11 rounded-xl bg-app-cream flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                <fe.icon className="size-5 text-app-green" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-app-green leading-snug">
                  {fe.title}
                </p>
                <p className="text-xs text-app-text-light leading-relaxed mt-0.5 truncate">
                  {fe.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;