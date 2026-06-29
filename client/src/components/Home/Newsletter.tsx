import { MailOpenIcon } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="mx-auto mt-24 mb-20 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[30px] border border-app-border/70 bg-gradient-to-br from-white via-app-cream to-white px-6 py-12 shadow-sm sm:px-8 lg:px-12">
        <div className="absolute -top-10 left-0 h-32 w-32 rounded-full bg-app-green/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-app-orange/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-app-border/60 bg-white shadow-sm">
            <MailOpenIcon
              className="size-7 text-app-green"
              strokeWidth={1.75}
            />
          </div>

          <span className="mb-3 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
            Stay updated
          </span>

          <h2 className="text-3xl font-semibold text-app-text sm:text-4xl">
            Subscribe to our newsletter
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-app-text-light sm:text-base">
            Get weekly updates on fresh arrivals, seasonal picks, exclusive
            offers, and smart shopping tips delivered straight to your inbox.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-[22px] border border-app-border/70 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center rounded-2xl bg-app-cream px-4 py-3">
              <MailOpenIcon
                className="mr-3 size-5 shrink-0 text-app-text-light"
                strokeWidth={1.75}
              />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-light"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-app-green px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-app-green-light active:scale-[0.98] whitespace-nowrap"
            >
              Subscribe now
            </button>
          </form>

          <p className="mt-4 text-xs text-app-text-light">
            No spam, just useful updates and exclusive offers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
