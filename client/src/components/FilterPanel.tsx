type Category = {
  slug: string;
  name: string;
};

type FilterPanelProps = {
  categories: Category[];
  category: string;
  minPrice: string;
  maxPrice: string;
  updateFilter: (key: string, value: string) => void;
  clearFilter: () => void;
  hasFilters: boolean;
};

const FilterPanel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilter,
  hasFilters,
}: FilterPanelProps) => {
  const categoriesWithAll = [
    { slug: "", name: "All Categories" },
    ...categories,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-app-text-light">
            Refine results
          </p>
          <h3 className="mt-1 text-base font-semibold text-app-text">
            Filters
          </h3>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilter}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-app-error transition-colors hover:bg-red-50"
          >
            Clear filters
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-app-text">Categories</h4>

        <div className="flex flex-wrap gap-2">
          {categoriesWithAll.map((cat) => {
            const isActive = category === cat.slug;

            return (
              <button
                key={cat.slug}
                onClick={() => updateFilter("category", cat.slug)}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-app-green bg-app-green text-white shadow-sm"
                    : "border-app-border bg-white text-app-text-light hover:border-app-green/20 hover:bg-app-cream hover:text-app-text"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-app-text">
          Price range
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-app-text-light">
              Min price
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="h-11 w-full rounded-xl border border-app-border bg-white px-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green focus:ring-4 focus:ring-app-green/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-app-text-light">
              Max price
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="100"
              value={maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="h-11 w-full rounded-xl border border-app-border bg-white px-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green focus:ring-4 focus:ring-app-green/10"
            />
          </div>
        </div>
      </div>

      {hasFilters && (
        <div className="rounded-2xl bg-app-cream p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-app-text-light">
            Active filters
          </p>

          <div className="flex flex-wrap gap-2">
            {category && (
              <button
                onClick={() => updateFilter("category", "")}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-app-text transition-colors hover:bg-red-50 hover:text-app-error"
              >
                Category: {categories.find((c) => c.slug === category)?.name} ×
              </button>
            )}

            {minPrice && (
              <button
                onClick={() => updateFilter("minPrice", "")}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-app-text transition-colors hover:bg-red-50 hover:text-app-error"
              >
                Min: ${minPrice} ×
              </button>
            )}

            {maxPrice && (
              <button
                onClick={() => updateFilter("maxPrice", "")}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-app-text transition-colors hover:bg-red-50 hover:text-app-error"
              >
                Max: ${maxPrice} ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
