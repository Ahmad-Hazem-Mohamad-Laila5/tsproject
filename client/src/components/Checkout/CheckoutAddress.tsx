import { MapPinIcon, PlusIcon, CheckIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import type { Address } from "../../types";

interface CheckoutAddressProps {
  user: {
    addresses?: Address[];
  } | null;
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
}

const CheckoutAddress = ({
  user,
  address,
  setAddress,
}: CheckoutAddressProps) => {
  const addresses = user?.addresses || [];

  const isSelected = (addr: Address) => {
    if (addr.id && address.id) return addr.id === address.id;
    return addr.label === address.label && addr.address === address.address;
  };

  return (
    <section className="rounded-[24px] border border-app-border/70 bg-white p-6 shadow-sm animate-fade-in">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-app-text">
          <MapPinIcon className="size-5 text-app-green" />
          Delivery address
        </h2>
        <p className="mt-1 text-sm text-app-text-light">
          Choose where you want your order delivered.
        </p>
      </div>

      {addresses.length > 0 ? (
        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-app-text">
              Saved addresses
            </h3>
            <Link
              to="/addresses"
              className="text-xs font-medium text-app-green transition-colors hover:text-app-green-light"
            >
              Manage addresses
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((addr) => {
              const active = isSelected(addr);

              return (
                <button
                  key={addr.id || `${addr.label}-${addr.address}`}
                  type="button"
                  onClick={() =>
                    setAddress({
                      id: addr.id || "",
                      label: addr.label,
                      address: addr.address,
                      city: addr.city,
                      state: addr.state,
                      zip: addr.zip,
                      isDefault: addr.isDefault || false,
                      lat: addr.lat || 0,
                      lng: addr.lng || 0,
                    })
                  }
                  className={`relative rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-app-green bg-app-green/5 shadow-sm"
                      : "border-app-border hover:border-app-green/25 hover:bg-app-cream/40"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex size-8 items-center justify-center rounded-xl ${
                          active
                            ? "bg-app-green text-white"
                            : "bg-app-cream text-app-green"
                        }`}
                      >
                        <MapPinIcon className="size-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-app-text">
                          {addr.label}
                        </p>
                        {addr.isDefault && (
                          <span className="mt-1 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-app-orange">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {active && (
                      <div className="flex size-6 items-center justify-center rounded-full bg-app-green text-white">
                        <CheckIcon className="size-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-sm leading-6 text-app-text-light">
                    {addr.address}
                  </p>
                  <p className="mt-1 text-xs text-app-text-light">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl bg-app-cream/70 p-5">
          <p className="text-sm text-app-text-light">
            You do not have a saved address yet. Add one to continue with
            checkout.
          </p>
        </div>
      )}

      <Link
        to="/addresses"
        className="inline-flex items-center gap-2 rounded-xl border border-app-border px-4 py-2.5 text-sm font-medium text-app-text transition-colors hover:bg-app-cream"
      >
        <PlusIcon className="size-4" />
        Add new address
      </Link>
    </section>
  );
};

export default CheckoutAddress;
