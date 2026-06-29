import React, { useEffect, useState } from "react";
import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/OrderTracking/AddressCard";
import AddressForm from "../components/OrderTracking/AddressForm";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Addresses = () => {
  const { updateUser } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLocation = (retries = 2): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported on this device"));
        return;
      }

      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error: GeolocationPositionError) => {
            if (retries > 0) {
              retries -= 1;
              setTimeout(attempt, 800);
            } else {
              reject(
                new Error(error.message || "Failed to get current location"),
              );
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 12000,
            maximumAge: 60000,
          },
        );
      };

      attempt();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let coords = {};

      try {
        coords = await getLocation();
      } catch {
        // Address save should still continue without geolocation.
      }

      const payload = { ...form, ...coords };

      if (editingId) {
        const { data } = await api.put(`/addresses/${editingId}`, payload);
        setAddresses(data.addresses || []);
        updateUser({ addresses: data.addresses });
        toast.success("Address updated successfully");
      } else {
        const { data } = await api.post(`/addresses`, payload);
        setAddresses(data.addresses || []);
        updateUser({ addresses: data.addresses });
        toast.success("Address added successfully");
      }

      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save address",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onEditHandler = (addr: Address) => {
    setForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  useEffect(() => {
    api
      .get("/addresses")
      .then(({ data }) => {
        setAddresses(data.addresses || []);
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load addresses",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
              Account
            </span>
            <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Saved addresses
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Manage delivery locations for faster and smoother checkout.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-app-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-app-green-light"
          >
            <PlusIcon className="size-4" />
            Add address
          </button>
        </div>

        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingId={editingId}
            submitting={submitting}
          />
        )}

        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="rounded-[28px] border border-app-border/70 bg-white px-6 py-16 text-center shadow-sm">
            <MapPinIcon className="mx-auto mb-4 size-14 text-app-border" />
            <h2 className="mb-2 text-lg font-semibold text-app-text">
              No saved addresses
            </h2>
            <p className="mx-auto mb-5 max-w-md text-sm text-app-text-light">
              Add your delivery address now to speed up checkout and make future
              orders easier.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-app-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
            >
              <PlusIcon className="size-4" />
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
