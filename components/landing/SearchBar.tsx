"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { NIGERIAN_STATES, PROPERTY_TYPES, PRICE_RANGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Tab = "location" | "type" | "price";

const TABS: { id: Tab; label: string; icon: typeof MapPin }[] = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "type", label: "Property Type", icon: Home },
  { id: "price", label: "Budget", icon: DollarSign },
];

export default function SearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("location");
  const [state, setState] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    router.push(`/explore?${params.toString()}`);
  }

  return (
    <section
      className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-0"
      aria-label="Property search"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.07), 0 24px 60px -12px rgba(0,0,0,0.14)",
            border: "1px solid #e8e8e4",
          }}
        >
          {/* Tab Bar */}
          <div className="flex border-b border-[#e8e8e4] px-2 pt-2 gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all duration-150 relative",
                  activeTab === id
                    ? "text-[#4f6af5] bg-[#f0f4ff]"
                    : "text-[#637099] hover:text-[#1c2038] hover:bg-[#f5f5f3]"
                )}
                aria-selected={activeTab === id}
                role="tab"
              >
                <Icon size={13} />
                {label}
                {activeTab === id && (
                  <span
                    className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[#4f6af5]"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4">
            {/* Location Select */}
            <div className="flex-1 relative">
              <label
                htmlFor="state-select"
                className="block text-[10px] font-semibold uppercase tracking-wider text-[#a8a89e] mb-1.5 px-1"
              >
                Select your state
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8494b8]"
                  aria-hidden="true"
                />
                <select
                  id="state-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-[#f8f9fc] border border-[#e8e8e4] rounded-xl text-sm text-[#1c2038] appearance-none focus:outline-none focus:ring-2 focus:ring-[#4f6af5]/30 focus:border-[#4f6af5] transition-all cursor-pointer"
                  aria-label="Select state"
                >
                  <option value="">Any state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden sm:block w-px self-stretch bg-[#e8e8e4] my-2"
              aria-hidden="true"
            />

            {/* Property Type */}
            <div className="flex-1 relative">
              <label
                htmlFor="type-select"
                className="block text-[10px] font-semibold uppercase tracking-wider text-[#a8a89e] mb-1.5 px-1"
              >
                Property type
              </label>
              <div className="relative">
                <Home
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8494b8]"
                  aria-hidden="true"
                />
                <select
                  id="type-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-[#f8f9fc] border border-[#e8e8e4] rounded-xl text-sm text-[#1c2038] appearance-none focus:outline-none focus:ring-2 focus:ring-[#4f6af5]/30 focus:border-[#4f6af5] transition-all cursor-pointer"
                  aria-label="Select property type"
                >
                  <option value="">Any type</option>
                  {PROPERTY_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden sm:block w-px self-stretch bg-[#e8e8e4] my-2"
              aria-hidden="true"
            />

            {/* Price Range */}
            <div className="flex-1 relative">
              <label
                htmlFor="price-select"
                className="block text-[10px] font-semibold uppercase tracking-wider text-[#a8a89e] mb-1.5 px-1"
              >
                Budget range
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8494b8]"
                  aria-hidden="true"
                />
                <select
                  id="price-select"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-[#f8f9fc] border border-[#e8e8e4] rounded-xl text-sm text-[#1c2038] appearance-none focus:outline-none focus:ring-2 focus:ring-[#4f6af5]/30 focus:border-[#4f6af5] transition-all cursor-pointer"
                  aria-label="Select budget range"
                >
                  <option value="">Any budget</option>
                  {PRICE_RANGES.map((r) => (
                    <option key={r.label} value={`${r.min}-${r.max}`}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] mt-5 sm:mt-0 self-end sm:self-center"
              style={{
                background: "linear-gradient(135deg, #1c2038 0%, #2d3250 100%)",
                minWidth: "140px",
              }}
              aria-label="Search properties"
            >
              <Search size={15} />
              Search
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"].map((city) => (
              <button
                key={city}
                onClick={() => setState(city === "Abuja" ? "FCT - Abuja" : city)}
                className="px-3 py-1 text-xs font-medium text-[#637099] bg-[#f8f9fc] border border-[#e8e8e4] rounded-full hover:border-[#a5bcfd] hover:text-[#4f6af5] hover:bg-[#f0f4ff] transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
