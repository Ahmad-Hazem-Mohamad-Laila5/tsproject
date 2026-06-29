import { heroSectionData } from "../../assets/assets";

const Features = () => {
  return (
    <section >
      <div className="rounded-[28px] border border-app-border/70 bg-gradient-to-br from-white to-app-cream p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {heroSectionData.hero_features.map((fe, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[22px] border border-transparent bg-white/80 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-app-border hover:bg-white hover:shadow-md sm:px-5"
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-app-orange/5 blur-2xl transition-all duration-300 group-hover:bg-app-orange/10" />

              <div className="relative flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-app-border/60 bg-app-cream shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
                  <fe.icon className="size-5 text-app-green" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-app-text sm:text-[15px]">
                    {fe.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-app-text-light sm:text-[13px]">
                    {fe.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-gradient-to-r from-app-border/0 via-app-border/70 to-app-border/0 opacity-70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
